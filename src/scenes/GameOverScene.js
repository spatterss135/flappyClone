import BaseScene from "./BaseScene"
import ScoreScene from "./ScoreScene"
class GameOverScene extends BaseScene {
    constructor(config){
        super('GameOverScene', config)
    }


    create() {
        super.create()
        let lastScore = localStorage.getItem('last-score')
        let highScore = localStorage.getItem('high-score')
        this.add.text(this.config.width/2, this.config.height/2 -100, 'GAME OVER', this.config.fontStyling).setOrigin(0.5, 1)
        this.add.text(this.config.width/2 + 100, this.config.height/2 , `YOUR SCORE: ${lastScore}`).setOrigin(0.5, 1)
        this.add.text(this.config.width/2 -100, this.config.height/2 , `HIGH SCORE: ${highScore}`).setOrigin(0.5, 1)
        let playAgain = this.add.text(this.config.width/2, this.config.height/2 +150, `PLAY AGAIN?`).setOrigin(0.5, 1)
        .setInteractive()
        let mainMenu = this.add.text(this.config.width/2, this.config.height/2 + 200, `MAIN MENU`).setOrigin(0.5, 1)
        .setInteractive()
        if(lastScore === highScore){
            this.add.text(this.config.width/2, this.config.height/2 -200, 'NEW HIGH SCORE!!!!', this.config.fontStyling).setOrigin(0.5, 1)
        }

        playAgain.on('pointerdown', () => this.scene.start('PlayScene'))
        playAgain.on('pointerover', () => playAgain.setStyle({fill: "#000"}))
        playAgain.on('pointerout', () => playAgain.setStyle({fill: "#fff"}))
        mainMenu.on('pointerdown', () => this.scene.start('MenuScene'))
        mainMenu.on('pointerover', () => mainMenu.setStyle({fill: "#000"}))
        mainMenu.on('pointerout', () => mainMenu.setStyle({fill: "#fff"}))

    }



    
}

export default GameOverScene;

