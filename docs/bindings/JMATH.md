# `jmath`: numerical helper functions

[← Documentation home](../README.md) · [API index](../reference/API_INDEX.md)

`jmath` is a small Java-backed numeric helper. Lua's standard `math` library is also present.

| Function | Signature | Behavior |
|---|---|---|
| `jmath.PI` | constant | Java Math.PI |
| `jmath.sin(x)`, `jmath.cos(x)` | radians → number | Trigonometric functions |
| `jmath.clamp(value, min, max)` | 3 numbers | Constrain to interval |
| `jmath.floor(x)` | number | Greatest integer ≤ x (represented as number) |
| `jmath.ceil(x)` | number | Smallest integer ≥ x |
| `jmath.round(x)` | number | Java `Math.round` behavior |
| `jmath.abs(x)` | number | Absolute value |
| `jmath.pow(base, exponent)` | 2 numbers | Exponentiation |
| `jmath.lerp(alpha, from, to)` | 3 numbers | Linear interpolation; **no alpha clamp** |

Examples:

```lua
local t = jmath.clamp(context.swingProgress, 0, 1)
local offset = jmath.lerp(t, 0, -0.30)
matrices.moveZ(offset)
```

`jmath.lerp(1.5, 0, 10)` extrapolates to 15; clamp `alpha` yourself if you require an endpoint. `jmath.sin` expects radians; use `math.rad(degrees)` when authoring in degrees.


---
**Source:** `src/main/java/com/holdmylua/source/bindings/MathHelper.java` in the supplied HMI source archive.
