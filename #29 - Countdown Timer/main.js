const display = document.querySelector("#time");
const buttons = document.querySelectorAll("button");
const toggle = document.querySelector("#toggle");
let targetDuration =
  parseInt(JSON.parse(localStorage.getItem("targetDuration"))) || 300;
let countdown;
let isRunning = false;
let isSettingOpen = false;

function timer(seconds) {
  const now = Date.now();
  const then = now + seconds * 1000;
  clearInterval(countdown);
  displayTimer(seconds);
  countdown = setInterval(() => {
    const secondsLeft = Math.round((then - Date.now()) / 1000);
    if (secondsLeft < 0 || !isRunning) {
      clearInterval(countdown);
      return;
    }
    displayTimer(secondsLeft);
  }, 1000);
  console.log(now, then);
}

function displayTimer(seconds) {
  const hours = Math.floor(seconds / 3600);
  let remainderSeconds = seconds % 3600;
  const minutes = Math.floor(remainderSeconds / 60);
  remainderSeconds %= 60;
  const format = `${hours < 10 ? "0" : ""}${hours}:${
    minutes < 10 ? "0" : ""
  }${minutes}:${remainderSeconds < 10 ? "0" : ""}${remainderSeconds}`;

  display.textContent = format;
  document.title = format;
}

function handleButton() {
  switch (this.id) {
    case "setting":
      isSettingOpen = !isSettingOpen;
      openSetting();
      break;
    case "toggle":
      isRunning = !isRunning;
      updateToggle(this);
      timer(targetDuration);
      break;
    case "submit":
      isRunning = false;
      updateToggle(toggle);
      break;
    case "cancel":
      isSettingOpen = false;
      document.settingForm.style.display = "none";
      break;
    default:
      break;
  }
}

function openSetting() {
  if (isSettingOpen) {
    document.settingForm.style.display = "block";
  } else {
    document.settingForm.style.display = "none";
  }
}

function updateToggle(button) {
  if (isRunning) {
    button.classList.add("run");
    button.innerText = "Stop";
  } else {
    button.classList.remove("run");
    button.innerText = "Start";
  }
}

buttons.forEach((button) => button.addEventListener("click", handleButton));
document.settingForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const minutes = parseInt(this.minutes.value);
  if (minutes < 1) return;
  console.log(minutes);
  localStorage.setItem("targetDuration", minutes * 60);
  targetDuration = minutes * 60;
  displayTimer(targetDuration);
  this.reset();
});

displayTimer(targetDuration);
