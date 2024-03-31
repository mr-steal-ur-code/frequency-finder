import { CST } from "../CST"
import CountdownController from "../controllers/CountdownController";

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
  play1: boolean;
  play2: boolean;
  play3: boolean;
  playScore: boolean;
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
    this.play1 = false;
    this.play2 = false;
    this.play3 = false;
    this.playScore = false;
  }
  preload() {
    this.load.image("game_background", "./assets/images/gameBackground.png");
    //this.load.image("exit", "./assets/ui/exitbutton.png");
    this.load.image("right", "./assets/ui/right.png");
    this.load.image("left", "./assets/ui/left.png");
    this.load.image("up", "./assets/ui/up.png");
    this.load.image("down", "./assets/ui/down.png");
    this.load.audioSprite("radio", "./assets/audio.json", ["./assets/sfx/radio.mp3"]);

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
    for (let i = 0; i < 500; i++) {
      this.load.text(`${i}`);
    }

    this.load.on("progress", (percent: any) => {
      loadingBar.fillRect(0, this.game.renderer.height / 2, this.game.renderer.width * percent, 40);
      console.log("game percent:", percent);
    })

  }
  create(data: any) {
    this.sound.stopAll();
    this.sound.playAudioSprite("radio", "radio1", { volume: .3 });
    let prevPlay1 = false;
    let prevPlay2 = false;
    let prevPlay3 = false;
    let prevPlayScore = false;

    const playAudioSprite = (play1: boolean, play2: boolean, play3: boolean, playScore: boolean) => {
      if (play3 && !prevPlay3) {
        console.log("radio3");
        this.sound.stopAll();
        this.sound.playAudioSprite("radio", "radio3", { volume: .3 });
      } else if (play2 && !prevPlay2) {
        console.log("radio2");
        this.sound.stopAll();
        this.sound.playAudioSprite("radio", "radio2", { volume: .3 });
      } else if (play1 && !prevPlay1) {
        console.log("radio1");
        this.sound.stopAll();
        this.sound.playAudioSprite("radio", "radio1", { volume: .3 });
      } else if (playScore && !prevPlayScore) {
        console.log("play score");
        this.sound.stopAll();
        this.sound.playAudioSprite("radio", "score", { volume: .3 });
      }

      // Update previous values
      prevPlay1 = play1;
      prevPlay2 = play2;
      prevPlay3 = play3;
      prevPlayScore = playScore;
    }
    this.score = data["score"] ?? 0;
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
    let widthAdjustment = 0;
    let spaceAdjustment = 0;
    const adjustmentSpeed = .4;
    const widthAdjustmentSpeed = .08;
    //Adjust the width of line
    const adjustWidth = () => {
      if (Math.round(this.randomWidth) <= 1 && widthAdjustment <= 0) {
        return;
      }
      if (Math.round(this.randomWidth) > 21) {
        this.randomWidth -= 1;
      }
      if (Math.round(this.randomWidth) <= 1) {
        this.randomWidth += 1;
      }
      if (Math.round(this.randomWidth) <= 21) {
        this.randomWidth += widthAdjustment;
      }
      if (this.randomWidth >= 1) {
        this.randomWidth += widthAdjustment;
      }
    }
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

    const scoreText = this.add.text(5, 5, `SCORE: ${this.score}`, { fontFamily: '"Roboto Condensed"', fontSize: '32px' })
    scoreText.setDepth(2);
    const timeText = this.add.text(width * 0.5, 25, `${this.countDown?.label}`, { fontFamily: '"Roboto Condensed"', fontSize: '30px' }).setOrigin(0.5);
    timeText.setDepth(2);

    this.update = () => {
      adjustWidth();
      adjustLine();
      // Update the line position based on the new variables
      targetGraphic.clear();
      if (this.hasScored) {
        targetGraphic.lineStyle(this.targetWidth, 0x00FF00);
      } else
        targetGraphic.lineStyle(this.targetWidth, 0xFF6666);
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
        graphics.lineStyle(this.randomWidth, 0xFF0000);
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

      const tolerance = 3; // Adjust tolerance as needed
      const heightDif = Math.abs(Math.round(this.randomHeight) - this.targetHeight);
      const spaceDif = Math.abs(Math.round(this.randomSpacing) - this.targetSpacing);
      const widthDif = Math.abs(Math.round(this.randomWidth) - this.targetWidth);

      if (heightDif > 70 &&
        spaceDif > 25 &&
        !this.hasScored) {
        console.log("radio1");
        this.playScore = false;
        this.play1 = true;
        this.play2 = false;
        this.play3 = false;
      } else if (heightDif <= tolerance &&
        spaceDif <= tolerance &&
        widthDif <= tolerance &&
        !this.hasScored) {
        playAudioSprite(this.play1, this.play2, this.play3, this.playScore);
      } else if (heightDif <= 100 &&
        spaceDif <= 25 &&
        widthDif <= 15 &&
        !this.hasScored) {
        if (heightDif <= 25 &&
          spaceDif <= 10 &&
          widthDif <= 6 &&
          !this.hasScored) {
          console.log("radio3");
          this.playScore = false;
          this.play1 = false;
          this.play2 = false;
          this.play3 = true;
        } else {
          console.log("radio2");
          this.playScore = false;
          this.play1 = false;
          this.play2 = true;
          this.play3 = false;
        }
      }
      playAudioSprite(this.play1, this.play2, this.play3, this.playScore);

      if (heightDif <= tolerance &&
        spaceDif <= tolerance &&
        widthDif <= tolerance &&
        !this.hasScored) {
        this.playScore = true;
        this.hasScored = true;
        this.score += 100;
        console.log("score:", this.score);
        scoreText.setText(`SCORE: ${this.score}`);
      }
      if (this.hasScored) {
        setTimeout(() => {
          generateHeights();
          generateWidth();
          generateSpacing();
          this.playScore = false;
          this.hasScored = false;
        }, 400
        );
      } else { graphics.lineStyle(this.randomWidth, 0xFF6666); this.playScore = false; }
      this.countDown?.update();
    };

    const add = (num: number, target: boolean) => {
      if (!target) {
        return Math.floor(num + this.randomSpacing);
      } else {
        return Math.floor(num + this.targetSpacing);
      }
    }

    this.add.image(0, 0, "game_background").setOrigin(0);
    const leftImg = this.add.image(150, 475, "left").setScale(0.5).setOrigin(0);
    const rightImg = this.add.image(250, 475, "right").setScale(0.5).setOrigin(0);
    const upImg = this.add.image(375, 425, "up").setScale(0.5).setOrigin(0);
    const downImg = this.add.image(375, 525, "down").setScale(0.5).setOrigin(0);
    const leftWidth = this.add.image(500, 475, "left").setScale(0.5).setOrigin(0);
    const rightWidth = this.add.image(600, 475, "right").setScale(0.5).setOrigin(0);
    const exitButton = this.add.text(745, 2, "exit", { fontSize: "20px" }).setOrigin(0);
    exitButton.setInteractive();
    exitButton.on("pointerdown", () => {
      this.sound.stopAll();
      this.scene.start(CST.SCENES.TITLE);
    });
    exitButton.on("pointerover", () => {
      this.sound.play("menu_hover", {
        volume: 0.1
      });
      exitButton.setFill("#FFFF00");
    });
    exitButton.on("pointerout", () => {
      exitButton.setFill("#FFFFff");
    });

    //keybinding
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
    let qKeypressed = false;
    let eKeypressed = false;

    keyQ.on('down', () => {
      qKeypressed = true;
      widthAdjustment = -widthAdjustmentSpeed
      if (Math.round(this.randomWidth) > 1) {
        leftWidth.setScale(.55).setTint(0x00ff00);
      } else leftWidth.setScale(.55).setTint(0xff0000);
    });
    keyQ.on("up", () => {
      qKeypressed = false;
      if (!qKeypressed && !eKeypressed) {
        widthAdjustment = 0;
      }
      leftWidth.setScale(.5).setTint(0xffffff);
    })
    keyE.on('down', () => {
      eKeypressed = true;
      widthAdjustment = widthAdjustmentSpeed
      if (Math.round(this.randomWidth) <= 20) {
        rightWidth.setScale(.55).setTint(0x00ff00);
      } else rightWidth.setScale(.55).setTint(0xff0000);
    });
    keyE.on("up", () => {
      eKeypressed = false;
      if (!qKeypressed && !eKeypressed) {
        widthAdjustment = 0;
      }
      rightWidth.setScale(.5).setTint(0xffffff);
    })

    keyW.on('down', () => {
      wKeypressed = true;
      heightAdjustment = -adjustmentSpeed;
      if (this.randomHeight >= 4) {
        upImg.setScale(.55).setTint(0x00ff00);
      } else upImg.setScale(.55).setTint(0xff0000);
    });
    keyW.on('up', () => {
      wKeypressed = false;
      if (!wKeypressed && !sKeypressed) {
        heightAdjustment = 0;
      }
      upImg.setScale(.5).setTint(0xffffff);
    });
    keyS.on('down', () => {
      sKeypressed = true;
      heightAdjustment = adjustmentSpeed;
      if (this.randomHeight <= 349) {
        downImg.setScale(.55).setTint(0x00ff00);
      } else downImg.setScale(.55).setTint(0xff0000);
    });
    keyS.on('up', () => {
      sKeypressed = false;
      if (!wKeypressed && !sKeypressed) {
        heightAdjustment = 0;
      }
      downImg.setScale(.50).setTint(0xffffff);
    });
    keyA.on('down', () => {
      aKeypressed = true;
      spaceAdjustment = -adjustmentSpeed;
      if (this.randomSpacing >= -199) {
        leftImg.setScale(.55).setTint(0x00ff00);
      } else leftImg.setScale(.55).setTint(0xff0000);
    });
    keyA.on('up', () => {
      aKeypressed = false;
      if (!aKeypressed && !dKeypressed) {
        spaceAdjustment = 0;
      }
      leftImg.setScale(0.5).setTint(0xffffff);
    });
    keyD.on('down', () => {
      dKeypressed = true;
      spaceAdjustment = adjustmentSpeed;
      if (this.randomSpacing <= 199) {
        rightImg.setScale(.55).setTint(0x00ff00);
      } else rightImg.setScale(.55).setTint(0xff0000);
    });
    keyD.on('up', () => {
      dKeypressed = false;
      if (!aKeypressed && !dKeypressed) {
        spaceAdjustment = 0;
      }
      rightImg.setScale(0.5).setTint(0xffffff)
    });

    // Mapping the UI control images to key inputs
    //left
    leftImg.setInteractive();
    leftImg.on("pointerdown", () => {
      aKeypressed = true;
      if (aKeypressed) {
        leftImg.setScale(0.55).setTint(0x00ff00);
      }
      spaceAdjustment = -adjustmentSpeed;
    });
    leftImg.on("pointerup", () => {
      aKeypressed = false;
      leftImg.setScale(0.5).setTint(0xffffff);
      spaceAdjustment = 0;
    });
    leftImg.on("pointerout", () => {
      aKeypressed = false;
      leftImg.setScale(0.5).setTint(0xffffff);
      spaceAdjustment = 0;
    });
    //right
    rightImg.setInteractive();
    rightImg.on("pointerdown", () => {
      dKeypressed = true;
      if (dKeypressed) {
        if (this.randomSpacing <= 199) {
          rightImg.setScale(.55).setTint(0x00ff00);
        } else rightImg.setScale(.55).setTint(0xff0000);
      }
      spaceAdjustment = adjustmentSpeed;
    })
    rightImg.on("pointerup", () => {
      dKeypressed = false;
      rightImg.setScale(0.5).setTint(0xffffff);
      spaceAdjustment = 0;
    });
    rightImg.on("pointerout", () => {
      dKeypressed = false;
      rightImg.setScale(0.5).setTint(0xffffff);
      spaceAdjustment = 0;
    });
    //up
    upImg.setInteractive();
    upImg.on("pointerdown", () => {
      wKeypressed = true;
      if (wKeypressed) {
        if (this.randomHeight >= 4) {
          upImg.setScale(.55).setTint(0x00ff00);
        } else upImg.setScale(.55).setTint(0xff0000);
      }
      heightAdjustment = -adjustmentSpeed;
    });
    upImg.on("pointerup", () => {
      wKeypressed = false;
      upImg.setScale(0.5).setTint(0xffffff);
      heightAdjustment = 0;
    });
    upImg.on("pointerout", () => {
      wKeypressed = false;
      upImg.setScale(0.5).setTint(0xffffff);
      heightAdjustment = 0;
    });
    //down
    downImg.setInteractive();
    downImg.on("pointerdown", () => {
      sKeypressed = true;
      if (sKeypressed) {
        if (this.randomHeight <= 349) {
          downImg.setScale(.55).setTint(0x00ff00);
        } else downImg.setScale(.55).setTint(0xff0000);
      }
      heightAdjustment = adjustmentSpeed;
    });
    downImg.on("pointerup", () => {
      sKeypressed = false;
      downImg.setScale(0.5).setTint(0xffffff);
      heightAdjustment = 0;
    });
    downImg.on("pointerout", () => {
      sKeypressed = false;
      downImg.setScale(0.5).setTint(0xffffff);
      heightAdjustment = 0;
    });
    //width
    leftWidth.setInteractive();
    leftWidth.on("pointerdown", () => {
      if (Math.round(this.randomWidth) > 1) {
        if (this.randomSpacing >= -199) {
          leftWidth.setScale(.55).setTint(0x00ff00);
        } else leftWidth.setScale(.55).setTint(0xff0000);
      }
      if (this.randomWidth >= 1) {
        widthAdjustment = -widthAdjustmentSpeed
      } else return
    })
    leftWidth.on("pointerup", () => {
      qKeypressed = false;
      leftWidth.setScale(0.5).setTint(0xffffff);
      widthAdjustment = 0;
    });
    leftWidth.on("pointerout", () => {
      qKeypressed = false;
      leftWidth.setScale(0.5).setTint(0xffffff);
      widthAdjustment = 0;
    });
    rightWidth.setInteractive();
    rightWidth.on("pointerdown", () => {
      if (Math.round(this.randomWidth) <= 20) {
        rightWidth.setScale(.55).setTint(0x00ff00);
      } else rightWidth.setScale(.55).setTint(0xff0000);
      if (this.randomWidth <= 21) {
        widthAdjustment = widthAdjustmentSpeed
      } else return;
    });
    rightWidth.on("pointerup", () => {
      eKeypressed = false;
      rightWidth.setScale(0.5).setTint(0xffffff);
      widthAdjustment = 0;
    });
    rightWidth.on("pointerout", () => {
      eKeypressed = false;
      rightWidth.setScale(0.5).setTint(0xffffff);
      widthAdjustment = 0;
    });

    // The winning line
    const targetGraphic = this.add.graphics();
    targetGraphic.lineStyle(this.targetWidth,
      0xed78b2);
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
    graphics.lineStyle(this.randomWidth, 0xe5003f);
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
    this.countDown.start(this.handleCountdownFinish.bind(this), 20000);

  }
  handleCountdownFinish = () => {
    this.scene.start(CST.SCENES.ENDGAME, { score: this.score, test: "test" });
  }
}