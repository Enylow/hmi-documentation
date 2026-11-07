# `Sound` — implemented helper that is not bound to active Lua

[← Documentation home](../README.md) · [API index](../reference/API_INDEX.md)

**Status:** Java helper exists, but no active `sound` Lua global is registered by the supplied active script caches. This page is an **implementation note**, not a promise that `sound.playSound()` works in a resource pack.

`Sound.createBinding()` builds a Lua table with `playSound(soundId,volume,pitch)`. It calls `Minecraft.getInstance().player.playSound(...)`, creates a variable-range sound event, and resolves the identifier with a default namespace. It returns Lua `nil`.

The active script environment registers `context`, `player`, `item`, `matrices`, etc., but **not `sound`**. A new Java registration would be required before this helper could be used by `hand`/`item` scripts. HMI's keyframe event system is separate and supports sound cues in animation clips.

**Do not paste** `sound.playSound("minecraft:...", 1, 1)` into an ordinary pack and expect it to work with this source revision.


---
**Source:** `src/main/java/com/holdmylua/source/bindings/Sound.java` in the supplied HMI source archive.
