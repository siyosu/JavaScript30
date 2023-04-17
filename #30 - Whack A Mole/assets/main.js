const currentScoreBoard = document.querySelector(".current-score");
const highestScore = document.querySelector("#highest");
const holes = document.querySelectorAll(".hole");
const moles = document.querySelectorAll(".mole");
const playButton = document.querySelector("#start");
let lastHole;
let istimeUp = false;
let isGameStart = false;
let topScore = parseInt(localStorage.getItem("topscore")) || 0;
let score = 0;

function randomTime(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

function randomHoles(holes) {
  const holesId = Math.floor(Math.random() * holes.length);
  const hole = holes[holesId];
  if (hole === lastHole) {
    return randomHoles(holes);
  }
  lastHole = hole;
  return hole;
}

function showMole() {
  const time = randomTime(400, 1500);
  const hole = randomHoles(holes);
  hole.children[0].classList.add("up");
  setTimeout(() => {
    hole.children[0].classList.remove("up");
    if (!istimeUp) {
      showMole();
    } else {
      isGameStart = false;
      if (score > topScore) {
        localStorage.setItem("topscore", score);
        highestScore.textContent = score;
      }
      score = 0;
    }
  }, time);
}

function whackMole(e) {
  if (!e.isTrusted) return; //Cheater
  score++;
  this.classList.remove("up");
  currentScoreBoard.textContent = score;
}

function startGame() {
  if (isGameStart) return;
  isGameStart = true;
  const duration = 15; //in seconds
  currentScoreBoard.textContent = 0;
  istimeUp = false;
  score = 0;
  showMole();
  setTimeout(() => (istimeUp = true), duration * 1000);
}

moles.forEach((mole) => mole.addEventListener("click", whackMole));
playButton.addEventListener("click", startGame);
highestScore.textContent = topScore;
