# `player`: read-only local player state

[← Documentation home](../README.md) · [API index](../reference/API_INDEX.md)

`player` is a table of callable getters. The current player is assigned by the active tick engine; call it inside `update()`.

## Boolean getters

| Function(s) | What they expose |
|---|---|
| `isFlying`, `isFallFlying` | Creative/spectator flight ability and Elytra/gliding |
| `isSleeping`, `isPassenger` | Sleeping and riding |
| `isOnFire`, `isInLava`, `isInPowderSnow` | Environmental effects |
| `isBlocking`, `isUsingItem` | Item-use states |
| `isAlive`, `isOnGround` | Alive and ground state |
| `isSneaking`, `isSprinting` | Movement posture |
| `isSwimming`, `isClimbing`, `isCrawling` | Special movement |
| `isSubmergedInWater` | Underwater status |
| `isTouchingWater` | **Source caveat:** currently calls `currentPlayer.isInWall()`, despite its name; do not rely on it as a water test without a code fix. |
| `isUsingRiptide` | Auto-spin attack state |
| `canFreeze`, `isRaining` | Environmental status |
| `isItemCoolingDown` | Cooldown on current held item |

All are invoked as `player.isSprinting()` and return Lua booleans.

## Numeric getters

| Function | Result / units |
|---|---|
| `getAge()` | Player tick count |
| `getHealth()`, `getMaxHealth()`, `getAbsorption()` | Health values |
| `getFoodLevel()`, `getSaturation()` | Hunger/saturation |
| `getAirSupply()` | Remaining air ticks |
| `getX()`, `getY()`, `getZ()` | World position in blocks |
| `getYaw()`, `getPitch()` | Player orientation in degrees |
| `getSpeed()` | Vanilla movement-speed value, **not necessarily actual horizontal displacement per tick** |
| `getFreezingScale()` | Percent frozen (fractional) |

## Other queries

- `player.getSpeedVector()` → `{x,y,z}` from the player delta movement (world axes; useful for procedural inertia).
- `player.getStandingBlock()` → registry ID of the block immediately **below** the player's block position.
- `player.isStandingOnTag("minecraft:ice")` → boolean; this checks a **block tag** below the player (the string is illustrative; use a real existing tag ID).
- `player.getBiomeId()` → current biome registered name.
- `player.getActiveHand()` → `MAIN_HAND` or `OFF_HAND` according to the currently used item hand.

## Example: walking bob

```lua
local phase = 0
function update()
    local v = player.getSpeedVector()
    local speed = math.sqrt(v.x*v.x + v.z*v.z)
    phase = phase + speed * 12 * context.deltaTime
    local active = player.isOnGround() and math.min(speed*10,1) or 0
    matrices.moveY(math.sin(phase) * 0.03 * active)
end
```

## Example: land trigger

There is no dedicated `player.justLanded()` binding. Detect the edge yourself:

```lua
local wasGrounded = true
function update()
    if context.isMain and context.firstStep then
        local now = player.isOnGround()
        if now and not wasGrounded then shared.myPackLanding = true end
        wasGrounded = now
    end
end
```

Use `context.isMain` to avoid evaluating a global state transition twice per tick when the same script runs for both hands. A Blueprint `PLAYER_EVENT` node can generate this type of transition for you.


---
**Source:** `src/main/java/com/holdmylua/source/bindings/Player.java` in the supplied HMI source archive.
