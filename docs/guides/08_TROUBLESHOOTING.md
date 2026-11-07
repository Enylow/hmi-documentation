# Troubleshooting: scripts not loading, input, models, particles and UI

[← Documentation home](../README.md) · [API index](../reference/API_INDEX.md)

## Start with the right source revision

This documentation is generated from the supplied latest **generic-block-IK full source ZIP**. Other local versions may have newer changes. Verify that your working project contains the same API implementations before assuming a function exists.

## Script never runs

1. Check `pack.mcmeta` and enabled resource pack.
2. Check that a discovered `assets/<ns>/holdmyitems/loader.lua` exists.
3. Check `Loader:load("ns:holdmyitems/path.lua","hand")` uses an actual resource identifier.
4. Check the category is one of `hand`, `hand_relative`, `item`, `item_model`.
5. Confirm the script has a **global** `function update()` (model scripts also allow legacy top-level execution).
6. Reload resources; read logs for `[HoldMyItems] Resource not found` or Lua execution errors.

## Works once, then stops

The active script cache sets `hasCrashed=true` after a Lua error, so it is not executed again until resource reload. Check `nil` lookup, missing stack, bad argument type, and methods that aren't registered in active globals.

## Animation stutters or moves too quickly

- A script runs 3 substeps per tick; use `context.deltaTime`, not `1` per invocation.
- Per-hand files may run twice per tick; use per-hand state for per-hand effects.
- Spawn particles/sounds/start keyframe playback using `context.firstStep` and hand gating.
- Persist velocity/counters in top-level locals, not inside `update()`.
- Watch for multiple loaded scripts transforming the same stage unexpectedly.

## Some axes are mirrored incorrectly

The active code supplies a `rightArm` value to the field named `context.isLeft`. Check the real physical side in your configured Minecraft client before mirroring. Keyframe playback already has mirroring rules, so double-mirroring can invert rotations unexpectedly.

## IK target is nil

- Confirm block ID exactly (e.g., `minecraft:stone_button`).
- Range clamps to 6 blocks, angle to 179 degrees.
- Make sure the block's outline is visible and the view cone includes the contact point.
- `ik.findButton` finds any button; `ik.find(id,...)` finds only the specified block.
- Blocks without outline shape may use a center fallback; special renderers may not have the geometry you expect.

## Particle is invisible

- Verify the texture exists under `assets/<namespace>/textures/particle/` or is a valid registered particle texture.
- Use `context.firstStep`, and check `particles.count()`.
- Some attached effects are hidden when their first-person anchor isn't rendered.
- Following particles live in the first-person pass; free particles use world behavior.
- If `occlude=true`, the world may hide them; test `light="fullbright"` separately from blend mode.

## Model part animates unrelated faces

Lua `modelParts` controls an inclusive quad-index **range**; the editor can store **explicit noncontiguous indices**. Check the actual baked quad selection; don't replace `{1,4,9}` with `moveX(1,9,...)`. Model overrides and component-driven item models can change baked submission ordering.

## Editor key shortcuts do nothing

Click the timeline to focus it; ensure no text input or modal is active. The intended controls are `K` add, Backspace/Delete remove, Ctrl+C/V copy-paste. Normal right-click opens Copy/Paste context menu, Ctrl+right-click performs selection.

## Blueprint output doesn't reflect changes

Save the project, **re-export** the generated resource pack, enable/reload it, and check the generated `loader.lua`. Editing a `.blueprint.json` project alone does not change live runtime scripts. The exporter writes a generated directory beneath `resourcepacks/` and validates all graph connections and numeric expressions.

## What to include in a bug report

Minecraft + Fabric version, HMI version/source revision, enabled resource packs (order), `loader.lua`, affected Lua snippet, full log/stack trace, screenshot or screen recording, and whether the same issue occurs with only one HMI pack loaded.
