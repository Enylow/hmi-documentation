# Resource-pack paths, `loader.lua`, and resource reload

[← Documentation home](../README.md) · [API index](../reference/API_INDEX.md)

## Where loaders are discovered

The active resource reloader searches resource stacks beneath the `holdmyitems` path for resource identifiers **ending in `loader.lua`**, sorts identifiers deterministically, and runs each matching resource in each stack. This allows more than one pack to contribute scripts.

Example loaded resource: `example:holdmyitems/loader.lua`, whose physical file is `assets/example/holdmyitems/loader.lua`.

## Script registration

```lua
Loader:load("example:holdmyitems/hand/idle.lua", "hand")
Loader:load("example:holdmyitems/hand_relative/arm.lua", "hand_relative")
Loader:load("example:holdmyitems/item/sway.lua", "item")
Loader:load("example:holdmyitems/item_model/parts.lua", "item_model")
```

| Category | Executes | Changes |
|---|---|---|
| `hand` | per-hand script substeps | scene-level transform (shared camera-space assembly stage) |
| `hand_relative` | per-hand script substeps | the rendered hand/arm stage |
| `item` | per-hand script substeps | whole held-item matrix |
| `item_model` | per-hand model recording substeps | per-quad transforms on eligible item models |

`load(path, category)` accepts the exact category names above. Unknown categories log an error. If a resource is missing, the loader logs it and keeps processing other entries.

### Register keyframe JSON sequences

```lua
Loader:loadKeyframeSequence(
    "example:holdmyitems/sequences/idle.json",
    "hand",
    "idle"
)
```

The loader accepts `hand`, `item`, `model_part` and `model_parts` (case-insensitive); it registers the JSON clip under the supplied sequence name. Registration does not automatically play it; use [`keyframes.play`](../bindings/KEYFRAMES.md) or Blueprints. The category argument is validated but the source registers the same `AnimationClip` representation.

## Order and precedence

- Loader resource IDs are sorted. Multiple `Loader:load` calls run in the order they appear in a loader.
- Each category maintains its own ordered list of scripts; HMI combines their transforms in that sequence.
- Reload clears script lists, keyframe registrations, debug widgets, and tick snapshots.
- Multiple loads of the **same resource identifier** replace that earlier entry; two *different* resource identifiers can both contribute scripts.
- Resource stacks may override data based on normal Minecraft resource-pack ordering; inspect your pack stack if a script seems wrong.

## Resource path mistakes

`example:holdmyitems/hand/idle.lua` maps to **`assets/example/holdmyitems/hand/idle.lua`**, not to `assets/minecraft/...` or `assets/example/lua/...`.

The supplied test pack uses namespace `minecraft`; that is a pack choice, not a requirement for custom packs.

## Lua preprocessing

The loader preprocessor supports `${name}` substitutions via Respackopts if installed. Without Respackopts it replaces unresolved `${...}` with `0`. The Inspect keybind placeholder is handled specially.

It also recognizes a legacy `global.name = value;` pattern and rewrites it using `registry` calls. This is a specialized compatibility preprocessor, **not normal Lua syntax or the recommended approach**. Prefer lexical locals or the `shared` table; see [Scope and state](03_UPDATE_LOOP_AND_STATE.md).

## Loader versus running scripts

The `Loader` object lives in loader execution globals, while `matrices`, `player`, `context`, etc. are registered in animation-script environments. Avoid expecting `Loader` inside a regular `update()`.

**Screenshot placeholder — resource-pack directory**

> `[INSERT SCREENSHOT: resourcepack-files.png — pack.mcmeta, loader.lua, script folders]`


---
**Source:** `src/main/java/com/holdmylua/source/lua_runtime/resource_controller/LuaAnimationResourceLoader.java` in the supplied HMI source archive.
