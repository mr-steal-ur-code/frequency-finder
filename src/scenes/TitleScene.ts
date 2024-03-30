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
    this.load.image('how_to_play', 'assets/ui/instructions.png');
    this.load.audio("title_music", "./assets/music/title_music.mp3");
    this.load.audio("menu_hover", "./assets/sfx/menu_hover.mp3");
    this.load.image("frequencyfinder", "./assets/images/frequencyfinder.png")

    //loading bar
    const loadingBar = this.add.graphics({
      fillStyle: {
        color: 0xffffff
      }
    })
    const loadingText = this.add.text(
      (this.game.renderer.width / 2),
      (this.game.renderer.height / 2 - 50),
      'Loading...',
      { fontFamily: 'Arial', fontSize: '24px', color: "#d6d6d6" }
    );
    loadingText.setOrigin(0.5);
    //simulate load
    // for (let i = 0; i < 2500; i++) {
    //   this.load.text(`${i}`);
    // }

    this.load.on("progress", (percent: any) => {
      loadingBar.fillRect(0, this.game.renderer.height / 2, this.game.renderer.width * percent, 40);
      console.log(percent);
    })
  }

  create() {
    this.add.image(400, 300, 'background');
    this.sound.play("title_music", {
      loop: true
    })
    this.sound.pauseOnBlur = false;
    this.add.image(400, 150, 'frequencyfinder');

    const howToPlayButton = this.add.image(400, 360, "how_to_play");
    howToPlayButton.setScale(.25);
    howToPlayButton.setInteractive();
    howToPlayButton.on("pointerover", () => {
      this.sound.play("menu_hover", {
        volume: 0.4
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
      console.log("in");
      this.sound.play("menu_hover", {
        volume: 0.4
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
