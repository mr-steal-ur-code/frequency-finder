import Phaser from 'phaser'
import { CST } from '../CST';

export default class TitleScene extends Phaser.Scene {
  constructor() {
    super({
      key: CST.SCENES.TITLE
    })
  }
  preload() {
    this.load.image('background', 'assets/images/background.png');
    this.load.image('start', 'assets/ui/StartButton.png');
    this.load.image('how_to_play', 'assets/ui/instructions.png');
    this.load.audio("main_menu_theme", "./assets/music/main_menu_theme.mp3");
    this.load.audio("menu_hover", "./assets/sfx/menu_hover.mp3");
    this.load.image("logo", "./assets/logos/logo.png")

    //loading bar
    const loadingBar = this.add.graphics({
      fillStyle: {
        color: 0xffffff
      }
    })
    this.add.text(
      (this.game.renderer.width / 2),
      (this.game.renderer.height / 2 - 50),
      'Loading...',
      { fontFamily: 'Arial', fontSize: '24px', color: "#d6d6d6" }
    ).setOrigin(0.5);
    //simulate load
    // for (let i = 0; i < 2500; i++) {
    //   this.load.text(`${i}`);
    // }

    this.load.on("progress", (percent: any) => {
      loadingBar.fillRect(0, this.game.renderer.height / 2, this.game.renderer.width * percent, 40);
      console.log("title percent:", percent);
    })
  }

  create(data: any) {
    this.add.image(400, 300, 'background');
    if (data["restartMenuMusic"] === true || data["restartMenuMusic"] === undefined) {
      this.sound.stopAll();
      this.sound.play("main_menu_theme", {
        loop: true,
        volume: .2
      })
      this.sound.pauseOnBlur = false;
    }
    this.add.image(400, 170, 'logo');

    const howToPlayButton = this.add.image(400, 360, "how_to_play");
    howToPlayButton.setScale(.25);
    howToPlayButton.setInteractive();
    howToPlayButton.on("pointerover", () => {
      this.sound.play("menu_hover", {
        volume: 0.1
      });
      howToPlayButton.setScale(.3);
    });
    howToPlayButton.on("pointerout", () => {
      howToPlayButton.setScale(.25);
    });
    howToPlayButton.on("pointerdown", () => {
      this.scene.start(CST.SCENES.HOWTOPLAY)
    });
    const startButton = this.add.image(400, 450, 'start');
    startButton.setInteractive();
    startButton.on("pointerover", () => {
      this.sound.play("menu_hover", {
        volume: 0.1
      });
      startButton.setScale(1.05);
    })
    startButton.on("pointerout", () => {
      startButton.setScale(1);
    })
    startButton.on("pointerdown", () => {
      this.scene.start(CST.SCENES.GAME)
    });
  }
}
