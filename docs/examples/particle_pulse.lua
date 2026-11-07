function update()
    if not (context.firstStep and context.isMain and context.interactedMainHand) then return end
    particles.spawn{texture="minecraft:particle/crit", anchor="hand", pos={0,0,0},
      vel={0,0.025,0}, lifetime=16, size=0.08, fadeOut=6}
end
