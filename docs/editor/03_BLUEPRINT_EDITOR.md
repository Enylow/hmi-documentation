# Blueprint Editor — visual logic graph, node reference and execution

[← Documentation home](../README.md) · [API index](../reference/API_INDEX.md)

The Blueprint editor is HMI's node-based authoring tool for composing animation state machines, transforms, conditions and Lua snippets. A Blueprint project is a declarative graph (`BlueprintProject`), compiled by `BlueprintCompiler` into Lua scripts and exported with keyframe JSON clips.

**Screenshot placeholder — Blueprint canvas**

> `[INSERT SCREENSHOT: blueprint-canvas.png — modules, nodes, links, inspector]`

## Mental model

```text
On Update
   ├─ condition: player sprinting?
   │    ├─ YES → Blend To Animation "run"
   │    └─ NO  → Blend To Animation "idle"
   └─ Matrix Transform → Run Lua → another node
```

Each graph entry is evaluated in generated `update()` code. Conditional nodes split Yes/No; ordinary nodes forward their Next output. Multiple outgoing connections are supported; nodes may share destinations. The compiler validates that links refer to real nodes.

## Node types (all source enum values)

| Node | Type constant | What it does |
|---|---|---|
| **On Update** | `ENTRY` | Root execution, runs every script update |
| **Check Condition** | `CONDITION` | Boolean/numeric comparison and yes/no routes |
| **Play Animation** | `PLAY` | Play named sequence through runtime keyframe API |
| **Blend To Animation** | `BLEND` | Crossfade/transition to named sequence |
| **Stop Layer** | `STOP` | Stop playback on a layer |
| **Matrix Transform** | `TRANSFORM` | Translate, rotate or scale in a selected stage |
| **Run Lua** | `LUA` | Execute authored code with named routes/outputs |
| **Call Module** | `MODULE` | Run another named module |
| **Animation Control** | `CONTROL` | Change layer state, weight, progress or speed |

**Screenshot placeholder — node palette**

> `[INSERT SCREENSHOT: blueprint-node-palette.png — all nine node types]`

## Conditions

The compiler supports these condition categories: `ITEM`, `ITEM_TAG`, `BLOCK_TAG`, `PLAYER`, `VARIABLE`, `HEALTH`, `SPEED`, `PLAYER_NUMBER`, `PLAYER_EVENT`, `KEYFRAME`, `BIOME`, `BLOCK`, and other source-validated choices. Important distinctions:

- **ITEM** tests `item.isOf(id)`; **ITEM_TAG** uses `item.isIn(tag)`.
- **BLOCK_TAG** tests what the player stands on using `player.isStandingOnTag(tag)`; it does *not* search all nearby blocks.
- **BLOCK** tests `player.getStandingBlock()` (the block below feet).
- **PLAYER** tests states such as sprinting, sneaking, using an item, swimming, falling, alive, gliding, cooldown, etc.
- **PLAYER_NUMBER** compares health, pitch, yaw, speed, age, hunger, air, position and other numeric values.
- **PLAYER_EVENT** generates transitions such as Started Sprinting, Landed, Started Using Item, Stopped Moving.
- **KEYFRAME** queries layer playing/paused/name/progress/time/weight/near end.
- **VARIABLE** compares Blueprint-local number/boolean/string variables; arbitrary tables are not compared visually.

Use `==` or `~=` for booleans. Numeric comparisons can use source-supported operators; invalid combinations are rejected by validation. Item and tag choices can be selected from registry-backed search lists rather than requiring manual ID typing.

**Screenshot placeholder — condition inspector and item/tag selector**

> `[INSERT SCREENSHOT: blueprint-condition-item-picker.png — searchable item or item-tag choice]`

## Animation control nodes

The compiler supports `Fade Weight`, `Set Weight`, `Set Speed`, `Set Progress`, `Pause`, `Resume`, `Restart`, and `Sync Progress`. A value may be constant or derived from player speed, vertical speed, pitch, yaw, health and freezing. Controls targeting the same layer should be coordinated so an update doesn't accidentally overwrite another node's value.

## Run Lua node

A Run Lua node embeds custom code in the generated script. Named routes (e.g., `success`, `failure`) allow branching; named numeric return values are referenced as `$node<ID>.<field>` in expression inputs. Port names must be valid Lua identifiers; the compiler enforces route limits (six routes, eight returned values in current validation logic).

**Screenshot placeholder — Run Lua editor**

> `[INSERT SCREENSHOT: blueprint-run-lua.png — code area, named routes, returned values]`

## Modules

Modules are named subgraphs; Call Module invokes them. The compiler checks name format, node IDs, module references, and graph edges. Keep modules small (e.g., Movement, Combat, Idle, Inventory) to make debugging easier.

## Recommended graph workflow

1. Create/open a Blueprint project.
2. Add a Condition connected to On Update.
3. Connect Yes and No to different animation transitions.
4. Set hand (`MAIN_HAND`, `OFF_HAND`, or both), layer and loop mode.
5. Test/inspect generated Lua; avoid writing the same layer from multiple branches accidentally.
6. Configure variables and export the pack.

Next: [Blueprint variables and export](04_BLUEPRINT_EXPORT.md).


---
**Source:** `src/main/java/com/holdmylua/source/animation_editor/blueprint/BlueprintProject.java` in the supplied HMI source archive.
