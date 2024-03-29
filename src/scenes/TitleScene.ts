import Phaser from 'phaser'
import { CST } from '../CST';

export default class TitleScene extends Phaser.Scene {
  constructor() {
    super({
      key: CST.SCENES.TITLE
    })
  }
  preload() {
    this.load.image('background', 'assets/images/titleBackground.jpg');
    this.load.image('start', 'assets/ui/StartButton.png');
    // this.load.image('exit', 'assets/ui/ExitButton.png');
    this.load.image("check", "assets/ui/check.png");
    this.load.image("cross", "assets/ui/cross.png");
    this.load.audio("title_music", "./assets/music/title_music.mp3")

    //loading bar
    const loadingBar = this.add.graphics({
      fillStyle: {
        color: 0xffffff
      }
    })

    //simulate load

    for (let i = 0; i < 1000; i++) {
      this.load.text(`${i}`);
    }

    this.load.on("progress", (percent: any) => {
      loadingBar.fillRect(0, this.game.renderer.height / 2, this.game.renderer.width * percent, 40);
      console.log(percent);
    })
  }

  create() {
    this.add.image(400, 300, 'background')
    const startButton = this.add.image(400, 350, 'start')
    // const exitButton = this.add.image(400, 475, 'exit')
    const check = this.add.image(280, 350, "check");
    check.setScale(.5)
    check.setVisible(false);
    // const cross = this.add.image(280, 470, "cross");
    // cross.setScale(.5)
    // cross.setVisible(false);

    // this.sound.play("title_music", {
    //   loop: true
    // })
    // this.sound.pauseOnBlur = false;


    startButton.setInteractive();
    startButton.on("pointerover", () => {
      console.log("in");
      check.setVisible(true);
    })
    startButton.on("pointerout", () => {
      check.setVisible(false);
    })
    startButton.on("pointerdown", () => {
      this.scene.start(CST.SCENES.GAME)
    });
    // exitButton.setInteractive();
    // exitButton.on("pointerover", () => {
    //   console.log("in");
    //   cross.setVisible(true);
    // })
    // exitButton.on("pointerout", () => {
    //   console.log("out");
    //   cross.setVisible(false);
    // })
  }
}
