
import Phaser from "phaser";
import PlayScene from "./scenes/PlayScene";
import MenuScene from "./scenes/MenuScene";
import PreloadScene from "./scenes/PreloadScene";
import ScoreScene from './scenes/ScoreScene'
import PauseScene from './scenes/PauseScene'
const WIDTH = 800
const HEIGHT = 600
const BIRD_POSITION = {x: WIDTH/10, y: HEIGHT/2}


const SHARED_CONFIG = {
  width: WIDTH,
  height: HEIGHT,
  startingPosition: BIRD_POSITION
}
  
const Scenes = [PreloadScene, MenuScene,  ScoreScene, PlayScene, PauseScene]
function createScene(scene){
  return new scene(SHARED_CONFIG)
}
// const createScene = Scene => new Scene(SHARED_CONFIG)
const initScene = Scenes.map(createScene)

const config = {
  type: Phaser.AUTO,
  ...SHARED_CONFIG,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 }
    }
  },
  scene: initScene
};

new Phaser.Game(config);

