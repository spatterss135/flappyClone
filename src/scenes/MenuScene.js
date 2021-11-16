import BaseScene from "./BaseScene"

class MenuScene extends BaseScene {
    constructor(config){
        super('MenuScene', config)

        this.menu = [
            {scene: 'PlayScene', text: 'PLAY'},
            {scene: 'ScoreScene', text: 'SCORE'},
            {scene: 'ControlsScene', text: 'CONTROLS'},
            {scene: null, text: 'EXIT'}
        ]
    }


    create() {
        super.create()
        // this.scene.start('PlayScene')
        this.createMenu(this.menu, this.setUpButtonFunctionality.bind(this))
    }

    setUpButtonFunctionality(menuButton, scene) {
        menuButton.setInteractive()
        menuButton.on('pointerover', () => menuButton.setStyle({fill: "#000"}))
        menuButton.on('pointerout', () => menuButton.setStyle({fill: "#fff"}))
        menuButton.on('pointerdown', () =>this.scene.start(scene))
        
    }

    
}

export default MenuScene;