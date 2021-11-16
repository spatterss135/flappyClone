import BaseScene from './BaseScene'
import BasicJet from '../enemyClasses/BasicJet'

let serializedBestScore = localStorage.getItem('high-score')
class PlayScene extends BaseScene {
    constructor(config) {
        super('PlayScene', config);
        this.bird = null;
        this.pipes = null;
        this.cursors = null;
        this.enemies = null;
        this.bullets = null;
        this.enemyBullets = null;
        this.isPaused = false;
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
        this.addEnemy();
        
        this.addScore()
        this.addPauseButton()
        this.listenToEvents()
        this.createCursorKeys();
        this.addShootingAbility();
    
    }    

    update(time, delta) {
        // this.recyclePipe()
        this.checkGameStatus()
        this.addFlightMechanic()
        this.addColliders()
        this.beginEnemyAttack(time, delta)
        
    }



    addEnemy() {
        this.enemies = this.physics.add.group()
        this.enemyBullets = this.physics.add.group()
        let enemy = this.enemies.create(this.config.width *0.8, this.config.height* 0.5, 'enemyOne')
        .setScale(0.1)
        .setImmovable(true)
        enemy.angle -= 90
        enemy.stats = new BasicJet(300, 3, 40)
        this.beginFlightPath(enemy)

        let enemy2 = this.enemies.create(this.config.width *0.8, this.config.height* 0.3, 'enemyOne')
        .setScale(0.1)
        .setImmovable(true)
        enemy2.angle -= 90
        enemy2.stats = new BasicJet(300, 6, 40)
        enemy2.stats.getSpeed()

        
    }

    beginFlightPath(enemy){
        if (enemy.y > this.config.height*0.5) {
            enemy.setVelocityY(-100)
        }
        else {
            enemy.setVelocityY(100)
        }
    }

    enemyFire(enemy) {
        let enemyShot = this.enemyBullets.create(enemy.x, enemy.y, 'enemy-bullet')
        enemyShot.setVelocityX(-300)
        enemyShot.setSize(20,20, true)
    }

    beginEnemyAttack(time, delta) {
        if (this.enemies.children.entries.length > 0) {
            this.enemies.children.entries.forEach((enemy) => {
                enemy.stats.timer += delta
                if (enemy.stats.timer > enemy.stats.firerate*1000) {
                    this.enemyFire(enemy)
                    enemy.stats.timer = 0
                }
                })
        }
    }
 
    addShootingAbility() {
        this.playerBullets = this.physics.add.group()
        this.input.on('pointerdown', this.shoot, this)
        this.input.keyboard.on('keydown_SPACE', this.shoot, this)
    }

    createCursorKeys() {
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    listenToEvents() {
        this.events.on('resume', () => {
          this.physics.resume()
          this.isPaused = false;
        })
    }

    addBird(){
        this.bird = this.physics.add.sprite(this.config.startingPosition.x, this.config.startingPosition.y, 'bird');
        this.bird.body.gravity.y = 0
        this.bird.health = 50
    }
    addFlightMechanic() {
        // this.input.on('pointerdown', this.flap, this)
        // this.input.keyboard.on('keydown_SPACE', this.flap, this)
        if (!this.bird.body) return

        if (this.cursors.left.isDown)
        {
            this.bird.setVelocityX(-100);
        }
         if (this.cursors.right.isDown)
        {
            this.bird.setVelocityX(100);
        }
         if (this.cursors.up.isDown)
        {
            this.bird.setVelocityY(-100);
        }
         if (this.cursors.down.isDown)
        {
            this.bird.setVelocityY(100);
        }
        if (!this.cursors.left.isDown && !this.cursors.right.isDown && !this.cursors.up.isDown && !this.cursors.down.isDown) {
            this.bird.setVelocityX(0);
            this.bird.setVelocityY(0);
        }
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
        if (this.bird.body){
            if (this.bird.body.position.y + this.bird.height >= this.config.height || this.bird.body.position.y <= 0) {
                this.gameOver()
            }
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
        // this.physics.add.collider(this.bird, this.pipes, this.gameOver, null, this)
        // this.bird.setCollideWorldBounds(true)
        this.physics.add.collider(this.playerBullets, this.enemies, this.enemyHit, null, this)
        this.physics.add.collider(this.enemyBullets, this.bird, this.playerHit, null, this)
    }

    enemyHit(event, event2) {
        event.destroy()
        event2.stats.health -=100
        if ( event2.stats.health <= 0){
            event2.destroy()
        }
    }

    playerHit(event, event2) {
        event2.destroy()
        event.health -=100
        if (event.health <= 0){
            event.destroy()
        }
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
    if (!this.isPaused){
        this.bird.body.velocity.y = -350
    }
    }
    shoot() {
        if(!this.isPaused){
            let bullet = this.playerBullets.create(this.bird.x, this.bird.y, 'bullet')
            .setScale(0.1)
            bullet.setVelocityX(700)
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
            this.isPaused = true;
        })
    }


}




export default PlayScene;

