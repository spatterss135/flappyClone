import Enemy from '../enemyClasses/SuperClass'


class SpaceCruiser extends Enemy {
    constructor(health, firerate, flightSpeed){
        super(health, firerate)
        this.health = 1000
        this.firerate = 1
        this.flightSpeed = flightSpeed
        this.justTurned = false
        this.turnTimer = 0
        this.points = 1000
        this.flightPlan = 'none'
        this.image = 'enemyThree'
        this.rotateAngle = 0
        this.bulletType ='slight-home'
    }
}


export default SpaceCruiser