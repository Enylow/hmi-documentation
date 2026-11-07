# Lua API index — every binding and registered function

[← Documentation home](../README.md) · [API index](../reference/API_INDEX.md)

The table below is a **source-derived inventory** of each class in `com.holdmylua.source.bindings` and the Lua name available in the active script environment. A stub or an unregistered helper is not callable by default.

| Java class | Lua global | Page | Registered keys / members |
|---|---|---|---|
| `Context` | `context` | [Reference](../bindings/CONTEXT.md) | `swingProgress`, `equipProgress`, `isLeft`, `isMain`, `hand`, `deltaTime`, `mainHandSwingProgress`, `offHandSwingProgress`, `mainHandSwitchEvent`, `offHandSwitchEvent`, `interact`, `blockBreaking`, `step`, `steps`, `firstStep`, `swingMHand`, `swingOHand`, `swingedMainHand`, `swingedOffHand`, `interactedMainHand`, `interactedOffHand` |
| `Debug` | `stub` | [Reference](../bindings/DEBUG_STUB.md) | `(none)` |
| `DebugBinding` | `debug` | [Reference](../bindings/DEBUG.md) | `out`, `id`, `set`, `remove`, `clear` |
| `Easings` | `easings` | [Reference](../bindings/EASINGS.md) | `easeInSine`, `easeOutSine`, `easeInOutSine`, `easeInQuad`, `easeOutQuad`, `easeInOutQuad`, `easeInCubic`, `easeOutCubic`, `easeInOutCubic`, `cubicEase`, `easeInQuart`, `easeOutQuart`, `easeInOutQuart`, `easeInQuint`, `easeOutQuint`, `easeInOutQuint`, `easeInExpo`, `easeOutExpo`, `easeInOutExpo`, `easeInCirc`, `easeOutCirc`, `easeInOutCirc`, `easeInBack`, `easeOutBack`, `easeInOutBack`, `easeInElastic`, `easeOutElastic`, `easeInOutElastic`, `easeOutBounce`, `easeInBounce`, `easeInOutBounce` |
| `Ik` | `ik` | [Reference](../bindings/IK.md) | `find`, `findButton`, `getPoint`, `solveHand`, `yaw`, `pitch`, `unclampedDistance`, `applyHand`, `world`, `view`, `normal`, `viewNormal`, `eye`, `distance`, `blockId`, `blockX`, `blockY`, `blockZ`, `pressed`, `x`, `y`, `z` |
| `ItemBinding` | `item` | [Reference](../bindings/ITEM.md) | `getComponents`, `isDisabled`, `setSwingSpeed`, `renderAsBlock`, `getSpearData`, `canDismount`, `canKnockBack`, `canDamage`, `hitImpact`, `getUseAction`, `getAttackDamage`, `isOf`, `isIn`, `isBlockInTag`, `getId`, `getName`, `isEmpty`, `isChargedCrossbow`, `isBlock`, `isLantern`, `isEnchanted` |
| `ItemReg` | `items` | [Reference](../bindings/ITEMS.md) | `setSwingSpeed`, `getAllByTag`, `getAllByBlockTag`, `getAllByUseAction` |
| `Keybind` | `stub` | [Reference](../bindings/KEYBIND_STUB.md) | `(none)` |
| `MathHelper` | `jmath` | [Reference](../bindings/JMATH.md) | `PI`, `sin`, `cos`, `clamp`, `floor`, `abs`, `lerp`, `pow`, `ceil`, `round` |
| `Matrices` | `matrices` | [Reference](../bindings/MATRICES.md) | `moveX`, `moveY`, `moveZ`, `translate`, `rotateX`, `rotateY`, `rotateZ`, `shear`, `scale` |
| `ModelParts` | `modelParts / model (model scripts)` | [Reference](../bindings/MODEL_PARTS.md) | `moveX`, `moveY`, `moveZ`, `rotateX`, `rotateY`, `rotateZ`, `scale` |
| `Overlay` | `stub` | [Reference](../bindings/OVERLAY_STUB.md) | `(none)` |
| `Particles` | `particles` | [Reference](../bindings/PARTICLES.md) | `MAX`, `TICK`, `spawn`, `count`, `clear` |
| `Player` | `player` | [Reference](../bindings/PLAYER.md) | `isFlying`, `isFallFlying`, `isSleeping`, `isPassenger`, `isOnFire`, `isInLava`, `isBlocking`, `isAlive`, `getFoodLevel`, `getSaturation`, `getAirSupply`, `getMaxHealth`, `getAbsorption`, `isSneaking`, `getAge`, `isSprinting`, `isUsingItem`, `isOnGround`, `isSwimming`, `isClimbing`, `isCrawling`, `isSubmergedInWater`, `isTouchingWater`, `isUsingRiptide`, `canFreeze`, `isInPowderSnow`, `isRaining`, `isItemCoolingDown`, `getHealth`, `getX`, `getY`, `getZ`, `getSpeedVector`, `x`, `y`, `z`, `getSpeed`, `getYaw`, `getPitch`, `getFreezingScale`, `isStandingOnTag`, `getStandingBlock`, `getBiomeId`, `getActiveHand` |
| `Shared` | `shared` | [Reference](../bindings/SHARED.md) | `persistent Lua table (no methods)` |
| `Sound` | `not registered` | [Reference](../bindings/SOUND.md) | `playSound` |
| `TagReg` | `stub` | [Reference](../bindings/TAGREG_STUB.md) | `(none)` |

## Additional runtime binding outside `bindings/`

**`keyframes`** comes from `animation_editor.lua.KeyframeBinding` and is installed in the active runtime. Its source-register key set is:

`triggerSequence`, `runSequenceWithCustomProgress`, `play`, `retrigger`, `blendTo`, `playBoth`, `blendToBoth`, `stop`, `stopLayer`, `stopAll`, `pause`, `resume`, `restart`, `setWeight`, `fadeTo`, `setProgress`, `setTime`, `setSpeed`, `setLoopMode`, `setBlendMode`, `setPriority`, `setBlendEasing`, `setAutoFadeOut`, `isPlaying`, `exists`, `find`, `progress`, `time`, `weight`, `targetWeight`, `name`, `length`, `layerPlaying`, `layerName`, `layerProgress`, `layerTime`, `layerWeight`, `layerPaused`, `layerNearEnd`, `isPaused`, `setLayerSpeed`, `setLayerWeight`, `fadeLayer`, `setLayerProgress`, `pauseLayer`, `resumeLayer`, `restartLayer`, `syncLayerProgress`.

Full usage, defaults, return types and examples: [Keyframe API](../bindings/KEYFRAMES.md).

See also [which globals are registered](RUNTIME_AVAILABILITY.md) and [source limitations](SOURCE_NOTES.md).


---
**Source:** `src/main/java/com/holdmylua/source/lua/runtime/LuaScriptCache.java` in the supplied HMI source archive.
