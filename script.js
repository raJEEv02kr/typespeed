// ===== Quotes by difficulty =====
const quotesByDifficulty = {
  easy: [
    "The quick brown fox jumps over the lazy dog.",
    "Practice makes perfect.",
    "Typing is fun and useful."
  ],
  medium: [
    "Coding is not just about what you know, it is about what you can figure out.",
    "JavaScript is the language of the web.",
    "Keep pushing your limits every single day."
  ],
  hard: [
    "Complex systems require careful planning, precise execution, and continuous refinement.",
    "Performance optimization in JavaScript often involves understanding memory and event loops.",
    "Debugging is like being the detective in a crime movie where you are also the murderer."
  ]
};

// ===== Elements =====
const quoteDisplay = document.getElementById('quote-display');
const inputField = document.getElementById('input-field');
const wpmDisplay = document.getElementById('wpm');
const accuracyDisplay = document.getElementById('accuracy');
const timerDisplay = document.getElementById('timer');
const highscoreDisplay = document.getElementById('highscore');
const resetBtn = document.getElementById('reset-btn');
const difficultySelect = document.getElementById('difficulty');
const themeSelect = document.getElementById('theme');
const modeSelect = document.getElementById('mode');
const glowSlider = document.getElementById('glow-slider');
const confettiCanvas = document.getElementById('confetti');
const confettiCtx = confettiCanvas.getContext('2d');

/* =============================== */
/* AUDIO FEATURE (GLOBAL) */
/* =============================== */

const audioBtn = document.getElementById("audio-btn");
const audioSpeedSelect = document.getElementById("audio-speed"); // ⭐ NEW
const synth = window.speechSynthesis;
let currentUtterance = null;

function speakQuote() {

  const text = quoteDisplay.innerText;
  if (!text) return;

  // Toggle behaviour
  if (synth.speaking) {
    synth.cancel();
    audioBtn.innerText = "Play";
    return;
  }

  currentUtterance = new SpeechSynthesisUtterance(text);

  // ⭐ SPEED CONTROL
  currentUtterance.rate = parseFloat(audioSpeedSelect.value);

  synth.speak(currentUtterance);
  audioBtn.innerText = "Stop";

  currentUtterance.onend = () => {
    audioBtn.innerText = "Play";
  };
}

audioBtn.addEventListener("click", speakQuote);

// ===== State =====
let timer = 0;
let interval = null;
let isStarted = false;
let highscore = parseInt(localStorage.getItem('highscore')) || 0;
highscoreDisplay.textContent = highscore;

// ===== Preferences =====
function applyPreferences() {
  const prefs = JSON.parse(localStorage.getItem("prefs")) || {
    theme: "green",
    mode: "dark",
    glow: 20
  };

  document.body.className = `theme-${prefs.theme} mode-${prefs.mode}`;
  document.documentElement.style.setProperty("--glow", prefs.glow + "px");

  themeSelect.value = prefs.theme;
  modeSelect.value = prefs.mode;
  glowSlider.value = prefs.glow;
}
applyPreferences();

function savePreferences() {
  const prefs = {
    theme: themeSelect.value,
    mode: modeSelect.value,
    glow: glowSlider.value
  };
  localStorage.setItem("prefs", JSON.stringify(prefs));
}

themeSelect.addEventListener("change", () => {
  setThemeAnimated();
  savePreferences();
});

modeSelect.addEventListener("change", () => {
  setThemeAnimated();
  savePreferences();
});

glowSlider.addEventListener("input", () => {
  document.documentElement.style.setProperty("--glow", glowSlider.value + "px");
  savePreferences();
});

// ===== THEME ANIMATION =====
function setThemeAnimated() {
  document.body.style.opacity = "0";

  setTimeout(() => {
    document.body.className = `theme-${themeSelect.value} mode-${modeSelect.value}`;
    document.documentElement.style.setProperty("--glow", glowSlider.value + "px");
    document.body.style.opacity = "1";
  }, 250);
}

// ===== Quote Rendering =====
function renderNewQuote() {

  // Stop audio when quote changes
  if (synth.speaking) synth.cancel();
  audioBtn.innerText = "Play";

  const difficulty = difficultySelect.value;
  const quotes = quotesByDifficulty[difficulty];
  const randomIndex = Math.floor(Math.random() * quotes.length);

  quoteDisplay.innerHTML = '';
  quotes[randomIndex].split('').forEach(char => {
    const span = document.createElement('span');
    span.innerText = char;
    quoteDisplay.appendChild(span);
  });

  inputField.value = '';
  inputField.disabled = false;
  isStarted = false;
}
renderNewQuote();

// ===== Difficulty change =====
difficultySelect.addEventListener("change", () => {
  resetTest();
});

// ===== Typing Logic =====
inputField.addEventListener('input', () => {

  // ⭐ AUTO PAUSE AUDIO WHEN USER STARTS TYPING
  if (synth.speaking) {
    synth.cancel();
    audioBtn.innerText = "Play";
  }

  if (!isStarted) {
    startTimer();
    isStarted = true;
  }

  const arrayQuote = quoteDisplay.querySelectorAll('span');
  const arrayValue = inputField.value.split('');
  let correctChars = 0;

  arrayQuote.forEach((charSpan, index) => {
    const character = arrayValue[index];
    if (character == null) {
      charSpan.classList.remove('correct', 'incorrect');
    } else if (character === charSpan.innerText) {
      charSpan.classList.add('correct');
      charSpan.classList.remove('incorrect');
      correctChars++;
    } else {
      charSpan.classList.add('incorrect');
      charSpan.classList.remove('correct');
    }
  });

  if (arrayValue.length > 0) {
    let acc = (correctChars / arrayValue.length) * 100;
    accuracyDisplay.innerText = Math.floor(acc);
  }

  if (arrayValue.length === arrayQuote.length) {
    stopTimer();
    launchConfetti();
  }
});

function startTimer() {
  timer = 0;
  interval = setInterval(() => {
    timer++;
    timerDisplay.innerText = timer;
    calculateWPM();
  }, 1000);
}

function calculateWPM() {
  const wordsTyped = inputField.value.trim().split(/\s+/).length;
  const minutes = timer / 60;
  if (minutes > 0) {
    const wpm = Math.round(wordsTyped / minutes);
    wpmDisplay.innerText = wpm;
  }
}

function stopTimer() {
  clearInterval(interval);
  inputField.disabled = true;
  updateHighscore();
}

function updateHighscore() {
  const wpm = parseInt(wpmDisplay.textContent) || 0;
  if (wpm > highscore) {
    highscore = wpm;
    localStorage.setItem('highscore', highscore);
    highscoreDisplay.textContent = highscore;
  }
}

// ===== Reset =====
resetBtn.addEventListener('click', resetTest);

function resetTest() {
  clearInterval(interval);

  if (synth.speaking) synth.cancel();
  audioBtn.innerText = "Play";

  isStarted = false;
  timer = 0;
  timerDisplay.innerText = 0;
  wpmDisplay.innerText = 0;
  accuracyDisplay.innerText = 100;
  renderNewQuote();
}

// ===== Confetti =====
let confettis = [];

function resizeCanvas() {
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

function launchConfetti() {
  const theme = themeSelect.value;

  const colors = {
    green: ["#00ff88", "#66ffcc", "#33ffaa"],
    blue: ["#00e5ff", "#66f2ff", "#33ddff"],
    red: ["#ff0055", "#ff6699", "#ff3366"],
    mac: ["#cccccc", "#eeeeee", "#aaaaaa"]
  };

  const palette = colors[theme] || ["#ffffff"];

  for (let i = 0; i < 150; i++) {
    confettis.push({
      x: Math.random() * confettiCanvas.width,
      y: -20,
      r: Math.random() * 6 + 3,
      color: palette[Math.floor(Math.random() * palette.length)],
      dx: (Math.random() - 0.5) * 4,
      dy: Math.random() * 5 + 2,
      rot: Math.random() * Math.PI
    });
  }

  requestAnimationFrame(updateConfetti);
}

function updateConfetti() {
  confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

  confettis.forEach((c, i) => {
    confettiCtx.save();
    confettiCtx.translate(c.x, c.y);
    confettiCtx.rotate(c.rot);
    confettiCtx.fillStyle = c.color;
    confettiCtx.fillRect(-c.r / 2, -c.r / 2, c.r, c.r * 1.5);
    confettiCtx.restore();

    c.x += c.dx;
    c.y += c.dy;
    c.rot += 0.1;

    if (c.y > confettiCanvas.height + 20) {
      confettis.splice(i, 1);
    }
  });

  if (confettis.length > 0) {
    requestAnimationFrame(updateConfetti);
  }
}

/* ================================= */
/* ===== MAC GLASS PARALLAX ========= */
/* ================================= */

const macPanel = document.querySelector(".container");

document.addEventListener("mousemove",(e)=>{

  if(!document.body.classList.contains("theme-mac")) return;
  if(!macPanel) return;

  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;

  const offsetX = (e.clientX - centerX) / 40;
  const offsetY = (e.clientY - centerY) / 40;

  macPanel.style.transform = `
    rotateY(${offsetX}deg)
    rotateX(${-offsetY}deg)
    translateZ(8px)
  `;
});
