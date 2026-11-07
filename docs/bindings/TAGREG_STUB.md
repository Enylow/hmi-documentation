# `TagReg` — source placeholder (no functions)

[← Documentation home](../README.md) · [API index](../reference/API_INDEX.md)

The supplied `com.holdmylua.source.bindings.TagReg` class has an empty body and does not expose `createBinding()` or any callable functions. Therefore, there is **no registered Lua binding from this class** in the active runtime.

Do not confuse this placeholder with other classes:
- For diagnostic widgets use [`debug`](DEBUG.md) (`DebugBinding`, not `Debug`).
- For item tags use [`item.isIn`](ITEM.md) and [`items.getAllByTag`](ITEMS.md) (not `TagReg`).
- `KeyBindManager` belongs to the **legacy model-script compatibility environment**; it is not exported by `Keybind`.
- No `overlay` API is registered from `Overlay`.

This page exists so every class in the binding package is accounted for and its lack of API is unambiguous.


---
**Source:** `src/main/java/com/holdmylua/source/bindings/TagReg.java` in the supplied HMI source archive.
