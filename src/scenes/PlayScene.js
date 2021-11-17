import BaseScene from './BaseScene'
import BasicJet from '../enemyClasses/BasicJet'
import HomingBug from '../enemyClasses/homingBug'
import SpaceCruiser from '../enemyClasses/spaceCruiser';

let serializedBestScore = localStorage.getItem('high-score')
class PlayScene extends BaseScene {
    constructor(config) {
        super('PlayScene', config);
        this.bird = null;
        this.pipes = null;
        this.cursors = null;
        this.enemies = null;
        this.playerBullets = null;
        this.enemyBullets = null;
        this.isPaused = false;
        if (!serializedBestScore) {
            this.bestScore = 0
        }
        else {
            this.bestScore = JSON.parse(serializedBestScore)
        }
        this.waveNumber = 1
        this.waves = {
            1: {troops: [ new BasicJet(),  new SpaceCruiser(300, 3, 40),  new HomingBug(300, 3, 40)],
            size: 3,
            shape: 'triangle',
            coordinates: []},
            2: {troops: [ new BasicJet(),  new BasicJet(),  new BasicJet(), new BasicJet(),  new BasicJet(), new BasicJet()],
            size: 6,
            shape: 'triangle',
            coordinates: []},
            3: {troops: [ new BasicJet(),  new BasicJet(),  new BasicJet(), new BasicJet(),  new BasicJet(), new BasicJet(), new BasicJet(), new BasicJet(), new BasicJet(), new BasicJet()],
                size: 10,
                shape: 'triangle',
                coordinates: [] }
         }
    }

    create() {
        super.create()
        this.addBird()
        for (const [key, value] of Object.entries(this.waves))  {
            this.createFlightFormations(key,value.size, value.shape)
        }
        this.initiateWaves()
        this.addScore()
        this.addPauseButton()
        this.listenToEvents()
        this.createCursorKeys();
        this.addShootingAbility();
    
    }    

    update(time, delta) {
        this.recycleBullets()
        this.checkGameStatus()
        this.addFlightMechanic()
        this.addColliders()
        this.beginEnemyAttack(time, delta)
        this.updateFlightPath(time, delta)
        this.updateBulletPath()
        this.lookforNewWave()
        this.saveBestScore()
        
    }
    createFlightFormations(wave, size, shape){
        if (shape === 'triangle') {
            this.formTriangle(wave, size)
        }
        else if (shape === 'circle') {
            this.formRectangle(wave, size)
        }

        
    }

    formTriangle(wave, size) {
        let widthCoordinate = this.config.width * 0.5
        let heightCoordinate = this.config.height * 0.5
        let widthIncrementor = this.config.width * 0
        let heightIncrementor = this.config.width * 0
        let amountInRow = 1
        let totalAddedSoFar = 0
        let enemyThreeSpacer = 0
        for (let i=0;i<size;i++) {
            this.waves[wave].coordinates.push([widthCoordinate + widthIncrementor, heightCoordinate + heightIncrementor])
            totalAddedSoFar++
            if (totalAddedSoFar === amountInRow){
                widthIncrementor += this.config.width * 0.1
                heightIncrementor = this.config.height * (-0.05 * amountInRow)
                totalAddedSoFar = 0
                amountInRow++
                
            }
            else {
                heightIncrementor += this.config.height * 0.1
            }

        }
        
    }

    // formRectangle(wave, size) {
    //     let widthCoordinate = this.config.width * 0.5
    //     let heightCoordinate = this.config.height * 0.5
    //     let widthIncrementor = this.config.width * 0
    //     let heightIncrementor = this.config.width * 0
    //     let amountInColumn = 2
    //     let totalAddedSoFar = 0
    //     for (let i=0;i<size;i++) {
    //         this.waves[wave].coordinates.push([widthCoordinate + widthIncrementor, heightCoordinate + heightIncrementor])
    //         totalAddedSoFar++
    //         if (totalAddedSoFar === amountInRow){
    //             widthIncrementor += this.config.width * 0.1
    //             heightIncrementor = this.config.height * (-0.05 * amountInRow)
    //             totalAddedSoFar = 0
    //             amountInRow++
                
    //         }
    //         else {
    //             heightIncrementor += this.config.height * 0.1
    //         }

    //     }
        
    // }
        



    initiateWaves(){
        this.enemies = this.physics.add.group()
        this.enemyBullets = this.physics.add.group()
        this.addEnemy(this.waveNumber)
        
    }

    lookforNewWave() {
        if (this.enemies.getChildren().length === 0) {
            if (this.waveNumber <= 3) {
                this.addEnemy(this.waveNumber)
            }
            else {
                this.gameOver()
            }
            
        }
    }


    addEnemy(waveNumber) {
        console.log(this.waves[waveNumber].coordinates)
        
        for (let i=0;i<this.waves[waveNumber].size;i++){
                 let enemy = this.enemies.create(this.waves[waveNumber].coordinates[i][0], this.waves[waveNumber].coordinates[i][1], this.waves[waveNumber].troops[i].image)
                .setScale(0.1)
                .setImmovable(true)
                enemy.angle += this.waves[waveNumber].troops[i].rotateAngle
                enemy.stats = this.waves[waveNumber].troops[i]
                if (enemy.stats.image === 'enemyThree'){
                    enemy.setPosition(this.config.width*.9, this.config.height*0.5)
                }
                this.beginFlightPath(enemy)
        }
        
        this.waveNumber++


        
    }

    beginFlightPath(enemy){
        if (enemy.stats.flightPlan === 'up-n-down'){
            if (enemy.y > this.config.height*0.5) {
                enemy.setVelocityY(-100)
            }
            else {
                enemy.setVelocityY(100)
            }
        }
        else if (enemy.stats.flightPlan === 'towards-player') {
            if (this.bird.x > enemy.x) {
                enemy.setVelocityX(50)
            }
            else if (this.bird.x < enemy.x) {
                enemy.setVelocityX(-50)
            }
            else if (this.bird.x === enemy.x) {
                enemy.setVelocityX(0)
            }

            if (this.bird.y > enemy.y) {
                enemy.setVelocityY(50)
            }
            else if (this.bird.y < enemy.y) {
                enemy.setVelocityY(-50)
            }
            else if (this.bird.y === enemy.y) {
                enemy.setVelocityY(0)
            }
        }

        else {
            return
        }
       
    }

    updateFlightPath(time, delta) {
        if (this.enemies) {
                this.enemies.children.entries.forEach(enemy => {
                    if (enemy.stats.flightPlan === 'up-n-down'){
                        if(!enemy.stats.justTurned){
                            if ((enemy.y >= this.config.height* 0.9) || (enemy.y <= this.config.height* 0.1)) {
                                enemy.body.velocity.y *= -1
                                enemy.stats.justTurned = true
                                
                            }
                        }
                        
                        else {
                            enemy.stats.turnTimer += delta
                            if (enemy.stats.turnTimer > 100) {
                                enemy.stats.justTurned = false
                                enemy.stats.turnTimer = 0
                            }
                        }
                    }
                    else if (enemy.stats.flightPlan === 'towards-player'){
                        this.beginFlightPath(enemy)
                    }
                    
                })
            
        }
    }

    enemyFire(enemy) {
        console.log(enemy.stats.bulletType)
        if (enemy.stats.bulletType === 'straight-shot') {
            let enemyShot = this.enemyBullets.create(enemy.x, enemy.y, 'enemyOne-bullet')
            .setScale(0.5)
            enemyShot.setTint(0xFF0000)
            enemyShot.setVelocityX(-300)
            enemyShot.setSize(20,20, true)
        }

        if (enemy.stats.bulletType === 'slight-home') {
            let enemyShot = this.enemyBullets.create(enemy.x, enemy.y, 'enemy-bullet')
            enemyShot.homing = true
            enemyShot.setTint(0xFF0000)
            enemyShot.setVelocityX(-300)
            this.addHomingDevice(enemyShot)
            enemyShot.setSize(20,20, true)
        }
        


    }

    addHomingDevice(enemyShot){
        if (this.bird.y > enemyShot.y) {
            enemyShot.body.velocity.y += 5
        }
        else if (this.bird.y < enemyShot.y) {
            enemyShot.body.velocity.y += -5
        }
        else if (this.bird.y === enemyShot.y) {
            enemyShot.setVelocityY(0)
        }
    }

    updateBulletPath() {
        if (!this.enemyBullets) return

        this.enemyBullets.getChildren().forEach(bullet => {
            if (bullet.homing){
                this.addHomingDevice(bullet)
            }
        })
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
        this.events.on('start', () => {
            this.physics.resume()
            this.isPaused = false;
            this.waveNumber = 1
            for (const [key, value] of Object.entries(this.waves))  {value.coordinates = []}
          })
    }

    addBird(){
        this.bird = this.physics.add.sprite(this.config.startingPosition.x, this.config.startingPosition.y, 'bird')
        this.bird.scaleX = 0.1
        this.bird.scaleY = 0.1
        this.bird.setCollideWorldBounds(true)
        this.bird.angle += 90
        this.bird.body.gravity.y = 0
        this.bird.health = 50
    }
    addFlightMechanic() {
        // this.input.on('pointerdown', this.flap, this)
        // this.input.keyboard.on('keydown_SPACE', this.flap, this)
        if (!this.bird.body) return

        if (this.cursors.left.isDown)
        {
            this.bird.setVelocityX(-250);
        }
         if (this.cursors.right.isDown)
        {
            this.bird.setVelocityX(250);
        }
         if (this.cursors.up.isDown)
        {
            this.bird.setVelocityY(-250);
        }
         if (this.cursors.down.isDown)
        {
            this.bird.setVelocityY(250);
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
                // this.gameOver()
                return
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
            callback: () => this.scene.start('GameOverScene'),
            loop: false

        })

    }

    addColliders() {
        // this.physics.add.collider(this.bird, this.pipes, this.gameOver, null, this)
        // this.bird.setCollideWorldBounds(true)
        this.physics.add.collider(this.playerBullets, this.enemies, this.enemyHit, null, this)
        this.physics.add.collider(this.enemyBullets, this.bird, this.playerHit, null, this)
        this.physics.add.collider(this.enemies, this.bird, this.playerHit, null, this)

    }

    enemyHit(event, event2) {
        event.destroy()
        event2.stats.health -=100
        if (event2.stats.health <= 0){
            event2.destroy()
            this.score += event2.stats.points
            this.updateScore()
        }
    }

    playerHit(event, event2) {
        event2.destroy()
        event.health -=100
        if (event.health <= 0){
            event.destroy()
            this.gameOver()
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
    
    recycleBullets() {
        if(!this.playerBullets) return
        this.playerBullets.getChildren().forEach(bullet => {
            if (bullet.x > this.config.width) {
                bullet.destroy()
            }
        })
        if (!this.enemyBullets) return
        this.enemyBullets.getChildren().forEach(bullet => {
            if (bullet.x > this.config.width) {
                bullet.destroy()
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
            bullet.setSize(5,5,true)
            this.sound.add('playerShot').play()
        }

        
    }
     
    

    addScore(){
        this.score=0
        this.scoreText = this.add.text(32, 32, `${this.score}`, {fontSize: '32px', fill: '#fff'}).setInteractive()
        this.bestScoreText = this.add.text(715, 32, `${this.bestScore}`, {fontSize: '32px', fill: '#fff'})

        this.scoreText.on('pointerdown', () => console.log('hello'))
    }
    updateScore() {
        if (this.score >= this.bestScore){
            this.bestScore = this.score
            this.bestScoreText.setText(this.bestScore)
        }
        this.scoreText.setText(this.score)
    }
    saveBestScore() {
        localStorage.setItem('high-score', JSON.stringify(this.bestScore))
        localStorage.setItem('last-score', JSON.stringify(this.score))
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

