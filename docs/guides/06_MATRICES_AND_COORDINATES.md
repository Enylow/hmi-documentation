# Matrix transforms, coordinate systems and rotation pivots

[← Documentation home](../README.md) · [API index](../reference/API_INDEX.md)

## Three independent axes

In HMI's view-space IK: **+X right, +Y up, −Z forward** relative to the player's eye/camera. Matrix transforms in the arm/item pipeline occur in their respective local render stages; treat a number in `item` space as different from the same number in world space.

- `matrices.translate(x,y,z)` changes position.
- `matrices.rotateX/Y/Z(degrees)` rotates around the current origin.
- `matrices.rotateX/Y/Z(degrees, px,py,pz)` rotates around the given pivot.
- `matrices.scale(x,y,z)` scales each axis.
- `matrices.shear(x,y,z)` changes shape; use sparingly.

### Rotating around the shoulder

```lua
local function armPivot()
    local x = item.isEmpty() and 0.75 or 0.60
    local y = item.isEmpty() and -0.80 or -0.70
    local z = item.isEmpty() and -0.60 or -0.40
    -- Physical polarity is version/renderer-specific; calibrate visually.
    if context.isLeft then x = -x end
    return x, y, z
end
function update()
    local x,y,z = armPivot()
    matrices.rotateX(-12, x,y,z)
    matrices.rotateY(8, x,y,z)
end
```

These shoulder values are authored examples from the user's integration, not a guaranteed Minecraft default pivot. Experiment by aiming at a block while holding an item.

### Transform order matters

```lua
matrices.rotateZ(10)
matrices.moveY(0.1)
```

is **not equivalent** to translating before rotating. If a transform appears to move diagonally, check order and the current attachment stage.

### Mirroring

Use a physical-hand sign based on your verified `context.isLeft` behavior. Remember that rotations around X/Y/Z may require different signs from translations when mirroring an authored right-hand pose. The keyframe runtime has its own built-in left-hand mirroring; don't mirror it twice.

### Building a custom pointing transform

```lua
local hit = ik.find("minecraft:oak_button", 2.5, 45)
if hit then
    local px,py,pz = 0.75,-0.8,-0.6
    local dx,dy,dz = hit.view.x-px, hit.view.y-py, hit.view.z-pz
    local yaw = math.deg(math.atan2(-dx,-dz))
    -- Calibrate reference pitch to your authored resting arm direction.
    matrices.rotateY(yaw * 0.6, px,py,pz)
end
```

`ik.applyHand` performs **translation**, not aiming. For point-only rotation, use target vectors and `matrices.rotate*` directly. For robust aiming, calibrate the resting direction and limit angles to avoid unnatural flips.


---
**Source:** `src/main/java/com/holdmylua/source/bindings/Matrices.java` in the supplied HMI source archive.
