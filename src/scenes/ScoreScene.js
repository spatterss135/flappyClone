import BaseScene from "./BaseScene"

class ScoreScene extends BaseScene {
    constructor(config){
        super('ScoreScene', config)
    }


    create() {
        super.create()

        let bestScore = localStorage.getItem('high-score')
        this.bestScoreText = this.add.text(this.config.width/2, this.config.height/2, `${bestScore || 0}`, this.config.fontStyling)
        .setOrigin(0.5,1)

        const backButton = this.add.image(32, 32, 'back')
        .setScale(2)
        .setInteractive()

        backButton.on('pointerup', () => this.scene.start('MenuScene'))

    }



    
}

export default ScoreScene;
