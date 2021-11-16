import Enemy from '../enemyClasses/SuperClass'


class BasicJet extends Enemy {
    constructor(health, firerate, flightSpeed){
        super(health, firerate)
        this.flightSpeed = flightSpeed
    }

    getSpeed() {
        console.log(this)
    }
}


export default BasicJet