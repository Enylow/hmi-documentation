# The four script categories: hand, hand_relative, item, item_model

[← Documentation home](../README.md) · [API index](../reference/API_INDEX.md)

## Why stages exist

One resource pack can animate the whole first-person assembly, the arm relative to it, the held item relative to the hand, and named portions of the item mesh. Stages keep those concerns separable.

| Category | Intended role | Typical effect | Main binding |
|---|---|---|---|
| `hand` | overall scene/arm assembly pose | camera bob, state-wide shifting | `matrices` |
| `hand_relative` | position and aim the visible arm | shoulder rotation, block-target reach | `matrices`, `ik` |
| `item` | whole rendered item | recoil, breathing sway, wield angle | `matrices` |
| `item_model` | baked model geometry | animated blade, moving mechanism | `modelParts` / `model` |

The code calls `Stage.SCENE`, `Stage.HAND`, and `Stage.ITEM` for the first three categories; the render hooks apply those in their corresponding attachment points. The categories are not arbitrary UI labels.

### `hand` example: entire first-person assembly sway

```lua
function update()
    local speed = player.getSpeedVector()
    local moving = math.sqrt(speed.x^2 + speed.z^2)
    matrices.moveY(math.sin(player.getAge() / 4) * 0.01 * math.min(moving * 6, 1))
end
```

### `hand_relative` example: rotate arm at its shoulder

```lua
function update()
    local pivotX = context.isLeft and -0.75 or 0.75
    matrices.rotateZ(4.0, pivotX, -0.8, -0.6)
end
```

**Important:** check your physical-side convention; `ScriptTickSystem` passes its `rightArm` boolean to the property called `context.isLeft`. In the supplied test pack comments, that variable is treated as right-side polarity. Adjust signs based on a visual test.

### `item` example: temporary item angle

```lua
function update()
    if not item.isEmpty() then
        matrices.rotateX(-8.0, 0.6, -0.7, -0.4)
    end
end
```

### `item_model` example: rotate only a quad range

```lua
function update()
    -- Indices are zero-based AND inclusive. Confirm indices in the Model Parts editor.
    modelParts.rotateY(0, 5, 20, 0, 0, 0)
end
```

These example quad indices are illustrative: they have meaning only for a model with those quads. Prefer authoring the range in the [Model Parts editor](../editor/02_KEYFRAMES_AND_MODEL_PARTS.md) and test it with the actual baked model.

## Special model-script conditions

`item_model` runs only if `HandItems.usesModelScripts(item)` allows the item. Its script environment includes `modelParts`, alias `model`, and additional compatibility aliases. It accepts modern `function update()` scripts and a legacy top-level-per-step form (see `ModelScriptCache`).

## Shared library availability

The normal three script stages expose `context`, `matrices`, `player`, `item`, `ik`, `keyframes`, `shared`, `jmath`, `easings`, `items`, `particles`, and `debug`. `item_model` adds `modelParts`/`model` and backward-compatibility aliases. See [Availability](../reference/RUNTIME_AVAILABILITY.md).

## Ordering tips

Keep camera/player-state observation in one early script and transformations in later scripts. The shipped `loader.lua` shows this organization: an `observe.lua` stage runs before hand pose/motion/action scripts, then item scripts and model scripts.


---
**Source:** `src/main/java/com/holdmylua/source/tick/ScriptTickSystem.java` in the supplied HMI source archive.
