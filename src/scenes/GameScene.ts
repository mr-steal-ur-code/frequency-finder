import { CST } from "../CST"

export default class GameScene extends Phaser.Scene {
  randomHeight: number;
  targetSpacing: number;
  randomSpacing: number;
  constructor() {
    super({
      key: CST.SCENES.GAME
    })
    this.randomHeight = 150;
    this.targetSpacing = Math.floor(Math.random() * 61) - 30;
    this.randomSpacing = 0;

    console.log("tar space:", this.targetSpacing);

  }
  preload() {
    this.load.image("game_background", "./assets/images/gameBackground.png");
    this.load.image("cross", "assets/ui/cross.png");
    this.load.image("right", "assets/ui/right.png");
    this.load.image("left", "assets/ui/left.png");
    this.load.image("up", "assets/ui/up.png");
    this.load.image("down", "assets/ui/down.png");

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
    let heightAdjustment = 0;
    let spaceAdjustment = 0;
    console.log("random:", this.randomSpacing);

    const adjustmentSpeed = .5;
    const adjustLine = () => {
      // Adjust the height based on the accumulated value
      if (this.randomHeight < 350) {
        this.randomHeight += heightAdjustment;
      } else {
        this.randomHeight -= 1;
      }
      if (this.randomHeight >= 0) {
        this.randomHeight += heightAdjustment;
      } else {
        this.randomHeight += 1;
      }
      if (this.randomSpacing <= 200) {
        this.randomSpacing += spaceAdjustment;
      } else { this.randomSpacing -= 1 }
      if (this.randomSpacing >= -200) {
        this.randomSpacing += spaceAdjustment;
      } else { this.randomSpacing = -200 }
    };

    const keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    const keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    const keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    const keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    let wKeypressed = false;
    let sKeypressed = false;
    let aKeypressed = false;
    let dKeypressed = false;

    keyW.on('down', () => {
      wKeypressed = true;
      heightAdjustment = -adjustmentSpeed;
    });
    keyW.on('up', () => {
      wKeypressed = false;
      if (!wKeypressed && !sKeypressed) {
        heightAdjustment = 0;
      }
    });
    keyS.on('down', () => {
      sKeypressed = true;
      heightAdjustment = adjustmentSpeed;
    });
    keyS.on('up', () => {
      sKeypressed = false;
      if (!wKeypressed && !sKeypressed) {
        heightAdjustment = 0;
      }
    });
    keyA.on('down', function () {
      aKeypressed = true;
      spaceAdjustment = -adjustmentSpeed;
    });
    keyA.on('up', function () {
      aKeypressed = false;
      if (!aKeypressed && !dKeypressed) {
        spaceAdjustment = 0;
      }
    });
    keyD.on('down', function () {
      dKeypressed = true;
      spaceAdjustment = adjustmentSpeed;
    });
    keyD.on('up', function () {
      dKeypressed = false;
      if (!aKeypressed && !dKeypressed) {
        spaceAdjustment = 0;
      }
    });

    this.update = () => {
      adjustLine();
      // Update the line position based on the new height
      graphics.clear(); // Clear previous line
      graphics.lineStyle(4, 0xFF6666);
      graphics.beginPath();
      graphics.moveTo(0, 350);
      graphics.lineTo(add(100, false), this.randomHeight);
      graphics.lineTo(add(200, false), 350);
      graphics.lineTo(add(300, false), this.randomHeight);
      graphics.lineTo(add(400, false), 350);
      graphics.lineTo(add(500, false), this.randomHeight);
      graphics.lineTo(add(600, false), 350);
      graphics.lineTo(add(700, false), this.randomHeight);
      graphics.lineTo(800, 350);
      graphics.strokePath();
    };

    let targetHeight;

    do {
      targetHeight = Math.floor(Math.random() * (300 - 100 + 1)) + 100;
      this.randomHeight = Math.floor(Math.random() * (300 - 100 + 1)) + 100;
    } while (Math.abs(targetHeight - this.randomHeight) <= 50);

    do {
      this.randomSpacing = Math.floor(Math.random() * 201) - 100;
      console.log("difference:", Math.abs(this.randomSpacing - this.targetSpacing));
    } while (Math.abs(this.randomSpacing - this.targetSpacing) < 40);

    const add = (num: number, target: boolean) => {
      if (!target) {
        console.log("random:", this.randomSpacing);
        return num + this.randomSpacing;
      } else {
        return num + this.targetSpacing;
      }
    }

    const imageGroup = this.add.group();
    this.add.image(0, 0, "game_background").setOrigin(0);
    const leftImg = this.add.image(400, 455, "left");
    const rightImg = this.add.image(450, 455, "right");
    const upImg = this.add.image(425, 420, "up");
    const downImg = this.add.image(425, 490, "down");
    imageGroup.addMultiple([leftImg, rightImg, upImg, downImg]);
    imageGroup.children.iterate(function (child: any) {
      child.setScale(0.5);
    });
    const cross = this.add.image(0, 0, "cross").setOrigin(0);
    cross.setScale(.5);
    cross.setInteractive();
    cross.on("pointerdown", () => {
      this.scene.start(CST.SCENES.TITLE)
    })
    // The winning line height
    const targetGraphic = this.add.graphics();
    targetGraphic.lineStyle(4, 0xFF0000);
    targetGraphic.beginPath();
    targetGraphic.moveTo(0, 350);
    targetGraphic.lineTo(add(100, true), targetHeight);
    targetGraphic.lineTo(add(200, true), 350);
    targetGraphic.lineTo(add(300, true), targetHeight);
    targetGraphic.lineTo(add(400, true), 350);
    targetGraphic.lineTo(add(500, true), targetHeight);
    targetGraphic.lineTo(add(600, true), 350);
    targetGraphic.lineTo(add(700, true), targetHeight);
    targetGraphic.lineTo(800, 350);
    targetGraphic.strokePath();
    // The random line height
    const graphics = this.add.graphics();
    graphics.lineStyle(4, 0xFF6666);
    graphics.beginPath();
    graphics.moveTo(0, 350);
    graphics.lineTo(add(100, false), this.randomHeight);
    graphics.lineTo(add(200, false), 350);
    graphics.lineTo(add(300, false), this.randomHeight);
    graphics.lineTo(add(400, false), 350);
    graphics.lineTo(add(500, false), this.randomHeight);
    graphics.lineTo(add(600, false), 350);
    graphics.lineTo(add(700, false), this.randomHeight);
    graphics.lineTo(800, 350);
    graphics.strokePath();
  }
}