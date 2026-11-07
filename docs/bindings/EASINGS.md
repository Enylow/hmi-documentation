# `easings`: easing functions and when to use them

[← Documentation home](../README.md) · [API index](../reference/API_INDEX.md)

All built-in easing functions accept one number `t`, normally a normalized time in **[0,1]**, and return a number. They do **not** clamp input automatically. Some families intentionally overshoot the [0,1] range (Back, Elastic), so avoid using their output directly as an alpha without considering that behavior.

## Complete registered function list

| Family | Methods |
|---|---|
| Sine | `easeInSine`, `easeOutSine`, `easeInOutSine` |
| Quadratic | `easeInQuad`, `easeOutQuad`, `easeInOutQuad` |
| Cubic | `easeInCubic`, `easeOutCubic`, `easeInOutCubic` |
| Quartic | `easeInQuart`, `easeOutQuart`, `easeInOutQuart` |
| Quintic | `easeInQuint`, `easeOutQuint`, `easeInOutQuint` |
| Exponential | `easeInExpo`, `easeOutExpo`, `easeInOutExpo` |
| Circular | `easeInCirc`, `easeOutCirc`, `easeInOutCirc` |
| Back | `easeInBack`, `easeOutBack`, `easeInOutBack` |
| Elastic | `easeInElastic`, `easeOutElastic`, `easeInOutElastic` |
| Bounce | `easeInBounce`, `easeOutBounce`, `easeInOutBounce` |
| Smoothstep helper | `cubicEase` (the expression `t*t*(3-2*t)`) |

### Smooth equip animation

```lua
function update()
    local t = jmath.clamp(context.equipProgress, 0, 1)
    local eased = easings.easeInOutCubic(t)
    matrices.moveZ(jmath.lerp(eased, -0.25, 0.0))
end
```

### Over-shooting an inspect animation

```lua
local inspectT = 0
function update()
    inspectT = math.min(1, inspectT + context.deltaTime/0.3)
    local angle = 18 * easings.easeOutBack(inspectT)
    matrices.rotateZ(angle)
end
```

Back and Elastic are useful for deliberate overshoot; Sine, Quad and Cubic are safer for natural, bounded pose changes. Compare them visually in the graph editor and see [Tips & tricks](../guides/07_TIPS_AND_TRICKS.md).

## Names matter

In the active runtime the binding name is **lowercase** `easings`, not legacy `Easings`. Legacy `Easings` is added only in the model script compatibility environment.


---
**Source:** `src/main/java/com/holdmylua/source/bindings/Easings.java` in the supplied HMI source archive.
