import BaseScene from "./BaseScene"

class PauseScene extends BaseScene {
    constructor(config){
        super('PauseScene', config)

        this.menu = [
            {scene: 'PlayScene', text: 'Resume'},
            {scene: 'MenuScene', text: 'EXIT'}
        ]
    }


    create() {
        super.create()
        this.createMenu(this.menu, this.setUpButtonFunctionality.bind(this))
    }

    setUpButtonFunctionality(menuButton, scene) {
        menuButton.setInteractive()
        menuButton.on('pointerover', () => menuButton.setStyle({fill: "#000"}))
        menuButton.on('pointerout', () => menuButton.setStyle({fill: "#fff"}))
        menuButton.on('pointerdown', () => {
            if (menuButton.text === 'Resume') {
                this.scene.stop()
                this.scene.resume(scene)
                console.log(scene)
                
            }
            else {
                this.scene.stop('PlayScene')
                this.scene.start(scene)
            }})
        
    }

    
}

export default PauseScene;