# Blueprint variables, expressions, code generation and export

[← Documentation home](../README.md) · [API index](../reference/API_INDEX.md)

## Variables panel

The Blueprint project supports up to **64 variables** with name, type and initial value. Supported authored types in the current compiler include **NUMBER**, **BOOLEAN**, **STRING** and **TABLE**. Variable names must follow Lua identifier rules and stay within 48 characters; Lua keywords, duplicates and reserved identifiers are rejected.

```text
Variables
  sway_strength   NUMBER   0.12
  aiming          BOOLEAN  false
  mode            STRING   "idle"
  memory          TABLE    {}
```

These are *examples* of values you can author in the Variables panel; the source compiler validates initializers before export. The generated Lua places them as top-level locals (created once), not newly initialized on every `update()`.

**Screenshot placeholder — Blueprint Variables panel**

> `[INSERT SCREENSHOT: blueprint-variables.png — variable names, types and initializers]`

## Numeric expressions

Many numeric inspector fields accept an expression instead of only a literal. The compiler supports `$variableName` references and `$node12.value`-style node output references. Numeric fields include duration, speed, weight, transform X/Y/Z, value multiplier and value offset. Expressions are compiled by `BlueprintNumberExpression`, not evaluated arbitrarily at editor time. **This is a limited expression language:** finite numeric literals, parentheses, unary +/−, binary +/−/\*/÷, `$numberVariable`, declared `$node<ID>.<numericField>`, selected `context.<numericField>` names, and documented `msg.<field>` references. Arbitrary Lua function calls (e.g. `math.sin(...)`), table indexing and exponentiation are not part of the numeric expression grammar; use a Run Lua node for those.

```text
$blendStrength * 0.75
$node8.value
```

These snippets illustrate syntax; actual variable and node output names must exist in the current graph. Invalid references are rejected during save/export, and type checks limit which variable kinds are valid in a numeric expression.

## Generated scripts

The graph compiles to separate **hand** and **item** Lua scripts. Transform nodes only write into the script matching their selected domain. Playback/control nodes generate calls to `keyframes` with hand/layer semantics. The generated pack also exports animation clip JSON and registers each clip in `loader.lua`.

## Export result

The current exporter writes a **self-contained resource-pack directory** beneath the Minecraft game's `resourcepacks/` directory named `HMI_Blueprint_<slug>`, where the namespace is `hmi_bp_<slug>`. It creates `pack.mcmeta`, `blueprint.json`, the generated `assets/<namespace>/holdmyitems/loader.lua`, Lua scripts and sequence JSON. It does **not** directly produce a partial ZIP.

```text
resourcepacks/HMI_Blueprint_my_graph/
├── pack.mcmeta
├── blueprint.json
├── README.txt
└── assets/hmi_bp_my_graph/holdmyitems/
    ├── loader.lua
    ├── hand/blueprint.lua
    ├── item/blueprint.lua
    └── sequences/*.json
```

After exporting, enable the pack in Minecraft Resource Packs and reload resources (`F3+T`). Re-exporting a generated folder can overwrite the previous generated output; keep authored `.blueprint.json`/projects backed up.

## Editor JSON is not itself the runtime asset

The `.blueprint.json`/project stores nodes, wires, user parameters and variable definitions. The runtime executes the **generated** hand/item Lua files plus registered animation JSON. To ship a Blueprint, ship the exported resource-pack folder, not just the editor project JSON.

## Clip names and Model Parts

Clip references may be qualified with target prefixes such as `SCENE:name`, `HAND:name`, `ITEM:name`, or `model:name`. The exporter disambiguates model-part project clips using `model:` and registers them as `model_part`. The `AnimationClip.modelItem` value only determines the editor's preview item, not runtime filtering.

**Screenshot placeholder — export dialog/result**

> `[INSERT SCREENSHOT: blueprint-export.png — export location and success confirmation]`

## Validation constraints you may encounter

- Module names: start with a letter, then alphanumeric/underscore, up to 32 characters.
- At most 256 nodes per module.
- Node IDs must be positive and unique.
- No wires to missing nodes or wires incoming to On Update.
- Invalid duplicate outgoing targets are rejected.
- Maximum 64 variables; numeric expressions are parsed and validated.
- Lua route names must be valid identifiers; limit six routes and eight named return values.

If export fails, read the error, inspect the named node and module, and fix the graph instead of editing generated code in place.


---
**Source:** `src/main/java/com/holdmylua/source/animation_editor/blueprint/BlueprintExporter.java` in the supplied HMI source archive.
