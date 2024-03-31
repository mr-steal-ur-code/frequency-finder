import { CST } from "../CST";

export default class EndGame extends Phaser.Scene {
  constructor() {
    super({
      key: CST.SCENES.ENDGAME
    })
  }
  preload() {
    this.load.image('menu', 'assets/ui/menu.png');
    this.load.image('restart', 'assets/ui/restart.png');
    this.load.image("finalscore", "assets/ui/finalscore.png");
    this.load.audio("endgame", "assets/music/endgame.mp3");
  }
  create(data: any) {
    this.sound.stopAll();
    this.sound.play("endgame", {
      loop: true,
      volume: .5
    })
    this.add.image(400, 300, 'background');
    this.add.image(300, 185, "finalscore");
    this.add.text(500, 144, `${data["score"]}`, { fontSize: "50px", color: "#ed78b2", stroke: "#e5003f", strokeThickness: 4, fontFamily: "'Brush Script MT', cursive" });
    const restartButton = this.add.image(400, 325, 'restart');
    restartButton.setInteractive();
    restartButton.on("pointerover", () => {
      this.sound.play("menu_hover", {
        volume: 0.1
      });
      restartButton.setScale(1.05);
    })
    restartButton.on("pointerout", () => {
      restartButton.setScale(1);
    })
    restartButton.on("pointerdown", () => {
      this.scene.start(CST.SCENES.GAME, { score: 0 })
    });
    const menuButton = this.add.image(400, 450, 'menu');
    menuButton.setInteractive();
    menuButton.on("pointerover", () => {
      this.sound.play("menu_hover", {
        volume: 0.1
      });
      menuButton.setScale(1.05);
    })
    menuButton.on("pointerout", () => {
      menuButton.setScale(1);
    })
    menuButton.on("pointerdown", () => {
      this.scene.start(CST.SCENES.TITLE, { restartMenuMusic: true })
    });
  }
}