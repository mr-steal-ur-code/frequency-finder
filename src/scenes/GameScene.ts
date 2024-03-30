import { CST } from "../CST"
import CountdownController from "./CountdownController";

export default class GameScene extends Phaser.Scene {
  randomHeight: number;
  randomWidth: number;
  targetHeight: number;
  targetWidth: number;
  targetSpacing: number;
  randomSpacing: number;
  score: number;
  countDown: CountdownController | undefined;
  hasScored: boolean;
  constructor() {
    super({
      key: CST.SCENES.GAME
    })
    this.randomHeight = 150;
    this.randomWidth = 1;
    this.targetSpacing = 0;
    this.randomSpacing = 0;
    this.targetHeight = 0;
    this.targetWidth = 0;
    this.score = 0;
    this.hasScored = false;
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
    const loadingText = this.add.text(
      (this.game.renderer.width / 2),
      (this.game.renderer.height / 2 - 50),
      'Loading...',
      { fontFamily: 'Arial', fontSize: '24px', color: "#d6d6d6" }
    );
    loadingText.setOrigin(0.5);

    //simulate load
    // for (let i = 0; i < 1500; i++) {
    //   this.load.text(`${i}`);
    // }

    this.load.on("progress", (percent: any) => {
      loadingBar.fillRect(0, this.game.renderer.height / 2, this.game.renderer.width * percent, 40);
      console.log(percent);
    })

  }
  create() {
    const generateHeights = () => {
      this.randomHeight = 0;
      this.targetHeight = 0;
      do {
        this.targetHeight = Math.round(Math.random() * (300 - 100 + 1)) + 100;
        this.randomHeight = Math.round(Math.random() * (300 - 100 + 1)) + 100;
      } while (Math.abs(this.targetHeight - this.randomHeight) <= 50);
    }

    const generateWidth = () => {
      this.randomWidth = 0;
      this.targetWidth = 0;
      do {
        this.targetWidth = Math.round(Math.random() * (20 - 1 + 1)) + 1;
        this.randomWidth = Math.round(Math.random() * (20 - 1 + 1)) + 1;
      } while (Math.abs(this.targetWidth - this.randomWidth) <= 5);
    }

    const generateSpacing = () => {
      this.randomSpacing = 0;
      this.targetSpacing = 0;
      do {
        this.targetSpacing = Math.round(Math.random() * 61) - 30;
        this.randomSpacing = Math.round(Math.random() * 301) - 150;
      } while (Math.abs(this.randomSpacing - this.targetSpacing) < 40);
    }
    generateHeights();
    generateWidth();
    generateSpacing();
    const { width } = this.scale;
    let heightAdjustment = 0;
    let spaceAdjustment = 0;

    const adjustmentSpeed = .3;
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
    const keyQ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
    const keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    let wKeypressed = false;
    let sKeypressed = false;
    let aKeypressed = false;
    let dKeypressed = false;

    keyQ.on('down', () => {
      if (this.randomWidth > 1) {
        this.randomWidth -= 1;
      } else return
    });
    keyE.on('down', () => {
      if (this.randomWidth <= 21) {
        this.randomWidth += 1;
      } else return
    });

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
    const scoreText = this.add.text(5, 5, `SCORE: ${this.score}`, { fontFamily: '"Roboto Condensed"', fontSize: '32px' })
    scoreText.setDepth(2);
    const timeText = this.add.text(width * 0.5, 25, `${this.countDown?.duration}`, { fontFamily: '"Roboto Condensed"', fontSize: '30px' }).setOrigin(0.5);
    timeText.setDepth(2);

    this.update = () => {
      adjustLine();
      // Update the line position based on the new variables
      targetGraphic.clear();
      if (this.hasScored) {
        targetGraphic.lineStyle(this.targetWidth, 0x00FF00);
      } else
        targetGraphic.lineStyle(this.targetWidth, 0xFF0000);
      targetGraphic.beginPath();
      targetGraphic.moveTo(0, 350);
      targetGraphic.lineTo(add(100, true), this.targetHeight);
      targetGraphic.lineTo(add(200, true), 350);
      targetGraphic.lineTo(add(300, true), this.targetHeight);
      targetGraphic.lineTo(add(400, true), 350);
      targetGraphic.lineTo(add(500, true), this.targetHeight);
      targetGraphic.lineTo(add(600, true), 350);
      targetGraphic.lineTo(add(700, true), this.targetHeight);
      targetGraphic.lineTo(800, 350);
      targetGraphic.strokePath();

      graphics.clear(); // Clear previous line
      if (this.hasScored) {
        graphics.lineStyle(this.randomWidth, 0x00FF00);
      } else {
        graphics.lineStyle(this.randomWidth, 0xFF6666);
      }
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

      const tolerance = 5; // Adjust tolerance as needed
      if (
        Math.abs(Math.round(this.randomHeight) - this.targetHeight) <= tolerance &&
        Math.abs(Math.round(this.randomSpacing) - this.targetSpacing) <= tolerance &&
        Math.abs(Math.round(this.randomWidth) - this.targetWidth) <= 1 &&
        !this.hasScored
      ) {
        this.hasScored = true;
        this.score += 100;
        console.log("score:", this.score);
        scoreText.setText(`SCORE: ${this.score}`);
      }
      if (this.hasScored) {
        this.countDown?.stop();
        setTimeout(() => {
          generateHeights();
          generateWidth();
          generateSpacing();
          this.hasScored = false;
          this.countDown?.start(this.handleCountdownFinish.bind(this), 15000);
        }, 500);
      } else { graphics.lineStyle(this.randomWidth, 0xFF6666); }
      this.countDown?.update();
    };

    const add = (num: number, target: boolean) => {
      if (!target) {
        return Math.floor(num + this.randomSpacing);
      } else {
        return Math.floor(num + this.targetSpacing);
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
    const cross = this.add.image(775, 30, "cross");
    cross.setScale(.5);
    cross.setInteractive();
    cross.on("pointerdown", () => {
      this.scene.start(CST.SCENES.TITLE)
    })
    // The winning line
    const targetGraphic = this.add.graphics();
    targetGraphic.lineStyle(this.targetWidth, 0xFF0000);
    targetGraphic.beginPath();
    targetGraphic.moveTo(0, 350);
    targetGraphic.lineTo(add(100, true), this.targetHeight);
    targetGraphic.lineTo(add(200, true), 350);
    targetGraphic.lineTo(add(300, true), this.targetHeight);
    targetGraphic.lineTo(add(400, true), 350);
    targetGraphic.lineTo(add(500, true), this.targetHeight);
    targetGraphic.lineTo(add(600, true), 350);
    targetGraphic.lineTo(add(700, true), this.targetHeight);
    targetGraphic.lineTo(800, 350);
    targetGraphic.strokePath();
    // The random line
    const graphics = this.add.graphics();
    graphics.lineStyle(this.randomWidth, 0xFF6666);
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

    this.countDown = new CountdownController(this, timeText);
    this.countDown.start(this.handleCountdownFinish.bind(this), 15000);

  }
  handleCountdownFinish = () => {
    console.log("finished");
  }

  gameOver() {
    console.log("game over")
  }
}