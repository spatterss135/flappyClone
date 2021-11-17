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
        
        let menuMusic = this.sound.add('menu-music')
        console.log(menuMusic)
        menuMusic.play()
        this.createMenu(this.menu, this.setUpButtonFunctionality.bind(this), menuMusic)
        
        
    }

    setUpButtonFunctionality(menuButton, scene, music) {
        console.log(music)
        menuButton.setInteractive()
        menuButton.on('pointerover', () => {
            this.sound.add('click').play()
            menuButton.setStyle({fill: "#000"})})
        menuButton.on('pointerout', () => menuButton.setStyle({fill: "#fff"}))
        menuButton.on('pointerdown', () =>{
            if (menuButton.text === 'PLAY') {
                
            }
            console.log()
            this.scene.start(scene)})
        
    }

    
}

export default MenuScene;