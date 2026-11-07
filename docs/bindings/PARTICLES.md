# `particles`: first-person particles, emitters and ticker callbacks

[← Documentation home](../README.md) · [API index](../reference/API_INDEX.md)

This page includes the source author's full option list and ticker/handle semantics, followed by HMI-specific examples. The key difference from first-person matrices is that particles may be **free world-space effects** or anchored/following effects.

## Minimal spawn example

```lua
function update()
    if context.firstStep and context.interactedMainHand then
        particles.spawn{
            texture = "minecraft:particle/crit",
            anchor = "item",
            pos = {0,0.1,0}, vel = {0,0.02,0},
            lifetime=16, size=0.08, fadeOut=6
        }
    end
end
```

The exact texture name must exist in an available particle atlas/resource pack; use textures from the shipped pack or verify vanilla paths before publishing.

## Emitter with a ticker

```lua
local function flutter(p)
    p.vx = p.vx + math.sin(p.age * 0.2) * 0.0005
    p.rotation = p.rotation + 4
end

function update()
    if context.firstStep and context.isMain then
        particles.spawn{texture="example:glow", anchor="hand", lifetime=25,
            size=0.08, fadeIn=3, fadeOut=8, ticker=flutter}
    end
end
```

Do not exceed the particle cap; gate spawns and check `particles.count()` when diagnosing performance. See details below.

## Source API documentation (verbatim source-derived content)

### Particle runtime contract and options

Particles are **world-space**, **tick-driven** and drawn in the first-person pass. The model is the
one used by Item-Particles: a particle is born at a point on the hand / item, then stays in the
world (it does not follow the hand), is simulated once per client tick, and is interpolated with the
frame's partial tick when drawn.

```
client tick   scripts run (3 sub-steps / hand) -> particles.spawn() queues a request
              ParticleEngine.tick(): every particle advances 1 tick (Lua tickers run here)
render frame  hand / item pose known -> the request becomes a real world particle that is added
              to the vanilla particle engine
              level pass : drawn by the engine (world depth, fog, light, sorting, block occlusion)
              hand pass  : only particles that came closer to the camera than the hand they were
                           born on (otherwise the hand, drawn over the level, would cover them)
```

* The first rendered frame after `spawn` is when the particle appears (`p.spawned` turns true).
  Requests that never see a frame (hand hidden, third person, ...) are dropped after 4 ticks.
* `context.firstStep` is true only in the first of the 3 script sub-steps of a tick. Guard
  `particles.spawn` with it to spawn once per tick.
* All time values are in **ticks** (20 / s), distances in **blocks**.

## `particles.spawn(options) -> particle | nil`

Returns the particle handle (nil when the cap of `particles.MAX` = 256 is reached).

| option | default | meaning |
|---|---|---|
| `texture` | required* | `"flame_8"`, `"mypack:glow"`, `"minecraft:particle/x"` or a full `"ns:textures/particle/x.png"`. **The PNG must be in `assets/<ns>/textures/particle/`** (it is stitched into the vanilla particle atlas) |
| `textures` | – | list of textures = frame animation (*replaces `texture`*) |
| `frameTicks` / `loop` | `2` / `false` | ticks per frame; loop the frames (otherwise the last frame is held and, unless `lifetime` is set, the particle ends after the last frame) |
| `anchor` | `"item"` | space of `pos`: `"item"` (after item scripts, before the model's display transform), `"hand"` (the arm), `"camera"` (view space: +x right, +y up, -z forward) |
| `follow` | `"free"` | `"free"`: existing world particles; `"attached"`: exact anchor position every rendered frame; `"smooth"`: exponentially follows the animated anchor position |
| `followSpeed` | `12` | response in inverse seconds for smooth following, clamped to 0.01..1000; higher = less lag; independent of FPS |
| `pos` / `x,y,z` | `0,0,0` | spawn offset in anchor space (`{x,y,z}` or `{x=,y=,z=}`) |
| `vel` / `vx,vy,vz` | `0,0,0` | velocity in blocks/tick |
| `velSpace` | `"world"` | `"anchor"` interprets `vel` in the anchor's axes instead |
| `hand` | script's hand | `"main"` / `"off"` |
| `lifetime` | `20` | ticks |
| `size` | `0.1` | quad edge in blocks |
| `rotation`, `spin` | `0`, `0` | roll in degrees around the view axis; degrees per tick |
| `gravity`, `drag` | `0`, `1` | downward acceleration per tick; velocity multiplier per tick |
| `color` / `alpha` | white / `1` | `{r,g,b[,a]}` in 0..1 |
| `blend` | `"translucent"` | `"additive"` for glows |
| `light` | `"world"` | `"world"`: light sampled at the particle's position through Minecraft's live lightmap (weather, time of day, gamma). `"fullbright"` (or `true`): maximum brightness with the emission bit, so the particle is never shaded, day or night, in caves, in both render passes. A number `0..15`: pins the *block* light to that level, independent of time of day. Additive blending does not imply fullbright. |
| `fullbright` | `false` | shortcut for `light = "fullbright"` (kept for old scripts) |
| `collision` | `false` | `true`: the particle collides with blocks (free particles only; following particles ignore it). It stops against walls and ceilings, and when it falls onto the top of a block it eases down to **lie flat** on it (quad facing up, `rotation` becomes its heading on the surface), slides to a stop and stays there until its lifetime ends, like a fallen leaf. Needs `gravity > 0` (or a downward `vel`) to come down. The collision box is a small square around the particle (`size * 0.25`, clamped to 0.01..0.1 blocks) with its bottom at the particle's position |
| `occlude` | `true` | `true`: normal world particle, hidden by blocks. `false`: always drawn on top in the first-person pass, never hidden by blocks |
| `fadeIn`, `fadeOut` | `0` | ticks of alpha ramp at start / end of life |
| `growIn`, `shrinkOut` | `0` | ticks of size ramp at start / end of life |
| `data` | `{}` | table exposed as `p.data` |
| `ticker` | – | `function(p)` **or** the name of a global function (string) |

## The particle handle (`p`)

```
read / write  x y z  vx vy vz  gravity drag  size rotation spin  r g b alpha  lifetime
              fullbright light("world"|"fullbright"|0..15)  collision  occlude  blend
read only     age  progress (0..1)  ox oy oz (spawn point)  id  dead  spawned  hand  data
              onGround (resting on a block; only with collision)
methods       p:kill()   p:setColor(r,g,b[,a])   p:setVelocity(x,y,z)
              p:teleport(x,y,z)   p:setTexture("name")
```
For following particles, `localX`, `localY`, `localZ` are writable anchor-space offsets.
`followSpeed` is writable; `follow` is read-only (choose the mode at spawn).
Velocity/gravity/drag of following effects act on their local offsets; `velSpace` applies only
to free effects. `x/y/z` still expose the resolved world position, but the next frame's anchor
update owns that position: animate `localX/Y/Z` for stable orbits instead of teleporting.

Following effects are first-person billboards, updated from the same pose used for the item.
They are drawn only in the hand pass, with hand/item depth testing, rather than also drawing a
stale copy in the world pass. They are hidden when their anchor is not rendered (third person,
hidden hands, scope); simulation/lifetime continues. On reappearance they snap to the current
anchor rather than leaving an old-position trail. They are killed if that hand's item/components
change; stack count changes alone do not kill them. They do not follow dropped items or other players.
`occlude` does not switch following effects into the vanilla world pass.

Example pack: `HMI_FOLLOW_EXAMPLES` (standalone, includes base animations; enable above other HMI packs). Hold a torch,
soul torch, lantern or soul lantern for an attached glow, or an enchanted book for smooth sparks.
Each hand works independently. Glow position is an adjustable offset in item-script space,
before the model's own display transform; it is not an automatic model bone lookup.
`x/y/z` are absolute world coordinates. Assigning `p.x` moves the particle and the renderer
interpolates across the jump; use `p:teleport` to jump without interpolation.

### Collision notes

* A landed particle is drawn by the world pass; it is never pulled into the first-person pass.
* `onGround` is recomputed every tick: if a ticker sets a positive `vy` the particle lifts off and
  turns back into a billboard; with `gravity > 0` it lands again.
* Horizontal velocity is multiplied by 0.6 per tick while resting and `spin` is set to 0 on landing.
* `occlude = false` particles are drawn on top in the first-person pass and are billboards or flat
  as simulated, but are not hidden by the blocks they rest on.
* Fog, and shader packs that replace the particle shader, can still tint particles: `light` only
  controls the lightmap coordinates the vanilla particle pipeline is given.

## Ticker rules

* Runs once per client tick, **before** the particle moves that tick. Order per tick:
  `age++ -> ticker -> gravity/velocity/drag -> spin -> frame -> fades`.
* A ticker may be an inline function, a local/global function value, or a global's name. The name
  form is looked up on every call, so the function may be defined after the `spawn` call.
* An error inside a ticker kills **that particle only** and shows a toast (rate limited); the
  script itself keeps running.
* `particles.clear()` is allowed inside a ticker.

## Other

`particles.count()` – pending + live particles. `particles.clear()` – remove all.
`particles.TICK` – seconds per tick (0.05). Particles are cleared on world change and on resource
reload (their Lua closures belong to the scripts that were just discarded).

## Differences to the old (per-frame) system

The old `particleManager:addParticle(<22 positional args>)`, `Texture:of(...)`, `context.particles`,
the `ITEM/HAND/SCREEN` render spaces and the `SCALE/OPACITY/SPAWN/KEYFRAME` lifecycle strings are
gone. `fadeIn/fadeOut/growIn/shrinkOut/textures` replace the lifecycle types; `anchor` replaces the
render spaces; `deltaTime` scaling is no longer needed (everything is per tick).


---
**Source:** `src/main/java/com/holdmylua/source/particles/PARTICLES_LUA_API.md` in the supplied HMI source archive.
