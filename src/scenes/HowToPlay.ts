import { CST } from "../CST"

export default class HowToPlay extends Phaser.Scene {
  constructor() {
    super({
      key: CST.SCENES.HOWTOPLAY
    })
  }
  preload() {
    this.load.image('howtoplay', 'assets/images/howtoplay.png');
    this.load.image('back', 'assets/ui/back.png');
  }
  create() {
    this.add.image(400, 300, 'howtoplay');
    const back = this.add.image(5, 5, "back").setScale(.3).setOrigin(0);
    back.setDepth(2);
    back.setInteractive();
    back.on("pointerover", () => {
      back.setScale(.32)
    });
    back.on("pointerout", () => {
      back.setScale(.3)
    })
    back.on("pointerdown", () => {
      this.scene.start(CST.SCENES.TITLE)
    })
  }
}