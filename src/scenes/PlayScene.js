import BaseScene from './BaseScene'

let serializedBestScore = localStorage.getItem('high-score')
class PlayScene extends BaseScene {
    constructor(config) {
        super('PlayScene', config);
        this.bird = null;
        this.pipes = null;
        this.isPaused = true;
        if (!serializedBestScore) {
            this.bestScore = 0
        }
        else {
            this.bestScore = JSON.parse(serializedBestScore)
        }
    }

    create() {
        super.create()
        this.addBird()
        this.addFlapMechanic()
        this.addPipes()
        this.addColliders()
        this.addScore()
        this.addPauseButton()
        this.listenToEvents()
    
    }    

    update() {
        this.recyclePipe()
        this.checkGameStatus()
        
    }

    listenToEvents() {
        this.events.on('resume', () => {
          this.physics.resume()
          this.isPaused = true;
        })
    }

    addBird(){
        this.bird = this.physics.add.sprite(this.config.startingPosition.x, this.config.startingPosition.y, 'bird');
        this.bird.body.gravity.y = 600
    }
    addFlapMechanic() {
        this.input.on('pointerdown', this.flap, this)
        this.input.keyboard.on('keydown_SPACE', this.flap, this)
    }

    addPipes() {
    this.pipes = this.physics.add.group()
        for (let i=0;i<4;i++) {
          let upperPipe = this.pipes.create(0,0,'pipe')
          .setImmovable(true)
          .setOrigin(0,1)
          let lowerPipe = this.pipes.create(0,0,'pipe')
          .setImmovable(true)
          .setOrigin(0,0)
          this.positionPipe(upperPipe, lowerPipe)
        }
        this.pipes.setVelocityX(-300)
    }

    checkGameStatus() {
        if (this.bird.body.position.y + this.bird.height >= this.config.height || this.bird.body.position.y <= 0) {
            this.gameOver()
        }
    }
    gameOver() {
        // this.bird.body.y = this.config.startingPosition.y
        // this.bird.body.x = this.config.startingPosition.x
        // this.bird.body.velocity.y = 0
        this.physics.pause()
        this.bird.setTint(0xff0000)
        
        
        this.time.addEvent({
            delay: 1000, 
            callback: () => this.scene.restart(),
            loop: false

        })

    }

    addColliders() {
        this.physics.add.collider(this.bird, this.pipes, this.gameOver, null, this)
        this.bird.setCollideWorldBounds(true)
    }

    positionPipe(pipe1, pipe2){
        let pipeHorizontalDistanceRange = [350, 450]
        let pipeVerticalDistanceRange = [50, 450]
        let pipeGapRange = [100, 200]
        let pipeHorizontalDistance = this.getRightMostPipe();
        pipe1.x = pipeHorizontalDistance + Phaser.Math.Between(...pipeHorizontalDistanceRange)
        pipe1.y = Phaser.Math.Between(...pipeVerticalDistanceRange)
      
        pipe2.x = pipe1.x
        pipe2.y = pipe1.y + Phaser.Math.Between(...pipeGapRange)
      
        pipeHorizontalDistance = pipe1.x
      
    }
    
    recyclePipe() {
      let tempPipes = []
      this.pipes.getChildren().forEach((child, i) => {
        if (child.getBounds().right <= 0) {
          tempPipes.push(child)
          if (tempPipes.length === 2){
            this.positionPipe(...tempPipes)
            this.updateScore()
            this.saveBestScore()
            

            tempPipes = []
          }
        }
      })
    }
    
    getRightMostPipe() {
      let rightMostX = 0;
      if (!this.pipes) return 0;
      this.pipes.getChildren().forEach(child => {
        rightMostX = Math.max(child.x, rightMostX)
      })
    
      return rightMostX;
    }
    
    flap() {
    if (this.isPaused){
        this.bird.body.velocity.y = -350
    }
     
    }

    addScore(){
        this.score=0
        this.scoreText = this.add.text(16, 16, `${this.score}`, {fontSize: '32px', fill: '#000'}).setInteractive()
        this.bestScoreText = this.add.text(750, 16, `${this.bestScore}`, {fontSize: '32px', fill: '#000'})

        this.scoreText.on('pointerdown', () => console.log('hello'))
    }
    updateScore() {
        this.score++
        if (this.score >= this.bestScore){
            this.bestScore = this.score
            this.bestScoreText.setText(this.bestScore)
        }
        this.scoreText.setText(this.score)
    }
    saveBestScore() {
        localStorage.setItem('high-score', JSON.stringify(this.bestScore))
    }

    addPauseButton() {
        const pauseButton = this.add.image(this.config.width-10, this.config.height-10, 'pause')
        .setOrigin(1,1)
        .setScale(3)
        .setInteractive()
        

        pauseButton.on('pointerdown', () => {
            this.physics.pause()
            this.scene.pause()
            this.scene.launch('PauseScene')
            this.isPaused = false;
        })
    }


}




export default PlayScene;

