# Copyable example Lua scripts and how to use them

[← Documentation home](../README.md) · [API index](../reference/API_INDEX.md)

All examples below are intentionally small and use documented active bindings. Copy a `.lua` file into the correct `assets/<your_namespace>/holdmyitems/<category>/` folder, then register it with `Loader:load` in your loader. These files are downloadable as part of the documentation ZIP.

| Example | Stage | Purpose |
|---|---|---|
| [`smooth_item_sway.lua`](smooth_item_sway.lua) | `item` | Smooth procedural counter that reacts to sprinting |
| [`per_hand_pendulum.lua`](per_hand_pendulum.lua) | `hand_relative` | Independent per-hand angular spring/pendulum |
| [`block_aim.lua`](block_aim.lua) | `hand_relative` | Read `ik.find` target and orient hand at lever |
| [`particle_pulse.lua`](particle_pulse.lua) | `hand` | Spawn a first-person particle on a one-tick event |
| [`keyframe_state_machine.lua`](keyframe_state_machine.lua) | `hand` | Blend idle/walk/run animation layers |

**Loader registration example**:

```lua
Loader:load("example:holdmyitems/item/smooth_item_sway.lua", "item")
Loader:load("example:holdmyitems/hand_relative/per_hand_pendulum.lua", "hand_relative")
```

### Caution

`block_aim.lua` demonstrates **a partial yaw-based pose**, not a complete bone IK implementation. `keyframe_state_machine.lua` requires clip sequences to be registered separately. Particle textures must exist in the enabled pack. For physics tuning, see [Tips & tricks](../guides/07_TIPS_AND_TRICKS.md).
