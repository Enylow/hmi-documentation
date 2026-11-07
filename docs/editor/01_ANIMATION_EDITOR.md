# Animation Editor — workspace, project, timeline and workflow

[← Documentation home](../README.md) · [API index](../reference/API_INDEX.md)

HMI's built-in animation editor is a **visual authoring tool** for keyframe clips. It is distinct from a `.lua` script: keyframe clips are JSON assets that Lua plays through `keyframes` or that Blueprints combine into a resource-pack state machine.

## Main workspace

**Screenshot placeholder — full Animate workspace**

> `[INSERT SCREENSHOT: editor-full-layout.png — menu, tool toolbar, Animations, viewport, Outliner, Keyframe, Timeline, status bar]`

The current source contains a Blockbench-inspired layout with these conceptual regions:

- **Menu and tool rows:** File/Edit/View, Move/Rotate/Scale, Model Parts, Blueprints.
- **Animations list:** create, select, rename, close and manage authored animations.
- **Central viewport:** live first-person preview and gizmo; in Model Parts mode also previews the selected baked item model.
- **Outliner:** scene/hand/item animators and model-part hierarchy.
- **Keyframe inspector:** channel controls, X/Y/Z, pivots, interpolation and Bézier values.
- **Timeline:** keyframes, ruler, playback, graph editor and channel visibility.
- **Status bar:** file/status messages and dock toggles.

### Basic clip workflow

1. Create/open an animation from the Animations panel.
2. Select an animator (Scene, Hand, Item, or a mapped model part) in the Outliner/timeline.
3. Move the playhead to the desired time.
4. Choose a channel: Position, Rotation or Scale.
5. Create a key with **K** or the timeline key control. Select it, then enter axis values or use gizmo tools.
6. Add more keys and choose interpolation per channel.
7. Press Play to preview; enable Loop when appropriate.
8. Save the animation project/export JSON, then load the clips through `loader.lua` or export via Blueprints.

**Screenshot placeholder — creating first clip**

> `[INSERT SCREENSHOT: editor-new-animation.png — Animations panel with new clip]`

## Timeline

The timeline includes a resizable pinned track-name column (196px default desktop), separate time ruler and body, animator parents and Position/Rotation/Scale subchannels. Parent lanes can be expanded/collapsed. A checkbox on a channel controls its timeline visibility, not the player's game-world visibility.

### Transport

- Arrow controls jump to the beginning/end.
- Play/Pause toggles playback; the active playback icon uses the UI's green active state.
- Loop icon toggles looping (no text label).
- Ruler can be clicked/dragged to scrub the playhead.
- The timestamp corner shows time and frame; it can be edited in supported builds.
- Snap aligns edits to frame increments; graph view switches lane visualization.

**Screenshot placeholder — timeline controls**

> `[INSERT SCREENSHOT: editor-timeline.png — label head, ruler, playhead, channels and checkboxes]`

### Selecting/copying keys

The current UI supports **K** to add a keyframe, **Backspace/Delete** to delete selected keys, **Ctrl+C** / **Ctrl+V** to copy/paste, and context-menu Copy/Paste on right click. Regular right click opens the context menu, while Ctrl+right-click keeps selection/marquee behavior. Input fields and active modal dialogs take precedence: when typing in a number or name, these shortcuts must not accidentally affect the timeline.

### Scrolling and resizing

The timeline label column, timeline height and sidebars are user-resizable. The Keyframe panel's content scroll includes interpolation, Spring, and Bézier controls; its channel buttons stay accessible above the scrolling region. On narrow windows the layout collapses less important docks while preserving viewport space.

### Save States and modals

The Save States panel retains Capture/Restore workflows. Modals handle file operations, animation management, Spring baking and confirmations. If input seems unresponsive after closing a modal, click the timeline before testing shortcuts to establish focus.

## File management

An editor project may contain multiple clips. Runtime playback **requires the exported/loaded clip JSON**, not simply a clip visible in the editor's working session. Imported or grouped animations can have source-file names for display, but grouping by source in the sidebar does not imply a permanent filesystem hierarchy.

## Common mistakes

- Assuming the editor's `modelItem` is a gameplay filter; the code marks it as **preview item only**.
- Deleting a timeline row and assuming it deletes mapped mesh geometry. Row pinning/visibility differs from actual model part removal.
- Editing the wrong physical hand. Off-hand tracks may use mirrored main-hand fallback if no explicit off-hand track exists.
- Opening a dropdown while thinking the underlying PARTS/KEYFRAME tab remains clickable; modal/popup layers own input first.

Next: [Keyframes and Model Parts](02_KEYFRAMES_AND_MODEL_PARTS.md) and [Sound/Particle events, project files](05_EVENTS_AND_PROJECT_FILES.md).


---
**Source:** `src/main/java/com/holdmylua/source/animation_editor/gui/AnimationEditorScreen.java` in the supplied HMI source archive.
