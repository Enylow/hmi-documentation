# `ik`: block targets, view-space vectors and hand attraction

[← Documentation home](../README.md) · [API index](../reference/API_INDEX.md)

The first-person IK binding locates interaction points using vanilla block outline shapes; it does **not** require Touch ’n Motion at runtime. It gives targets and optional offset solving. A two-bone anatomical arm solver is **not** exposed by this binding.

## Functions

| Call | Meaning |
|---|---|
| `ik.find(blockId[,maxDistance[,viewCone]])` | nearest suitable visible target on an exact registered block type |
| `ik.findButton([maxDistance[,viewCone]])` | nearest suitable button target of any button type |
| `ik.getPoint(x,y,z[,nx,ny,nz])` | package arbitrary world point + optional surface normal as a target |
| `ik.solveHand(target[,options])` | return a bounded *offset* vector and yaw/pitch metadata, **without applying matrices** |
| `ik.applyHand(solution[,weight])` | translate current matrix stack by the solution's x/y/z times clamped weight [0,1] |

Default range **2.25 blocks**, clamped to **0.1..6**; default view cone **50°**, clamped to **0..179**. Both `find` variants return `nil` on misses. Unknown/malformed block IDs are handled as misses by the source search system.

## Target table fields

| Field | Description |
|---|---|
| `world.{x,y,z}` | Target position in world blocks |
| `view.{x,y,z}` | Camera-relative target point, +X right / +Y up / −Z forward |
| `eye.{x,y,z}` | Player eye position in world blocks |
| `normal.{x,y,z}` | Outward world-space surface normal |
| `viewNormal.{x,y,z}` | Normal in camera coordinates |
| `distance` | Distance from eye to point, blocks |
| `blockId` | Registry ID, or `"custom"` for `getPoint` |
| `blockX`, `blockY`, `blockZ` | Integer block coordinates |
| `pressed` | Button powered state or false for other/custom targets |

## Solve options and result

```lua
local hit = ik.find("minecraft:stone_button", 2.35, 45)
if hit then
    local s = ik.solveHand(hit, {
        originX = 0.55, originY = -0.55, originZ = -0.80,
        maxOffset = 1.20
    })
    -- s.x, s.y, s.z: bounded offset
    -- s.yaw, s.pitch: direction metadata, degrees
    -- s.unclampedDistance: remaining distance reported by solver
    ik.applyHand(s, 0.5)  -- **moves** current assembly, not an arm rotation
end
```

`originX/Y/Z` default to `(0.55,-0.55,-0.8)`; `maxOffset` defaults to 1.2 and clamps to 0..8. Applying is optional: Lua may inspect or replace the calculated solution.

## Aim rather than move

To **point** an arm at a block, compute a direction from shoulder to `target.view` and rotate about a shoulder pivot with `matrices.rotateX/Y/Z` rather than `ik.applyHand`:

```lua
local hit = ik.find("minecraft:lever", 2.35, 45)
if hit then
    local sx,sy,sz = 0.75,-0.8,-0.6
    local dx,dy,dz = hit.view.x-sx, hit.view.y-sy, hit.view.z-sz
    local yaw = math.deg(math.atan2(-dx,-dz))
    matrices.rotateY(yaw*0.5, sx,sy,sz)
end
```

This **illustrates the math**, not a universally calibrated aim solution. The arm's rest direction, mirrored hand and physical pivot have to be measured in your pose. For your chosen pivots: empty arm `(±0.75,-0.8,-0.6)`, item arm `(±0.6,-0.7,-0.4)`.

## Practical limitations

The scanner honors distance, direction and line-of-sight constraints. It returns one target, not a list; there is no exposed `ik.findAll` or IK joint-hierarchy API. It uses local client world state and read-only target discovery; it does not press a button or simulate a click.


---
**Source:** `src/main/java/com/holdmylua/source/bindings/Ik.java` in the supplied HMI source archive.
