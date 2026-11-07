local smooth={MAIN_HAND=0,OFF_HAND=0}
function update()
    local h=context.hand
    local hit=ik.find("minecraft:lever",2.35,50)
    local sx=context.isLeft and -0.75 or 0.75 -- calibrate physical side
    local sy,sz=-0.8,-0.6
    local desired=0
    if hit then
        local dx=hit.view.x-sx
        local dz=hit.view.z-sz
        desired=math.deg(math.atan2(-dx,-dz))
    end
    local a=1-math.exp(-8*context.deltaTime)
    smooth[h]=smooth[h]+(desired-smooth[h])*a
    matrices.rotateY(smooth[h]*0.45,sx,sy,sz)
end
