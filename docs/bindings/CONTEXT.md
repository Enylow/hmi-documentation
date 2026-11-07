# `context`: current hand, input events and simulation timing

[← Documentation home](../README.md) · [API index](../reference/API_INDEX.md)

`context` is a mutable Lua table refreshed by Java before every script substep. It describes the hand and current animation inputs. Do not treat its values as persistent script-owned settings; read them when `update()` runs.

## Field reference

| Field | Type | Meaning |
|---|---|---|
| `swingProgress` | number | Current swing progress for this hand |
| `equipProgress` | number | Current equip transition progress |
| `isLeft` | boolean | Historically named hand-side flag; the active tick system passes its `rightArm` value. **Calibrate mirroring**. |
| `isMain` | boolean | Is the current logical hand `MAIN_HAND`? |
| `hand` | string | `MAIN_HAND` or `OFF_HAND` |
| `deltaTime` | number | Substep duration in seconds, scaled by HMI animation speed |
| `mainHandSwingProgress` / `offHandSwingProgress` | number | Per-hand swing progress |
| `mainHandSwitchEvent` / `offHandSwitchEvent` | boolean | Equip/switch event state |
| `interact` / `blockBreaking` | boolean | Active interaction/mining state |
| `swingMHand` / `swingOHand` | boolean | Swing-related states |
| `swingedMainHand` / `swingedOffHand` | boolean | One-tick input pulse, true only first substep |
| `interactedMainHand` / `interactedOffHand` | boolean | One-tick input pulse, true only first substep |
| `step` | integer | Current simulation substep, zero-based: 0,1,2 |
| `steps` | integer | Number of substeps, currently 3 |
| `firstStep` | boolean | True only at substep 0; good for sounds, particles, triggers |

## Time and event example

```lua
local duration = {MAIN_HAND=0, OFF_HAND=0}
function update()
    local hand = context.hand
    duration[hand] = duration[hand] + context.deltaTime
    if context.firstStep and context.swingedMainHand then
        -- Start an action only once for this tick
        local id = keyframes.play("attack", {hand="MAIN_HAND", layer="action", loop="ONCE"})
    end
end
```

## Which values can be used outside `update()`?

The `context` table is initialized with zero/false placeholders when the Lua environment is created. Only consume gameplay values **inside** `update()` after Java has refreshed the table. `context.firstStep` is particularly important for side effects: scripts execute 3 substeps for each hand.

## Pitfalls

- `context.deltaTime` reflects animation speed, so timers based on it change with user settings.
- The hand names are **logical** (`MAIN_HAND`, `OFF_HAND`), not necessarily physical right/left.
- The `isLeft` flag's name and source convention do not match intuitively; verify it visually on both handedness settings.
- The runtime treats pulses differently from persistent states. Don't create a new keyframe layer every time `context.interact` stays true.


---
**Source:** `src/main/java/com/holdmylua/source/bindings/Context.java` in the supplied HMI source archive.
