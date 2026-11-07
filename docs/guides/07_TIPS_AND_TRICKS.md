# Tips & tricks — smooth counters, springs, pendulums and creative effects

[← Documentation home](../README.md) · [API index](../reference/API_INDEX.md)

Every recipe on this page is a **Lua procedural-animation technique**, not a new built-in HMI API. The implementations use standard Lua math, `context.deltaTime`, HMI `matrices`, and the existing bindings. Use each in a `hand`, `hand_relative` or `item` script and adapt the pivot for the intended category.

## Recipe 1: normalized interpolation

For a time-driven transition, accumulate seconds and convert to a normalized fraction:

```lua
local elapsed = 0
local duration = 0.35
function update()
    elapsed = math.min(duration, elapsed + context.deltaTime)
    local t = elapsed / duration
    local eased = easings.easeInOutCubic(t)
    matrices.moveZ(jmath.lerp(eased, -0.2, 0.0))
end
```

`t` is [0..1], `eased` makes the transition accelerate/decelerate, and `lerp(alpha,a,b)` blends values. For an exact time-limited action, reset `elapsed` when the action starts. The [Easings reference](../bindings/EASINGS.md) lists all built-in curves.

## Recipe 2: FPS-independent exponential smoothing

A simple `x = x + (target-x)*0.1` changes behavior with the number of updates. Use the elapsed time to compute a smoothing alpha:

```lua
local smooth = {MAIN_HAND=0, OFF_HAND=0}
function update()
    local hand = context.hand
    local dt = context.deltaTime
    local target = player.isSprinting() and 1 or 0
    local alpha = 1 - math.exp(-12 * dt) -- response 12 per second
    smooth[hand] = smooth[hand] + (target-smooth[hand]) * alpha
    matrices.rotateX(-12 * smooth[hand])
end
```

This avoids dependence on renderer FPS and behaves consistently for varying animation-speed settings, provided dt is positive and reasonable.

## Recipe 3: spring counter (damped spring to a target)

Useful for equip, inspect, aim or recoil. Unlike ordinary lerp, a second-order spring has **velocity**, so it can overshoot naturally.

```lua
local spring = {
  MAIN_HAND={x=0,v=0},
  OFF_HAND={x=0,v=0}
}
local frequency = 3.5            -- oscillations/s (approx. natural frequency)
local dampingRatio = 0.65       -- <1 bouncy, =1 critically damped, >1 sluggish

function update()
    local s = spring[context.hand]
    local dt = math.min(math.max(context.deltaTime,0), 0.05)
    local target = player.isUsingItem() and 1 or 0
    local omega = 2 * math.pi * frequency
    local acceleration = omega*omega*(target-s.x)
                      - 2*dampingRatio*omega*s.v
    s.v = s.v + acceleration*dt
    s.x = s.x + s.v*dt
    matrices.rotateX(-18*s.x)
end
```

The script's 3 substeps/tick help stability. If you increase frequency dramatically, consider more stable analytic integration or clamp dt/frequency; explicit Euler integration can explode for too-large steps. A damping ratio ~0.5–0.8 gives overshoot, 1.0 settles quickly without overshoot.

## Recipe 4: recoil impulse with spring restoration

Use a one-tick input pulse to add an impulse to the velocity, then let the spring decay. Keep separate state per hand:

```lua
local state={MAIN_HAND={x=0,v=0},OFF_HAND={x=0,v=0}}
function update()
    local s=state[context.hand]
    local dt=math.min(context.deltaTime,0.05)
    if context.firstStep then
        if context.isMain and context.swingedMainHand then s.v = s.v + 60 end
        if not context.isMain and context.swingedOffHand then s.v = s.v + 60 end
    end
    local frequency=4
    local omega=2*math.pi*frequency
    s.v=s.v+(-omega*omega*s.x-2*0.5*omega*s.v)*dt
    s.x=s.x+s.v*dt
    matrices.rotateX(s.x)
end
```

The impulse scale is degrees/second; tune it and the damping ratio. For a reusable authored recoil clip, `keyframes.retrigger` on an additive layer is another option.

## Recipe 5: pendulum swing

A pendulum's restoring acceleration depends on the sine of its angle. This looks good for a hanging lantern, swinging tool or dangling model part.

```lua
local angle, angularVelocity = 0.35, 0.0 -- radians
function update()
    if not context.isMain then return end
    local dt = math.min(context.deltaTime,0.05)
    local gravityOverLength = 16
    local damping = 1.4
    angularVelocity = angularVelocity
        + (-gravityOverLength*math.sin(angle) - damping*angularVelocity)*dt
    angle = angle + angularVelocity*dt
    matrices.rotateZ(math.deg(angle), 0.6,-0.7,-0.4)
end
```

This script updates only during main-hand execution. If you want the pendulum for both hands, store angle/velocity separately in a table indexed by `context.hand`. To react to walking, add a small velocity impulse based on the change in player velocity.

## Recipe 6: gentle breathing and natural idle noise

Pure sinusoids are deterministic and cheap:

```lua
local time = {MAIN_HAND=0,OFF_HAND=0}
function update()
    local h=context.hand
    time[h]=time[h]+context.deltaTime
    local t=time[h]
    local breathing = math.sin(2*math.pi*0.25*t)
    local secondary = math.sin(2*math.pi*0.39*t + 0.8)
    matrices.translate(0, breathing*0.008+secondary*0.003, 0)
    matrices.rotateZ(secondary*0.75)
end
```

Use two incommensurate frequencies for less repetitive movement. Keep amplitudes small when layered with active keyframe animations.

## Recipe 7: smoothly changing speed / counter

Suppose you want a transition between walking and running while keeping the step phase continuous:

```lua
local phase = {MAIN_HAND=0,OFF_HAND=0}
local cadence = {MAIN_HAND=0,OFF_HAND=0}
function update()
    local h=context.hand
    local dt=context.deltaTime
    local target=player.isSprinting() and 10 or 5
    cadence[h]=cadence[h] + (target-cadence[h])*(1-math.exp(-7*dt))
    phase[h]=phase[h]+cadence[h]*dt
    local amp=player.isOnGround() and 0.03 or 0
    matrices.moveY(math.sin(phase[h]) * amp)
end
```

The phase never resets during sprint transitions, avoiding a visible jump. The specific cadence values are illustrative, not derived from vanilla movement math.

## Recipe 8: respond to a nearby block with a pointing pose

```lua
local blend={MAIN_HAND=0,OFF_HAND=0}
function update()
    local hit = ik.find("minecraft:lever", 2.4, 50)
    local h=context.hand
    local target = hit and 1 or 0
    blend[h]=blend[h]+(target-blend[h])*(1-math.exp(-9*context.deltaTime))
    if hit and blend[h]>0.001 then
        local sx,sy,sz=0.75,-0.8,-0.6
        local dx,dy,dz=hit.view.x-sx, hit.view.y-sy, hit.view.z-sz
        local yaw=math.deg(math.atan2(-dx,-dz))
        matrices.rotateY(yaw*0.45*blend[h],sx,sy,sz)
    end
end
```

This is a partial aim example, not a fully calibrated hand-pointing IK. When target disappears, this basic code applies no rotation immediately; for a truly smooth return, retain the last target yaw in per-hand state and decay it toward zero. See [IK](../bindings/IK.md) for the return contract.

## Recipe 9: combine authored keyframes with procedural motion

Play a looping authored base and add a tiny procedural item sway rather than authoring hundreds of breath keys:

```lua
local active=nil
local t=0
function update()
    if context.isMain and (active==nil or not keyframes.exists(active)) then
        active=keyframes.play("idle", {hand="MAIN_HAND",layer="base",loop="LOOP"})
    end
    t=t+context.deltaTime
    matrices.moveY(math.sin(t*1.5)*0.005)
end
```

Use a correctly scoped current-hand state when applying to both hands. Avoid calling `play()` every update without checking whether the state is already active.

## Design checklist for procedural physics

- State lives in top-level `local` tables, not in temporary locals inside `update()`.
- Integrate with `context.deltaTime` (seconds); some Minecraft time values are ticks.
- Guard events with `context.firstStep` and the relevant hand predicate.
- Use **rotation pivots** when something should bend, rather than moving it linearly.
- Clamp dangerous parameters and consider `math.exp` smoothing.
- Use small amplitudes and debug overlay to inspect values.
- Verify right/left hand mirroring with your actual pack and active Minecraft mappings.
