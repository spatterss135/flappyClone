import Phaser from "phaser";

class BaseScene extends Phaser.Scene {
    constructor(key, config){
        super(key)
        this.config = config
    }

    create() {
        this.addBG()

    }

    addBG (){
        this.add.image(this.config.width/2, this.config.height/2, 'sky');
    }

    createMenu(menu, setupMenuEvents) {
        let buttonHeightDifference = -100
        menu.forEach(option =>{
            const menuButton = this.add.text(this.config.width/2, this.config.height/2 + buttonHeightDifference, option.text, {fontSize:'32px'})
            .setOrigin(0.5, 1)
            buttonHeightDifference += 100
            
            setupMenuEvents(menuButton, option.scene)
        })
    }
}

export default BaseScene;