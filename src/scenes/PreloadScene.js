import Phaser from "phaser";

class PreloadScene extends Phaser.Scene {
    constructor(){
        super('PreloadScene')
    }

    preload(){
        this.load.image('sky', 'assets/space-age.jpg');
        this.load.image('bird', 'assets/bird.png')
        this.load.image('pipe', 'assets/pipe.png')
        this.load.image('pause', './assets/pause.png')
        this.load.image('back', './assets/back.png')
        this.load.image('bullet', './assets/bullet.png')
        this.load.image('enemyOne', './assets/enemySprites/enemy-level-1.png')
        this.load.image('arrow-keys', 'assets/arrow-keys.png')
        this.load.image('left-click', './assets/mouse-left-click.png')
        this.load.image('enemy-bullet', './assets/enemy-bullet.png')
    }

    create() {
        this.scene.start('MenuScene')
    }

}

export default PreloadScene;