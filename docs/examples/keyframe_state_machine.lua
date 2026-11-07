local current=nil
function update()
    if not context.isMain then return end
    local v=player.getSpeedVector()
    local wanted="idle"
    if player.isSprinting() then wanted="run"
    elseif (v.x*v.x+v.z*v.z)>0.0004 then wanted="walk" end
    if wanted~=current then
        current=wanted
        keyframes.blendTo(wanted,{hand="MAIN_HAND",layer="base",loop="LOOP",duration=0.15})
    end
end
