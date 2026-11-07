# `shared`: passing data between scripts

[← Documentation home](../README.md) · [API index](../reference/API_INDEX.md)

The active runtime sets `shared` to the static Lua table returned by `Shared.createBinding()`. This allows multiple scripts (hand, item and hand-relative, and model scripts) to communicate by reading/writing named properties.

## Recommended namespace pattern

```lua
-- hand/observe.lua
shared.myAnimations = shared.myAnimations or {}
shared.myAnimations.sprint = player.isSprinting()

-- item/pose.lua
function update()
    if shared.myAnimations and shared.myAnimations.sprint then
        matrices.rotateX(-4)
    end
end
```

### Per-hand records

```lua
shared.myPack = shared.myPack or {hands = {}}
local hands = shared.myPack.hands
local hand = context.hand
hands[hand] = hands[hand] or {spring=0,velocity=0}
```

`shared` provides no locking/transaction API; this is single-client Lua coordination. Use unique top-level keys to avoid collisions with other packs.

## Lifetime and reload

The Java class uses a **static** table. The resource reload code resets caches and registries, but does not visibly clear `Shared.shared`. Treat `shared` keys as potentially surviving resource reload. Initialize and version your namespace defensively:

```lua
if not shared.myPack or shared.myPack.version ~= 2 then
    shared.myPack = {version=2, hands={}}
end
```

## When *not* to use shared

A counter only needed by one Lua file belongs in `local` scope. For variables that need to appear in the Blueprint GUI use its dedicated Variables feature, which generates top-level Lua locals, not `shared` table declarations.


---
**Source:** `src/main/java/com/holdmylua/source/bindings/Shared.java` in the supplied HMI source archive.
