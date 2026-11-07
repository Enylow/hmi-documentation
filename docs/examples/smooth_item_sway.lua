local value = {MAIN_HAND=0, OFF_HAND=0}
function update()
    local h = context.hand
    local target = player.isSprinting() and 1 or 0
    local alpha = 1 - math.exp(-8 * context.deltaTime)
    value[h] = value[h] + (target-value[h]) * alpha
    matrices.rotateX(-5 * value[h], 0.6,-0.7,-0.4)
end
