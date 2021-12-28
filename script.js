const video = document.querySelector("video");
let recorder;
const recordBtnCont = document.querySelector(".record-btn-cont");
const captureBtnCont = document.querySelector(".capture-btn-cont");
const recordBtn = document.querySelector(".record-btn");
const captureBtn = document.querySelector(".capture-btn");
let recordFlag = false;
let chunks = []; // media data chunks

let constraints = {
  video: true,
  audio: true,
};

// navigator --> global object , browaer info

navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
  video.srcObject = stream;

  recorder = new MediaRecorder(stream);
  recorder.addEventListener("start", (e) => {
    chunks = [];
  });
  recorder.addEventListener("dataavailable", (e) => {
    chunks.push(e.data);
  });
  recorder.addEventListener("stop", (e) => {
    // convert media chunks data to video
    let blob = new Blob(chunks, { type: "video/mp4" });
    let videoURL = URL.createObjectURL(blob);
    let a = document.createElement("a");
    a.href = videoURL;
    a.download = "recording.mp4";
    a.click();
  });
});

recordBtnCont.addEventListener("click", (e) => {
  if (!recorder) {
    return;
  }

  recordFlag = !recordFlag;

  if (recordFlag) {
    // start
    recorder.start();
    recordBtn.classList.add("scale-record");
    startTimer();
  } else {
    // stop
    recorder.stop();
    recordBtn.classList.remove("scale-record");
    stopTimer();
  }
});

const timerCont = document.querySelector(".timer-cont");
const timer = document.querySelector(".timer");
const timerDot = document.querySelector(".dot");
let counter = 1;
const startTimer = () => {
  timerCont.style.display = "flex";
  const displayTimer = () => {
    let totalSeconds = counter;

    let hours = Number.parseInt(totalSeconds / 3600);
    totalSeconds = totalSeconds % 3600;

    let minutes = Number.parseInt(totalSeconds / 60);
    totalSeconds = totalSeconds % 60;

    let seconds = totalSeconds;

    hours = hours < 10 ? `0${hours}` : hours;
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    seconds = seconds < 10 ? `0${seconds}` : seconds;

    timer.innerText = `${hours}:${minutes}:${seconds}`;

    counter++;
  };

  timerID = setInterval(displayTimer, 1000);
};

const stopTimer = () => {
  clearInterval(timerID);
  timer.innerText = "00:00:00";
  timerCont.style.display = "none";
};
