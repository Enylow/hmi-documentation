# Lua basics specifically for HMI authors

[← Documentation home](../README.md) · [API index](../reference/API_INDEX.md)

## Functions and lexical scope

```lua
local strength = 0.2
local function smooth01(t)
    t = math.max(0, math.min(1, t))
    return t * t * (3 - 2*t)
end
function update()
    local progress = smooth01(context.swingProgress)
    matrices.moveZ(-strength * progress)
end
```

`local` keeps implementation details private and prevents accidental clashes with global bindings. Persistent `local` variables are initialized on load, while locals inside `update()` are recreated on each call.

## Lua tables

```lua
local settings = {amount = 0.1, speed = 6.0, enabled = true}
local perHand = {MAIN_HAND = 0, OFF_HAND = 0}
local n = settings.amount * math.sin(perHand[context.hand] or 0)
```

Tables can hold values and functions. They are the normal way to manage many counters and per-hand state. HMI binding results such as `player.getSpeedVector()` or `ik.find()` also return tables.

## Conditions and logical operators

```lua
if item.isEmpty() then
    -- no held item
elseif player.isSprinting() and player.isOnGround() then
    -- sprinting
else
    -- normal
end
```

Lua inequality is `~=`, exponentiation is `^`, and logical operators are `and`, `or`, `not`. Unlike JavaScript, `0` and `""` are truthy.

## Nil-safe lookup

```lua
local hit = ik.find("minecraft:lever", 2.5, 45)
if hit then
    local x, y, z = hit.view.x, hit.view.y, hit.view.z
end
```

Calling `hit.view.x` without checking `hit` can crash the script on a miss; a crashed active script remains disabled until reload.

## Vector tables and return values

`player.getSpeedVector()` returns `{x=..., y=..., z=...}`. `ik.find` returns nested `{world=..., view=..., normal=..., ...}`. Extract named fields; HMI does not expose built-in Lua vector objects supporting `+` or `*` arithmetic.

## Timing formulas

```lua
local seconds = 0
function update()
    seconds = seconds + context.deltaTime
    local cycle = (seconds * 1.5) % 1.0
    matrices.rotateX(math.sin(cycle * math.pi * 2) * 3)
end
```

Prefer `context.deltaTime` for smoothing; `player.getAge()` is measured in **ticks**, not seconds. `context.step` and `context.firstStep` help count events once per tick.

## Common pitfalls

| Pitfall | Correction |
|---|---|
| `local function update()` | Write `function update()` so HMI finds it |
| `if 0 then` expecting false | Compare explicitly: `if count > 0 then` |
| calling `matrices` only once at script load | Call it during `update()` |
| spawns repeated three times per tick | Use `context.firstStep` |
| missing block lookup returned nil | Check `if target then` |
| using degrees with `math.sin()` | Lua trigonometry expects radians |
| `player:isSprinting()` | Use `player.isSprinting()` |
