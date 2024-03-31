import Phaser from 'phaser'
import "../style.css";

import TitleScene from './scenes/TitleScene'
import LoadScene from './scenes/LoadScene'
import GameScene from './scenes/GameScene'
import HowToPlay from './scenes/HowToPlay';
import EndGame from './scenes/EndGame';

const sizes = {
  width: 800,
  height: 600
}
const speedDown = 300

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'app',
  width: sizes.width,
  height: sizes.height,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: speedDown },
      debug: true
    },

  },
  scene: [
    LoadScene, TitleScene, HowToPlay,
    EndGame,
    GameScene],
}

export default new Phaser.Game(config)
