const STARTING_FPS = 60;

let Time = {
  timeScale: 0,
  unscaledDeltaTime: 0,
  deltaTime: 0
};

Time.reset = () => {
  Time.timeStart = 0;
  Time.timePassed = 0;
  Time.fps = STARTING_FPS;
}

Time.update = (timeStamp) => {
  if (Time.timeStart === 0) {
    Time.timeStart = timeStamp;
    Time.fps = STARTING_FPS;
  } else {
    Time.fps = 1000 / (timeStamp - Time.timeStart);
  }

  Time.unscaledDeltaTime = 1 / Time.fps;
  Time.deltaTime = Time.unscaledDeltaTime * Time.timeScale;

  Time.timePassed += Time.unscaledDeltaTime;
  Time.timeStart = timeStamp;
}

Time.reset();

export default Time
