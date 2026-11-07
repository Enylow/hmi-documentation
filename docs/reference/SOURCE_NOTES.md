# Source-review scope, version notes and known limitations

[← Documentation home](../README.md) · [API index](../reference/API_INDEX.md)

## Source basis

This documentation was prepared from the **full source archive supplied immediately before this request**, `HoldMyItems_Generic_Block_IK_Find_Source.zip`. It includes the `ik.find` update and HMI's recent editor changes. The archive contains `src/` only; it does not contain the full Fabric Gradle/Loom build. The documents are grounded in the Java source, the shipped test resource pack, and the source's own API notes.

## Important source locations

| Topic | Java file(s) |
|---|---|
| Active regular Lua runtime | `lua/runtime/LuaScriptCache.java` |
| Active item-model runtime | `lua_runtime/ModelScriptCache.java` |
| Resource reload and preprocessing | `lua_runtime/resource_controller/LuaAnimationResourceLoader.java` |
| Loader API | `lua_runtime/resource_controller/LuaLoaderBinding.java` |
| Simulation and interpolation | `tick/ScriptTickSystem.java` |
| Binding classes | `bindings/*.java` |
| Keyframe playback | `animation_editor/lua/KeyframeBinding.java`, `KeyframeSequenceManager.java` |
| Model/clip data | `animation_editor/animation/AnimationClip.java`, `TransformKeyframe.java`, `ModelPart.java` |
| Blueprint graph + compiler + export | `animation_editor/blueprint/BlueprintProject.java`, `BlueprintCompiler.java`, `BlueprintExporter.java` |
| Visual editor | `animation_editor/gui/AnimationEditorScreen.java`, `BlueprintScreen.java` |
| Example pack | `src/main/resources/resourcepacks/pack_test/` |
| Particle API notes | `particles/PARTICLES_LUA_API.md` |

Paths above are relative to `src/main/java/com/holdmylua/source/` unless otherwise stated.

## Conservative documentation rules

1. A Java `createBinding()` method does not imply global availability; the active runtime must set the corresponding global.
2. Legacy comments/notes may refer to an older `LuaScriptCache` and `keyframe` singular. The active runtime exposes `keyframes` plural.
3. `context.isLeft` has a historical semantic mismatch in current source; verify before copying mirroring code.
4. The source has different semantics for an **editor model's preview item** and a **runtime item predicate**. Selecting a model in the editor does not automatically gate Lua playback to that item.
5. The Blueprint numeric expression grammar intentionally forbids arbitrary Lua; it accepts finite numbers, safe operators, and known references.
6. The supplied ZIP has no Minecraft Gradle build files. Function bindings and UI behavior have been reviewed statically but **not compiled or tested in-game** during documentation generation.
7. Files in `examples/` are instructional sample scripts; they were not installed into Minecraft or run against a real client during this task.

## Source-specific risks worth reporting

- `Player.isTouchingWater()` currently reads `isInWall()`; document and test against gameplay rather than assuming the name describes behavior.
- `ItemReg.getAllByTag`/`getAllByBlockTag` can throw if the tag is missing because they call Optional `.get()`.
- `item.getId`'s Java wrapper declares one argument but ignores it; ordinary no-argument Lua usage should work, though this is an odd implementation.
- `shared` is a static table; the Java reload logic does not visibly clear it, so initialize carefully.
- An ordinary runtime Lua script with no `update()` will fail when executed; an item-model legacy script has a separate fallback.
- A special `global.variable = ...;` preprocessor path is not a replacement for normal Lua `local` declarations or a persistent registry API.
- Rendered-model quad groups may have noncontiguous indexes, while `modelParts` Lua methods only accept inclusive ranges.

## Documentation maintainers

If API signatures change, update the binding page first, then the index and code examples. Keep screenshots as explicit placeholders until genuine in-game captures are available. Avoid inventing undocumented functions or hidden event hooks.
