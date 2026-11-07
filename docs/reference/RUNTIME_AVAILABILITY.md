# Which Lua globals are actually installed?

[← Documentation home](../README.md) · [API index](../reference/API_INDEX.md)

The binding constructors in the active runtime are the authoritative source for runtime global names. This page intentionally distinguishes *implemented Java classes* from *registered Lua globals*.

## Ordinary `hand`, `hand_relative`, `item`

| Name | Source | Description |
|---|---|---|
| `context` | `bindings.Context` | hand/time/input fields |
| `matrices` | `bindings.Matrices` | pose transforms |
| `player` | `bindings.Player` | current player info |
| `item` | `bindings.ItemBinding` | current stack info |
| `ik` | `bindings.Ik` | nearby block targets and hand-offset solver |
| `keyframes` | `animation_editor.lua.KeyframeBinding` | runtime playback/layers |
| `shared` | `bindings.Shared` | global cross-script data table |
| `jmath` | `bindings.MathHelper` | numeric helpers |
| `easings` | `bindings.Easings` | easing functions |
| `items` | `bindings.ItemReg` | registry/tag enumeration |
| `particles` | `bindings.Particles` | first-person particle system |
| `debug` | `bindings.DebugBinding` | persistent debug widgets |

Standard Lua `math`, `string`, `table`, `coroutine`, `bit32`, and base functionality are loaded by the manager. Script errors disable the offending active cached script until reload.

## Additional `item_model` globals

`modelParts` and `model` (same table) are registered on top of the common API. The model cache also defines:

- `animator`, `data`: Java-coerced legacy model data objects.
- `M`, `I`, `Items`, `Tags`, `P`, `Easings`: legacy wrappers, distinct from modern lowercase bindings.
- `debugger`, `registry`, `KeyBindManager`: legacy Java/custom objects.

Use modern tables when creating new scripts; these aliases exist to keep older packs functioning.

## Not directly bound in normal modern scripts

`Loader` is available to `loader.lua`, not as an ordinary animation script global. `Sound.createBinding()` exists but is not set in the active scripts. `Debug`, `Overlay`, `Keybind`, `TagReg` are empty placeholder classes. The source also has a **legacy** `lua_runtime.LuaScriptCache`, which the active loader does not instantiate for ordinary script categories.

## Watch out for Java-vs-Lua naming

- `KeyframeBinding.createBinding()` is the class; the global is `keyframes` (plural).
- `ItemReg` creates `items`; `ItemBinding` creates `item`.
- `MathHelper` creates `jmath`, not `mathHelper`.
- `ModelParts` creates `modelParts` (and `model` alias in model scripts only).
- `DebugBinding` creates `debug`; the empty `Debug` Java class is not used.


---
**Source:** `src/main/java/com/holdmylua/source/lua/runtime/LuaScriptCache.java` in the supplied HMI source archive.
