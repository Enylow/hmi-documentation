# `keyframes`: animation clips, state machines, layering and playback

[← Documentation home](../README.md) · [API index](../reference/API_INDEX.md)

`keyframes` is registered in the **active script environment** from `KeyframeBinding`. It controls runtime playback of clips loaded by `Loader:loadKeyframeSequence(...)` or generated from Blueprints. It is not identical to the editor's selected keyframe or playhead.

## Modern options-table style (recommended)

```lua
local idle = keyframes.play("idle", {
    hand = "MAIN_HAND",
    layer = "base",
    loop = "LOOP",
    speed = 1.0,
    weight = 1.0,
    blendMode = "OVERRIDE",
    priority = 0,
    blendIn = 0.10,
    autoFadeOut = 0.0
})
```

You may also pass `keyframes.play({name="idle",...})`; positional overloads are maintained for compatibility. Accepted hand names include `MAIN_HAND`, `OFF_HAND`, `MAIN`, `OFF`, `RIGHT`, `LEFT`—where the `RIGHT`/`LEFT` aliases map to logical main/off, **not** to a player's actual handedness setting.

## Creation / transition functions

| Function | Purpose / return |
|---|---|
| `play(name[,options])` | Create/start clip; playback ID or `nil` |
| `retrigger(name[,options])` | Start an event pulse even when the same clip is already active; ID or `nil` |
| `blendTo(name[,options])` | Transition an existing layer to a named clip without restarting an unchanged state; ID or `nil` |
| `playBoth(name[,options])` | Table `{main=<id>, off=<id>}` on success |
| `blendToBoth(name[,options])` | Crossfade both hands; `{main,off}` |
| `triggerSequence(name,hand,intensity)` | Legacy sequence trigger (retained for compatibility) |
| `runSequenceWithCustomProgress(name,hand,progress,intensity)` | Legacy manual-progress API |

For `play`, options: `hand`, `layer`, `loop` / `loopMode` (`ONCE` default), `speed` (1), `weight` (1), `blendMode` (`OVERRIDE`), `priority` (0), `blendIn` (0), `autoFadeOut`/`fadeOut` (0).

For `blendTo`, options: `hand` (`MAIN_HAND`), `layer` (`base`), `duration`/`crossfade` (0.15 s), `loop` (`LOOP`), `speed` (1), `blendMode` (`OVERRIDE`), `priority` (0). `retrigger` defaults duration to 0.08 s and loop to `ONCE`. `playBoth` and `blendToBoth` do not take an individual `hand` option.

#### Accepted runtime enum strings

`LoopMode`: `ONCE`, `LOOP` (alias `REPEAT`), or `PINGPONG` (aliases `PING_PONG`, `PING-PONG`). Unknown values fall back to `ONCE`.

`BlendMode`: `OVERRIDE` or `ADDITIVE` (alias `ADD`); unknown values fall back to `OVERRIDE`.

`BlendEasing`: `LINEAR` or `SMOOTHSTEP` (aliases `SMOOTH`, `EASE`); unknown values fall back to `LINEAR`.

## Layers and priority

A layer is a string key (e.g., `base`, `action`, `additive`). The source supports `OVERRIDE` and `ADDITIVE` blending, per-playback weights/speeds, priorities, and layer-specific controls. Treat base locomotion as an override layer and small recoil as an additive one. Higher priority affects compositing relative to other playbacks; tune with the editor preview and in-game rendering.

## Playback control by ID

| Function | Description |
|---|---|
| `stop(id[,fadeOutSeconds])` | Stop a playback, optionally fade first |
| `pause(id)`, `resume(id)`, `restart(id)` | Transport actions |
| `setWeight(idOrName, weight)` | Set blend weight immediately (this method accepts an ID or name) |
| `fadeTo(id, weight, seconds)` | Animate blend weight |
| `setProgress(id, progress)` | Set normalized clip position |
| `setTime(id, seconds)` | Set clip time in seconds |
| `setSpeed(id, speed)` | Change play rate |
| `setLoopMode(id, mode)` | Set `ONCE`, `LOOP` or `PINGPONG` |
| `setBlendMode(id, mode)` | Set `OVERRIDE` or `ADDITIVE` |
| `setPriority(id, priority)` | Change compositing priority |
| `setBlendEasing(id, name)` | Choose `LINEAR` or `SMOOTHSTEP` (aliases `SMOOTH`/`EASE`) |
| `setAutoFadeOut(id, seconds)` | Configure fade-out timing |

**Most methods accept a playback integer ID, not a clip name.** Store the return value from `play`/`blendTo` and guard it against `nil`.

## Queries by ID

| Function | Return |
|---|---|
| `exists(id)` | boolean: playback handle still exists |
| `isPlaying(id)`, `isPaused(id)` | boolean |
| `progress(id)`, `time(id)` | normalized progress / seconds |
| `weight(id)`, `targetWeight(id)` | current / target blend weight |
| `name(id)` | clip name |
| `length(clipName)` | duration in seconds |
| `find(hand[,layer])` | playback ID or `nil`; lookup by hand+layer |

## Layer-level commands

| Function | Signature / purpose |
|---|---|
| `stopLayer(hand[,layer[,fade]])` | Stop one layer (default `base`) |
| `stopAll(hand[,fade])` | Stop all layers for a hand |
| `layerPlaying(hand[,layer])` | Is a layer active? |
| `layerName(hand[,layer])` | Active clip name |
| `layerProgress(hand[,layer])`, `layerTime(hand[,layer])` | Current position |
| `layerWeight(hand[,layer])` | Current weight |
| `layerPaused(hand[,layer])` | Paused status |
| `layerNearEnd(hand[,layer[,threshold]])` | Near end with threshold seconds; default 0.1 |
| `setLayerSpeed(hand,layer,speed)` | Rate |
| `setLayerWeight(hand,layer,weight)` | Immediate weight |
| `fadeLayer(hand,layer,weight[,seconds])` | Fade weight, default 0.15s |
| `setLayerProgress(hand,layer,progress)` | Set position |
| `pauseLayer(hand[,layer])`, `resumeLayer(...)`, `restartLayer(...)` | Layer transport |
| `syncLayerProgress(dstHand,dstLayer,srcHand,srcLayer)` | Synchronize two layers' positions |

## State machine: idle → walk → sprint

```lua
local current = nil
local handle = nil
function update()
    -- A global locomotion state is evaluated by the main-hand execution only.
    if not context.isMain then return end
    local v = player.getSpeedVector()
    local speed = math.sqrt(v.x*v.x + v.z*v.z)
    local wanted = "idle"
    if player.isSprinting() then wanted = "run"
    elseif speed > 0.02 then wanted = "walk" end

    if wanted ~= current then
        current = wanted
        handle = keyframes.blendTo(wanted, {
            hand="MAIN_HAND", layer="base", duration=0.16,
            loop="LOOP", speed=1, blendMode="OVERRIDE"
        })
    end
end
```

The sequence IDs `idle`, `walk`, `run` must have been registered in a loader. This code demonstrates *state-change detection*: do not spawn a new playback every substep for an unchanged state.

## Recoil event and additive layer

```lua
function update()
    if context.isMain and context.firstStep and context.swingedMainHand then
        keyframes.retrigger("recoil", {hand="MAIN_HAND",layer="additive",
            duration=0.06, loop="ONCE",blendMode="ADDITIVE",priority=20})
    end
end
```

## Manual charge control

```lua
local charge = nil
function update()
    if context.isMain and player.isUsingItem() then
        if charge == nil or not keyframes.exists(charge) then
            charge = keyframes.play("charge", {hand="MAIN_HAND",layer="action",loop="ONCE",speed=0})
        end
        if charge then keyframes.setProgress(charge, jmath.clamp(context.swingProgress,0,1)) end
    elseif charge then
        keyframes.stop(charge, 0.12)
        charge = nil
    end
end
```

Replace `context.swingProgress` with your actual charge ratio; this is a control-flow example. The requested clip must exist. All examples use the active **`keyframes` plural** global; the legacy Java class comments refer to `keyframe` singular inconsistently.


---
**Source:** `src/main/java/com/holdmylua/source/animation_editor/lua/KeyframeBinding.java` in the supplied HMI source archive.
