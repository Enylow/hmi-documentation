# Keyframe editing, graph curves, automatic pivots and Model Parts

[← Documentation home](../README.md) · [API index](../reference/API_INDEX.md)

## Animators and channels

A normal clip contains Scene, Hand, and Item transforms, with main/off-hand tracks. Every transform key can carry **Position, Rotation and Scale** channels, each with X/Y/Z values. Model Parts use an authored part/group hierarchy and a separate channel setup.

**Screenshot placeholder — right Keyframe editor**

> `[INSERT SCREENSHOT: editor-keyframe-inspector.png — Position/Rotation/Scale tabs, X/Y/Z and pivot]`

The compact Keyframe inspector selects one channel at a time to show three axis inputs plus three pivot fields. A selected animator with no key on the chosen channel still displays sampled values. Changing a value may create the missing channel key at the playhead; merely clicking the channel tab should not create data.

### Axis colors

HMI follows its gizmo convention: X red `#FF5555`, Y green `#55FF55`, Z blue `#5599FF`. The colors help distinguish fields, graph axes and gizmo handles. The color is a visual hint, not an additional animation channel.

## Interpolation

The source includes **Linear**, **Bézier**, and **Catmull-Rom** modes and a **Bake Spring** editor action.

| Mode | Useful for | Watch for |
|---|---|---|
| Linear | Exact uniform segments, steady mechanical travel | Abrupt velocity changes at keys |
| Bézier | Ease-in/out, precise anticipation/overshoot curves | Handle lengths and slopes can cause unintended overshoot |
| Catmull-Rom | Smooth paths through several keys | May overshoot between keys; test pivots/fast rotations |
| Bake Spring | Procedural spring-like movement baked into keys | Baking creates new samples; save a state first if experimenting |

The graph editor shows X/Y/Z curves with colored axis selectors and editable Bézier handles on supported segments. A graph curve is a *view/editor* for the same underlying keyframe values; it is not a separate Lua animation.

**Screenshot placeholder — graph editor with Bézier handles**

> `[INSERT SCREENSHOT: editor-graph-bezier.png — colored axis selection and dragged handles]`

### Bezier handles

Choose Bézier for the selected channel, then adjust the handles in the graph or numeric fields. The curve segment's end points come from adjacent keys; the handles control time/value tangents. If handles cannot be grabbed, confirm that the key is selected, the channel uses Bézier, and its segment is within the visible graph range.

### Spring baking

The Spring dialog exposes parameters such as frequency, damping ratio and initial velocity; it computes/bakes keys into the animation, unlike runtime procedural springs in Lua. Verify the selected key/channel and use editor Save States when testing large bakes.

**Screenshot placeholder — Bake Spring dialog**

> `[INSERT SCREENSHOT: editor-bake-spring.png — spring parameters and preview]`

## Model Parts mode

Model Parts is for *baked item model geometry*: the Outliner lists authored leaf parts and groups; the selected model comes from the item's actual resolved baked quads, not a guessed JSON face order.

**Screenshot placeholder — Model Parts and selected item**

> `[INSERT SCREENSHOT: editor-model-parts.png — right Outliner, pivot gizmo and mapped parts]`

### Selecting the model

Use the model-selector button to pick a registered item. The picker offers LIST (item icons) and GRID (rotating third-person model previews) views. The current button displays the selected item's GUI icon and name. The picked ID is an editor preview selection, not a runtime filter on animations.

### Auto-map

Auto-map uses resolved baked-model quads and may identify cuboid groups where it can; parts made from generated or special models may be heuristic or unsupported. Inspect each part's **exact quad set** by highlighting it. The editor supports noncontiguous selections, unlike the Lua `modelParts` range API.

### Grouping and pivots

A leaf part pivot can be placed at the center of its baked geometry. New groups compute a center based on the union of member quads; nested groups are supported with cycle prevention. Avoid converting back into zero-pivot assumptions. When adding members, the preview should highlight **only checked members** (and descendants of checked groups). Group membership, actual quad ownership and timeline row visibility are separate concepts.

### Timeline row filtering

Mapped parts are not automatically all shown in the timeline. Select or explicitly pin parts you are animating; removing a timeline row should not remove model geometry or existing authored keys. Keep your workspace focused on a few animated pieces, and use the Outliner for the full hierarchy.

**Screenshot placeholder — nested groups and highlighted selection**

> `[INSERT SCREENSHOT: editor-groups.png — nested groups, checked member highlights, center pivot]`

## Off-hand fallback

`AnimationClip.playbackTrack` uses explicit OFF keys if available; otherwise it can reuse MAIN keys with runtime mirroring. This is why checking both hands in the editor and in-game matters even when the same clip is loaded for both.

## Example workflow: animated item mechanism

1. Select the custom item and run Auto-map.
2. Highlight each part to confirm which quads belong to it.
3. Create a group for moving mechanical elements and check the auto-centered pivot.
4. Pin only that group and the moving leaf parts in the timeline.
5. Key rotation at 0s, 0.25s and 0.5s, adding Bézier easing where appropriate.
6. Save a project, export sequences and play them through `keyframes.play`.


---
**Source:** `src/main/java/com/holdmylua/source/animation_editor/animation/AnimationClip.java` in the supplied HMI source archive.
