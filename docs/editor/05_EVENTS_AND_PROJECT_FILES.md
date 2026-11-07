# Sound and particle timeline events, project files and exported clips

[← Documentation home](../README.md) · [Animation editor](01_ANIMATION_EDITOR.md)

## Timeline events are not transform keyframes

The editor's event model is `animation_editor.animation.AnimationEvent`. Supported event types are **`SOUND`** and **`PARTICLE`**. Events are discrete cues evaluated by the runtime on **client ticks**, not triggered from every render frame.

| Stored field | Meaning |
|---|---|
| `time` | Cue time in clip seconds |
| `type` | `SOUND` or `PARTICLE` |
| `value` | Sound identifier or particle texture key |
| `volume`, `pitch` | Sound parameters (default 1.0 each) |
| `x`,`y`,`z` | Particle/emission offsets |
| `lifetime` | Particle lifetime in ticks (default 20) |
| `hand` | Legacy editor transient field; not persisted in format 3 |

The timeline includes separate Sound and Particle effect rows. Use the event editor for one-shot cues such as swing sounds, spark bursts or an impact effect. In Lua, `particles.spawn` provides more control over emitters and ticker callbacks; the active Lua runtime does **not** register the `Sound` Java helper as a global function.

**Screenshot placeholder — Event lanes**

> `[INSERT SCREENSHOT: editor-sound-particle-events.png — Sound and Particle timeline lanes with event editor]`

## File menu: project versus animation clip

The editor exposes New Project, New Animation, Open Project/Clip, Save Project, Save Project As, Rename Project, Rename Animation, and Export Active Clip JSON. A **project** is an editor working file containing multiple animations; a **clip** is an animation that can be registered independently at runtime.

A complete runtime flow is:

1. Create or edit clips inside the HMI animation editor.
2. Save your editor project so work can be resumed.
3. Export the active clip JSON (or use the Blueprint exporter to include all referenced clips).
4. Put JSON in your resource pack under `assets/<namespace>/holdmyitems/sequences/`.
5. Register with `Loader:loadKeyframeSequence("namespace:holdmyitems/sequences/idle.json", "hand", "idle")`.
6. Play with `keyframes.play("idle",{hand="MAIN_HAND",layer="base",loop="LOOP"})`.

## MAIN/OFF tracks

The current format supports dedicated main/off hand tracks for Scene, Hand and Item; when OFF is missing, playback can reuse mirrored MAIN keys. Model Part tracks have their own rig behavior. The editor's `modelItem` is **preview-only**, not a runtime predicate.

## Looping and events

Audio and particle cues belong at their intended timeline times; you do not need to put a manual `particles.spawn` in every Lua `update()` if a clip event is sufficient. Verify behavior when a clip loops, ping-pongs, stops or fades, because cue dispatch depends on the playback crossing event times.

**Screenshot placeholder — project save/export UI**

> `[INSERT SCREENSHOT: editor-project-export.png — clip JSON export and project save menu]`

---
**Source:** `animation_editor/animation/AnimationEvent.java`, `animation_editor/gui/AnimationEditorScreen.java`, `animation_editor/lua/AnimationEventDispatcher.java`.
