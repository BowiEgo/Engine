const STARTING_FPS = 60;

export default class Time {
  constructor(app) {
    this.app = app;
    this.timeScale = 0;
    this.unscaledDeltaTime = 0;
    this.deltaTime = 0;
    this.reset();
  }

  static create(app) {
    app._time = new Time(app);
  }

  reset() {
    this.timeStart = 0;
    this.timePassed = 0;
    this.fps = STARTING_FPS;
  }

  update(timeStamp) {
    if (this.timeStart === 0) {
      this.timeStart = timeStamp;
      this.fps = STARTING_FPS;
    } else {
      this.fps = 1000 / (timeStamp - this.timeStart);
    }

    this.unscaledDeltaTime = 1 / this.fps;
    this.deltaTime = this.unscaledDeltaTime * this.timeScale;

    this.timePassed += this.unscaledDeltaTime;
    this.timeStart = timeStamp;
  }
}
