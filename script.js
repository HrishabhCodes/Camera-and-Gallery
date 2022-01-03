const video = document.querySelector("video");
let recorder;
const recordBtnCont = document.querySelector(".record-btn-cont");
const captureBtnCont = document.querySelector(".capture-btn-cont");
const recordBtn = document.querySelector(".record-btn");
const captureBtn = document.querySelector(".capture-btn");
let recordFlag = false;
let classAvailable = false;
let transparentColor = "transparent";
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

    if (db) {
      let videoId = shortid();
      let dbTransaction = db.transaction("video", "readwrite");
      let videoStore = dbTransaction.objectStore("video");
      let videoEntry = {
        id: `vid-${videoId}`,
        blobData: blob,
      };
      videoStore.add(videoEntry);
    }

    // let videoURL = URL.createObjectURL(blob);
    // let a = document.createElement("a");
    // a.href = videoURL;
    // a.download = "recording.mp4";
    // a.click();
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
const startTimer = () => {
  let counter = 1;

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

// *********************** Capturing images ***********************

captureBtnCont.addEventListener("click", (e) => {
  captureBtn.classList.add("scale-capture");

  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  const tool = canvas.getContext("2d");
  tool.drawImage(video, 0, 0, canvas.width, canvas.height);

  tool.fillStyle = transparentColor;
  tool.fillRect(0, 0, canvas.width, canvas.height);

  const imageURL = canvas.toDataURL();

  if (db) {
    let imageId = shortid();
    let dbTransaction = db.transaction("image", "readwrite");
    let imageStore = dbTransaction.objectStore("image");
    let imageEntry = {
      id: `img-${imageId}`,
      url: imageURL,
    };
    imageStore.add(imageEntry);
  }

  // const a = document.createElement("a");
  // a.href = imageURL;
  // a.download = "image.jpg";
  // a.click();

  setTimeout(() => {
    captureBtn.classList.remove("scale-capture");
  }, 500);
});

// *********************** Filtering images ***********************

const filterLayer = document.querySelector(".filter-layer");
const allFilters = document.querySelectorAll(".filter");
allFilters.forEach((filterElem) => {
  filterElem.addEventListener("click", (e) => {
    transparentColor =
      getComputedStyle(filterElem).getPropertyValue("background-color");
    filterLayer.style.backgroundColor = transparentColor;
  });
});
