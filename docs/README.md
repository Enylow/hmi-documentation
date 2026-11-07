# Hold My Items — Resource Pack & Lua Documentation

> **Source revision:** generated from `HoldMyItems_Generic_Block_IK_Find_Source.zip` supplied in this conversation (the most recent full source archive). The source includes Minecraft 26.2 naming, `ik.find`, first-person particles, the Blockbench-style editor and Blueprints. Documentation is a source review, not a verified game build.

This guide teaches how to author first-person animations using HMI's Lua resource-pack scripts and keyframe/Blueprint tools. Start with **Getting Started** if you have never written a Lua script; use the API index for exact function names.

## Getting started

1. [Quick start: your first pack](guides/01_GETTING_STARTED.md)
2. [Resource-pack layout and `loader.lua`](guides/02_RESOURCE_PACKS_AND_LOADER.md)
3. [How `update()` executes: time, scopes, and shared data](guides/03_UPDATE_LOOP_AND_STATE.md)
4. [The four script stages and transform order](guides/04_SCRIPT_STAGES.md)
5. [Lua language patterns for HMI](guides/05_LUA_FUNDAMENTALS.md)
6. [Matrix transforms, pivots and coordinate spaces](guides/06_MATRICES_AND_COORDINATES.md)

## Editors

- [Animation editor: workflow and panels](editor/01_ANIMATION_EDITOR.md)
- [Keyframes, graph, interpolation and model parts](editor/02_KEYFRAMES_AND_MODEL_PARTS.md)
- [Blueprint editor: nodes, wires and conditions](editor/03_BLUEPRINT_EDITOR.md)
- [Blueprint variables, generated code and export](editor/04_BLUEPRINT_EXPORT.md)
- [Sound/particle events and project files](editor/05_EVENTS_AND_PROJECT_FILES.md)

## Lua API by binding

- [Full global/function index](reference/API_INDEX.md)
- [Runtime globals and compatibility caveats](reference/RUNTIME_AVAILABILITY.md)
- [Keyframe state-machine API](bindings/KEYFRAMES.md)
- [Particles](bindings/PARTICLES.md) and [IK targeting](bindings/IK.md)
- [Matrices](bindings/MATRICES.md), [model parts](bindings/MODEL_PARTS.md)
- [Player](bindings/PLAYER.md), [item](bindings/ITEM.md), [item registry](bindings/ITEMS.md)
- [Context](bindings/CONTEXT.md), [shared state](bindings/SHARED.md)
- [Math](bindings/JMATH.md), [easings](bindings/EASINGS.md), [debug overlay](bindings/DEBUG.md)
- [Unregistered/stub binding classes](bindings/OPTIONAL_AND_STUB_BINDINGS.md)

## Recipes & maintenance

- [Tips & tricks: interpolation, spring counters, pendulum, sway, overshoot](guides/07_TIPS_AND_TRICKS.md)
- [Troubleshooting and compatibility](guides/08_TROUBLESHOOTING.md)
- [Copyable example scripts](examples/README.md)
- [Source coverage and limitations](reference/SOURCE_NOTES.md)

### Screenshots

The editor/Blueprint pages contain **SCREENSHOT PLACEHOLDER** blocks with suggested filenames so you can paste your own captures later. No imagery is invented.

### Important conventions

- Ordinary scripts use **LuaJ/Lua 5.2-style** syntax and a top-level `function update()`.
- HMI records transforms on **20 client ticks per second, with three substeps per tick**, then interpolates during rendering.
- The script category `item_model` is different from `item`: it changes **individual baked model quads**, not the entire held item.
- HMI's historical `context.isLeft` name is potentially misleading: the active tick code supplies a `rightArm` value to it. Confirm the physical-side convention in your resource pack before mirroring a pose.
