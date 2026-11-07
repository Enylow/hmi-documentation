local state = {MAIN_HAND={a=0.3,v=0}, OFF_HAND={a=0.3,v=0}}
function update()
    local s=state[context.hand]
    local dt=math.min(math.max(context.deltaTime,0),0.05)
    s.v=s.v+(-12*math.sin(s.a)-1.5*s.v)*dt
    s.a=s.a+s.v*dt
    local pivotX=context.isLeft and -0.75 or 0.75 -- verify side convention
    matrices.rotateZ(math.deg(s.a), pivotX,-0.8,-0.6)
end
