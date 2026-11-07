# `item`: the currently held ItemStack

[← Documentation home](../README.md) · [API index](../reference/API_INDEX.md)

The target item is refreshed per script hand. Most functions read `ItemBinding.currentStack`, so call inside `update()`.

## Identification and predicates

| Function | Result | Details |
|---|---|---|
| `item.getId()` | string | Registry ID of current stack's item. Java declares one unused argument but does not require it; call without arguments. |
| `item.getName()` | string | Custom name if present, otherwise display name |
| `item.isEmpty()` | boolean | Empty hand |
| `item.isOf(id)` | boolean | Exact item ID, e.g. `"minecraft:diamond_sword"` |
| `item.isIn(tag)` | boolean | Item membership in a tag |
| `item.isBlockInTag(tag)` | boolean | If item represents a block, check corresponding block tag |
| `item.isBlock()` | boolean | Current item has a corresponding non-air block |
| `item.isLantern()` | boolean | Corresponding block is a LanternBlock |
| `item.isEnchanted()` | boolean | Item has foil/glint |
| `item.isChargedCrossbow()` | boolean | Crossbow is charged |
| `item.isDisabled()` | boolean | Item currently on cooldown |

## Data and configuration

| Function | Return or side effect |
|---|---|
| `item.getComponents()` | Lua table keyed by component ID; codec-encoded JSON data converted to Lua tables/primitives; codec failures return nil for that component |
| `item.getUseAction()` | Serialized use animation (e.g. `eat`, `bow`, `block`, etc. as provided by game) |
| `item.getAttackDamage()` | Sum of attack-damage attribute modifiers found in the component |
| `item.getSpearData()` | Table `{canDismount,canKnockBack,canDamage,hitImpact}` for kinetic-weapon items, otherwise `nil` |
| `item.setSwingSpeed(integer)` | Sets a per-item swing-speed preference **if absent** |
| `item.renderAsBlock(boolean)` | Sets a per-item render-as-block preference **if absent** |

`setSwingSpeed` / `renderAsBlock` use `putIfAbsent`: repeatedly calling them does not overwrite an existing preference for the item. They are configuration-style calls, not continuously animated values.

## Examples

```lua
function update()
    if item.isEmpty() then return end
    if item.isOf("minecraft:bow") then matrices.rotateZ(8) end
    if item.isIn("minecraft:swords") then matrices.moveZ(-0.05) end
end
```

To inspect component data:

```lua
function update()
    local c = item.getComponents()
    -- Keys are fully qualified component IDs, not numeric component indices.
    local customName = c["minecraft:custom_name"]
end
```

## Safety and performance

Registry/tag checks are easy to call per substep, but broad registry enumeration belongs in initialization code when possible. `item.getComponents()` may return nested Lua tables; avoid constructing large debug output from it each substep. Some getters assume a current valid stack and will error when called outside the active runtime.


---
**Source:** `src/main/java/com/holdmylua/source/bindings/ItemBinding.java` in the supplied HMI source archive.
