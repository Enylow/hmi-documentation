# Getting started — your first HMI resource pack

[← Documentation home](../README.md) · [API index](../reference/API_INDEX.md)

## What you are making

A resource pack can change the hand, held-item placement, and baked model quads without writing a Java mod. The pack needs `pack.mcmeta`, at least one `loader.lua`, and one or more Lua scripts.

## Minimal directory tree

```text
My_First_HMI_Pack/
├── pack.mcmeta
└── assets/
    └── example/
        └── holdmyitems/
            ├── loader.lua
            ├── hand/
            │   └── gentle_sway.lua
            ├── hand_relative/
            │   └── arm_pose.lua
            ├── item/
            │   └── item_bob.lua
            └── item_model/
                └── optional_parts.lua
```

The namespace `example` may be replaced with your own lower-case resource namespace. The directory and resource path must agree. The test pack supplied with the source uses `assets/minecraft/holdmyitems/...` instead.

## `pack.mcmeta`

```json
{"pack":{"description":"My HMI Lua animations","min_format":88,"max_format":88}}
```

The source Blueprint exporter uses **Minecraft 26.2 resource pack format 88**. If you target a different game version, confirm the format required by that version.

## `loader.lua`

```lua
Loader:load("example:holdmyitems/hand/gentle_sway.lua", "hand")
```

This names a resource (namespace + path inside `assets/`) and assigns its execution stage. `Loader:load` is available in the **loader**, not a function every animation script needs to call.

## Your first animation

`assets/example/holdmyitems/hand/gentle_sway.lua`:

```lua
local elapsed = 0.0  -- defined once per script instance

function update()
    elapsed = elapsed + context.deltaTime
    local side = context.isLeft and -1 or 1 -- verify this convention in your build
    local sway = math.sin(elapsed * 4.0) * 0.025
    matrices.translate(side * sway, 0, 0)
end
```

`update()` runs for both hands; its matrix is reset to an identity pose for each recording pass. The variable `elapsed` persists for the lifetime of this script instance. For per-hand independent counters, use an indexed Lua table (see [Update loop](03_UPDATE_LOOP_AND_STATE.md)).

## Enable and verify

1. Place `My_First_HMI_Pack` inside the Minecraft `resourcepacks/` folder.
2. Enable it in the Resource Packs screen and reload resources (`F3+T` when appropriate).
3. Enter first person, hold an item, and verify the sway.
4. Make a larger temporary displacement (e.g., `0.2`) to verify your stage is running, then reduce it.
5. If the script fails, read the toast/log and consult [Troubleshooting](08_TROUBLESHOOTING.md).

## Where to go next

- [Hand / hand-relative / item / item-model stages](04_SCRIPT_STAGES.md)
- [Pivot rotations](06_MATRICES_AND_COORDINATES.md)
- [Function and field reference](../reference/API_INDEX.md)

**Screenshot placeholder — Minecraft Resource Packs page**

> `[INSERT SCREENSHOT: resources-screen.png — HMI pack enabled]`


---
**Source:** `src/main/java/com/holdmylua/source/lua_runtime/resource_controller/LuaLoaderBinding.java` in the supplied HMI source archive.
