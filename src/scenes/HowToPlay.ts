import { CST } from "../CST"

export default class HowToPlay extends Phaser.Scene {
  constructor() {
    super({
      key: CST.SCENES.HOWTOPLAY
    })
  }
  preload() {
    this.load.image('howtoplay', 'assets/images/howtoplay.png');
    this.load.image('exit', 'assets/ui/ExitButton.png');
  }
  create() {
    this.add.image(400, 300, 'howtoplay');
    const back = this.add.text(5, 5, "< BACK", { fontFamily: '"Roboto Condensed"', fontSize: '26px', color: "#111" });
    back.setDepth(2);
    back.setInteractive();
    back.on("pointerover", () => {
      back.setScale(1.1)
    });
    back.on("pointerout", () => {
      back.setScale(1)
    })
    back.on("pointerdown", () => {
      this.scene.start(CST.SCENES.TITLE)
    })
  }
}