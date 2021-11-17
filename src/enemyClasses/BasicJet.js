import Enemy from '../enemyClasses/SuperClass'


class BasicJet extends Enemy {
    constructor(health, firerate, flightSpeed){
        super(health, firerate)
        this.health = 300
        this.firerate = 3
        this.flightSpeed = 40
        this.justTurned = false
        this.turnTimer = 0
        this.points = 10
        this.flightPlan = 'up-n-down'
        this.image = 'enemyOne'
        this.rotateAngle = -90
        this.bulletType = 'straight-shot'
    }
}


export default BasicJet