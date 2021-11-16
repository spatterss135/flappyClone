import BaseScene from "./BaseScene"

class ControlsScene extends BaseScene {
    constructor(config){
        super('ControlsScene', config)
    }


    create() {
        super.create()

        this.add.text(this.config.width * .2, this.config.height * 0.3, 'Move:', this.config.fontStyling)
        this.add.image(this.config.width * .25, this.config.height * 0.85, 'arrow-keys')
        .setScale(0.5)
        .setOrigin(0.5, 1)

        this.add.text(this.config.width * .7, this.config.height * 0.3, 'Shoot:', this.config.fontStyling)
        this.add.text(this.config.width * .75, this.config.height * 0.47, 'or', this.config.fontStyling)
        this.add.text(this.config.width * .85, this.config.height * 0.48, 'SPACE', {fontSize: '24px', fontWeight: 'bold'})
        this.add.image(this.config.width * .65, this.config.height * 0.6, 'left-click')
        .setScale(0.25)
        .setOrigin(0.5, 1)



        const backButton = this.add.image(32, 32, 'back')
        .setScale(2)
        .setInteractive()

        backButton.on('pointerup', () => this.scene.start('MenuScene'))

    }



    
}

export default ControlsScene;