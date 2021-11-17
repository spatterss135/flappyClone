import Phaser from "phaser";

class PreloadScene extends Phaser.Scene {
    constructor(){
        super('PreloadScene')
    }

    preload(){
        this.load.image('sky', 'assets/space-age.jpg');
        this.load.image('bird', './assets/player.png')
        this.load.image('enemyOne-bullet', './assets/bird.png')
        this.load.image('pipe', 'assets/pipe.png')
        this.load.image('pause', './assets/pause.png')
        this.load.image('back', './assets/back.png')
        this.load.image('bullet', './assets/bullet.png')
        this.load.image('enemyOne', './assets/enemySprites/enemy-level-1.png')
        this.load.image('arrow-keys', 'assets/arrow-keys.png')
        this.load.image('left-click', './assets/mouse-left-click.png')
        this.load.image('enemy-bullet', './assets/enemy-bullet.png')
        this.load.image('alien', './assets/enemySprites/alien.png')
        this.load.image('enemyThree', './assets/enemySprites/enemy-level-3.png')
        this.load.audio('playerShot', 'assets/sounds/pew.wav')
        this.load.audio('click', 'assets/sounds/click.wav')
        this.load.audio('menu-music', 'assets/sounds/menu-music.mp3')
    }

    create() {
        this.scene.start('MenuScene')
    }

}

export default PreloadScene;