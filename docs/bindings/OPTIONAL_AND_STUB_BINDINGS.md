# Bindings present in Java but not exposed as active Lua globals

[← Documentation home](../README.md) · [API index](../reference/API_INDEX.md)

The request includes `com.holdmylua.source.bindings` in its entirety, but **a class existing in that package does not automatically create a Lua global**.

## Java classes with no methods or no runtime registration

| Java class | Source status | Safe author-facing conclusion |
|---|---|---|
| `Debug` | empty class | Not an API. Use registered [`debug`](DEBUG.md) from `DebugBinding` instead. |
| `Keybind` | empty class | No `keybind` global available from this class. |
| `Overlay` | empty class | No `overlay` global available from this class. |
| `TagReg` | empty class | No active `tags` binding from this class; `item.isIn()` covers current stack tags. |
| `Sound` | `createBinding()` defines `playSound(id, volume, pitch)` | **Not registered** in the active `lua.runtime.LuaScriptCache` or `ModelScriptCache`. Do not claim `sound.playSound` is available in new scripts. |

### `Sound` code details (not currently callable through the active binding table)

```java
// Sound.createBinding() adds a playSound function that expects:
// (sound_identifier, volume, pitch)
```

The Java method creates a `SoundEvent` using `Identifier.withDefaultNamespace` and calls the local player's `playSound`. The source does **not** attach it to active globals; so an example like `sound.playSound(...)` would be misleading. The editor's animation event system may emit sound via its separate Java event dispatcher.

## Legacy/compatibility script wrapper classes

The code also contains `scripting.script_wrappers` (`M`, `I`, `P`, `Items`, `Tags`, `Easings`) and `scripting.custom_api` (`registry`, `KeyBindManager`). `ModelScriptCache` registers these aliases for backward-compatible **item_model** scripts, but ordinary active `hand`/`hand_relative`/`item` scripts do not register all of them. Refer to [runtime availability](../reference/RUNTIME_AVAILABILITY.md) before porting an old resource pack.

### Important limitation

This documentation is intentionally conservative: do not rely on API names based only on stale README examples or old class names. The binding table in the active cache constructor is the source of truth for global availability.


---
**Source:** `src/main/java/com/holdmylua/source/lua/runtime/LuaScriptCache.java` in the supplied HMI source archive.
