# `modelParts` / `model`: transformations of baked model quads

[← Documentation home](../README.md) · [API index](../reference/API_INDEX.md)

**Only registered in `item_model` scripts.** The source also registers `model` as an alias of the same Lua table.

Quad indices are zero-based and both endpoints are **inclusive**. The model-part editor's Auto-map works with the actual vanilla baked item model, but indexes are attached to the resolved current model: changing item model overrides can change their meaning.

## Function reference

| Call | Result |
|---|---|
| `modelParts.moveX(first,last,amount)` | Translation on X for quad range |
| `modelParts.moveY(first,last,amount)` | Translation on Y |
| `modelParts.moveZ(first,last,amount)` | Translation on Z |
| `modelParts.rotateX(first,last,degrees)` | Rotate X around origin |
| `modelParts.rotateY(first,last,degrees)` | Rotate Y around origin |
| `modelParts.rotateZ(first,last,degrees)` | Rotate Z around origin |
| `modelParts.rotateX(first,last,degrees,px,py,pz)` | Rotate X around pivot |
| `modelParts.rotateY(first,last,degrees,px,py,pz)` | Rotate Y around pivot |
| `modelParts.rotateZ(first,last,degrees,px,py,pz)` | Rotate Z around pivot |
| `modelParts.scale(first,last,x,y,z)` | Nonuniform scale |

The input range rejects `first < 0`, `last < first`, and `last > 1,000,000`; it does **not** establish whether those quads actually exist for the current item.

```lua
local hinge = {first=12, last=17, pivot={x=0.3,y=0,z=0}}
local t = 0
function update()
    if item.isEmpty() then return end
    t = t + context.deltaTime
    local a = math.sin(t*2) * 18
    modelParts.rotateY(hinge.first,hinge.last,a,
        hinge.pivot.x,hinge.pivot.y,hinge.pivot.z)
end
```

### Noncontiguous selections

The editor's mapping format supports explicit noncontiguous quad lists, but this Lua `modelParts` API works on **inclusive ranges**. If a mapped part owns quads `{0,3,8}`, do **not** call `modelParts.rotateY(0,8,...)` or you will animate unrelated faces. Use several single-quad/range calls or drive the authored part using the keyframe runtime.

### Model Parts editor workflow

1. Select the correct item in the model selector (resource-pack override active).
2. Use the vanilla baked-model Auto-map; inspect each mapped part's selected quads.
3. Give leaf parts and groups correct pivots; group pivots can be derived from geometry.
4. Animate only the parts you need in the timeline; visibility of a timeline row is different from visibility of baked quads.
5. Validate your animation in-game after changing model/resource packs.

See [Model Parts editor](../editor/02_KEYFRAMES_AND_MODEL_PARTS.md).


---
**Source:** `src/main/java/com/holdmylua/source/bindings/ModelParts.java` in the supplied HMI source archive.
