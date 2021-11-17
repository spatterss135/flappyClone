import Enemy from '../enemyClasses/SuperClass'


class HomingBug extends Enemy {
    constructor(health, firerate, flightSpeed){
        super(health, firerate)
        this.health = 750
        this.firerate = 0
        this.flightSpeed = flightSpeed
        this.justTurned = false
        this.turnTimer = 0
        this.points = 50
        this.flightPlan = 'towards-player'
        this.image = 'alien'
        this.rotateAngle = 0
        this.bulletType = 'none'
    }
}


export default HomingBug