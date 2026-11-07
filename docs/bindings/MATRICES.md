# `matrices`: current first-person pose transforms

[← Documentation home](../README.md) · [API index](../reference/API_INDEX.md)

This binding writes to the `PoseStack` currently being recorded. It returns no values; methods operate on the current transform in call order.

| Function | Arguments | Behavior |
|---|---|---|
| `matrices.moveX(n)` | number | Translate X only |
| `matrices.moveY(n)` | number | Translate Y only |
| `matrices.moveZ(n)` | number | Translate Z only |
| `matrices.translate(x,y,z)` | 3 numbers | Translate all axes |
| `matrices.rotateX(a)` | degrees | Rotate X around origin |
| `matrices.rotateY(a)` | degrees | Rotate Y around origin |
| `matrices.rotateZ(a)` | degrees | Rotate Z around origin |
| `matrices.rotateX(a,x,y,z)` | angle + pivot | Rotate X around local pivot |
| `matrices.rotateY(a,x,y,z)` | angle + pivot | Rotate Y around local pivot |
| `matrices.rotateZ(a,x,y,z)` | angle + pivot | Rotate Z around local pivot |
| `matrices.scale(x,y,z)` | 3 numbers | Nonuniform scale |
| `matrices.shear(x,y,z)` | 3 numbers | Multiply by HMI's shear matrix |

**Angles are degrees** for matrix rotations, unlike Lua `math.sin` and `math.cos` (radians). `scale` requires all three components. Numeric arguments are validated by LuaJ; incorrect type/arity throws a script error.

## Building a transform

```lua
local t = 0
function update()
    t = t + context.deltaTime
    matrices.translate(0, 0.04 * math.sin(t*3), 0)
    matrices.rotateX(5 * math.sin(t*2.3), 0.6,-0.7,-0.4)
    matrices.scale(1,1,1)
end
```

The order matters because matrices multiply rather than storing independent Euler properties. To rotate around a pivot, use the 4-argument overload instead of manually translating back and forth.

## Stage-specific behavior

The same binding appears in `hand`, `hand_relative`, and `item`. The pose is recorded on an identity stack per category and composed into the render hook afterwards. For moving individual baked model faces use [`modelParts`](MODEL_PARTS.md), not `matrices`.

## Failure modes

- A matrix call outside tick recording may not have an appropriate target stack.
- Using degrees directly in `math.sin` makes motion much faster than expected.
- Large shears or scales can invert the mesh and affect first-person clipping.
- `ik.applyHand` internally calls the underlying `matrices.translate`; see [IK](IK.md).


---
**Source:** `src/main/java/com/holdmylua/source/bindings/Matrices.java` in the supplied HMI source archive.
