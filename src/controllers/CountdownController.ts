export default class CountdownController {
  scene: Phaser.Scene
  label: Phaser.GameObjects.Text
  timerEvent: Phaser.Time.TimerEvent | undefined
  duration = 0
  paused = false
  remaining = 0
  timeText: any
  callback: (() => void) | undefined

  constructor(scene: Phaser.Scene, label: Phaser.GameObjects.Text) {
    this.scene = scene
    this.label = label
    this.timeText = "";
  }

  start(callback: () => void, duration = 15000) {
    this.stop();

    this.duration = duration;
    this.callback = callback; // Set the callback property

    this.timerEvent = this.scene.time.addEvent({
      delay: duration,
      callback: () => {
        this.label.text = '0';
        this.stop();
        if (callback) {
          callback();
        }
      }
    });
  }

  stop() {
    if (this.timerEvent) {
      this.timerEvent.destroy()
      this.timerEvent = undefined
    }
  }

  update() {
    if (!this.timerEvent || this.duration <= 0) {
      return;
    }
    if (!this.paused) {
      const elapsed = this.timerEvent.getElapsed();
      this.remaining = this.duration - elapsed;
    }
    const seconds = this.remaining / 1000;
    this.label.text = seconds.toFixed(2);
  }
}