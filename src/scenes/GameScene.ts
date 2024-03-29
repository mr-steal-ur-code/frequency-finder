import { CST } from "../CST"

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({
      key: CST.SCENES.GAME
    })
  }
  preload() {
    this.load.image("game_background", "./assets/images/gameBackground.png");
    this.load.image("cross", "assets/ui/cross.png");

    //loading bar
    const loadingBar = this.add.graphics({
      fillStyle: {
        color: 0xffffff
      }
    })

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
    this.add.image(0, 0, "game_background").setOrigin(0);
    const cross = this.add.image(0, 0, "cross").setOrigin(0);
    cross.setScale(.5);
    cross.setInteractive();
    cross.on("pointerdown", () => {
      this.scene.start(CST.SCENES.TITLE)
    })
  }
  update() {
    null
  }
}