# `debug`: on-screen diagnostic widgets

[← Documentation home](../README.md) · [API index](../reference/API_INDEX.md)

The active runtime registers `debug = DebugBinding.createBinding(owner)`. Widgets persist while their script cache is alive and can be updated without spawning replacements.

| Function | Result |
|---|---|
| `debug.out(optionsTable)` | widget handle (table with `id`, `set` and `remove`) |
| `debug.clear()` | removes all widgets owned by this script cache |
| `widget:set(changesTable)` | updates this widget's property table |
| `widget:remove()` | removes this widget |

```lua
local widget = debug.out{
    text = "HMI active",
    -- Widget options are consumed by DebugOverlay; supported keys
    -- should be confirmed against DebugOverlay.Entry/render code.
}

function update()
    widget:set{ text = "Hand: " .. tostring(context.hand) }
end
```

## Debug overlay properties (confirmed in `DebugOverlay.render`)

| Property | Meaning / default |
|---|---|
| `type` | `"text"` default; also `"progress"`, `"bar"`, `"pie"`, `"table"` |
| `visible` | boolean, default true |
| `title` | text in the card header; defaults to uppercased type |
| `text` | main content for a text card |
| `x`, `y` | screen position in GUI pixels; `x` defaults 12; omitted `y` means auto-stack |
| `width` | card width clamped to 110–420, default 198 |
| `color` | integer packed color used by text/progress presentation |
| `min`, `max`, `value` | numbers for `progress`, default 0, 1, 0 |
| `data` | table for chart/table cards; `values` also accepted for bar/pie numeric arrays |

For a `progress` widget, the overlay draws a small bar and value/max labels; for `bar`/`pie`, `data` or `values` is interpreted as a numeric array (maximum 24 values). A `table` widget displays a short preview of a Lua table, and the debug-table inspector supports opening a visible table widget. `DebugOverlay` enforces at most **96 widgets** across owners.

```lua
local meter = debug.out{type="progress", title="Sprint blend", min=0,max=1,value=0}
local t = 0
function update()
    t=t+context.deltaTime
    meter:set{value=(math.sin(t)+1)*0.5}
end
```

The binding itself copies all supplied table keys without schema validation; the renderer interprets the keys above. Unknown keys do not necessarily have any visual effect. **Do not call `debug.out()` every substep** unless you actually want many widgets. Create once and update later.

`debug` is not Lua's standard debug library in this script environment; it is HMI's overlay API.


---
**Source:** `src/main/java/com/holdmylua/source/bindings/DebugBinding.java` in the supplied HMI source archive.
