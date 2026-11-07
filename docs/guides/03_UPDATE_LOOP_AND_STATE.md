# How the Lua update loop, variable scopes and shared state work

[← Documentation home](../README.md) · [API index](../reference/API_INDEX.md)

## Script lifetime

The active `com.holdmylua.source.lua.runtime.LuaScriptCache` creates **one environment per loaded script**, executes its top-level code once, looks up its global `update` function, and calls it during tick recording. It does **not** call the entire top-level chunk every frame. A Lua error during `update()` disables that script until reloaded and displays a toast.

```lua
local counter = 0  -- evaluated once on load
local function bump(n)
    counter = counter + n
end

function update() -- looked up by HMI
    bump(context.deltaTime)
    matrices.moveY(math.sin(counter * 2) * 0.04)
end
```

### Timeline of one client tick

```text
20 ticks per second
  tick begins
  ├─ substep 0: context.step = 0; context.firstStep = true
  │     hand → hand_relative → item → item_model
  ├─ substep 1: context.step = 1; context.firstStep = false
  │     same stages
  └─ substep 2: context.step = 2; context.firstStep = false
        same stages
  → snapshot poses
  → interpolate between recorded matrices on render frames
```

Nominal `context.deltaTime` is 0.05/3 = **1/60 seconds** per substep, multiplied by the user-configured animation-speed factor. Advance timers by `context.deltaTime`, not by a hardcoded `1/60` unless you deliberately want a different rate.

## Local variables

- `local value = 0` **above** `update()` remains alive between calls and is private to this file's closure.
- `local value = 0` **inside** `update()` is recreated every substep.
- `local function helper(...) ... end` defines a private reusable helper.
- `function update()` must be visible in the script environment as `update`, so do **not** make that particular function `local`.

### Both hands need independent state

Most scripts are evaluated once per hand. A single file-level counter can therefore be advanced twice (and in multiple substeps) per tick. Choose per-hand state when that matters:

```lua
local timer = {MAIN_HAND = 0, OFF_HAND = 0}

function update()
    local hand = context.hand
    timer[hand] = (timer[hand] or 0) + context.deltaTime
    local amount = math.sin(timer[hand] * 3.0) * 0.04
    matrices.moveY(amount)
end
```

### Shared table versus isolated locals

`shared` comes from a Java static Lua table (`Shared.shared`) and is visible to scripts across stages. Namespaces avoid collisions:

```lua
-- file A
shared.myPack = shared.myPack or {}
shared.myPack.intensity = 0.25

-- file B
function update()
    local data = shared.myPack
    if data then matrices.moveZ(data.intensity or 0) end
end
```

Because the Java table is static, **do not assume it automatically clears on every resource reload**; initialize defensively. Avoid writing generic keys like `shared.state` that other packs might overwrite.

### One-shot events and side effects

Events including `context.swingedMainHand` and `context.interactedMainHand` are true only for the first script substep of their tick. Call side-effect APIs once per logical tick:

```lua
function update()
    if context.firstStep and context.interactedMainHand then
        particles.spawn{texture="minecraft:particle/spark", anchor="hand", lifetime=12}
    end
end
```

This also matters for sound playback and starting keyframe layers: without a guard, a three-substep loop may trigger an action repeatedly.

## Identity stack versus persistent numeric state

HMI records each category into a fresh identity `PoseStack`. **Matrix calls must be repeated on every `update()`** (unless another script contributes the transform) because transforms are captured afresh. Numeric counters, velocities and `shared` tables persist; they are not reset by the matrix stack.

## Lua `nil`, booleans and errors

- Only `false` and `nil` are false in Lua; numeric `0` is **truthy**.
- Use `if target ~= nil then ... end` for APIs returning `nil` on misses.
- Dot syntax calls table closures: `player.isSprinting()`, `matrices.moveX(0.1)`, `ik.find(...)`.
- Use colon syntax only for methods implemented with a receiver, such as `particle:kill()` and `Loader:load(...)`.

## Legacy caveat

The source also contains `com.holdmylua.source.lua_runtime.LuaScriptCache`, an older script runtime. The **active** `LuaLoaderBinding` registers the `lua.runtime.LuaScriptCache` class instead. Do not copy obsolete `M`/`I` patterns from the unused class into a new pack unless you intentionally target the compatibility model-script environment.


---
**Source:** `src/main/java/com/holdmylua/source/tick/ScriptTickSystem.java` in the supplied HMI source archive.
