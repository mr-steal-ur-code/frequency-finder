import { CST } from "../CST"

export default class LoadScene extends Phaser.Scene {
  constructor() {
    super({
      key: CST.SCENES.LOAD
    })
  }
  create() {
    this.scene.start(CST.SCENES.TITLE)
  }
}