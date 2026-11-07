# `items`: item registry and tag-based queries

[← Documentation home](../README.md) · [API index](../reference/API_INDEX.md)

`items` is the registry-helper table, not the current held stack (which is `item`).

| Function | Arguments | Result |
|---|---|---|
| `items.setSwingSpeed(id, speed)` | string registry ID, int | Set default swing speed for that item if absent |
| `items.getAllByTag(tagId)` | item-tag ID | 1-indexed Lua array of item IDs in the tag |
| `items.getAllByBlockTag(tagId)` | block-tag ID | 1-indexed Lua array of corresponding item IDs |
| `items.getAllByUseAction(action)` | use animation name | 1-indexed array of item IDs whose default stack uses action |

```lua
local swords = items.getAllByTag("minecraft:swords")
for i = 1, #swords do
    print(i, swords[i])
end
```

**Important implementation detail:** `getAllByTag` and `getAllByBlockTag` call `.get()` on an `Optional` registry tag lookup. Missing tags may raise a Java-side exception rather than returning an empty list. Use tag IDs you know exist for your Minecraft version.

`items` scans registries and builds tables; do this at initialization or infrequently, not every 1/60-second substep. Registry iteration may include modded items.

## Current item versus registry

```lua
if item.isOf("minecraft:diamond_sword") then ... end  -- held stack
local matches = items.getAllByUseAction("bow")             -- registry scan
```


---
**Source:** `src/main/java/com/holdmylua/source/bindings/ItemReg.java` in the supplied HMI source archive.
