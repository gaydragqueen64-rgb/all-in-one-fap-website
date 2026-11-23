const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const gainNode = audioCtx.createGain();
gainNode.gain.value = 0.5;
gainNode.connect(audioCtx.destination);
console.log("⚡ Workspace initialized.");

let beatCount = 0;
let isRunning = false;
let intervalId;
let durationTimeoutId;
let startTime = 0;
const beatCounterEl = document.getElementById('beat-counter');
const bpmInput = document.getElementById('bpm-input');
const durationInput = document.getElementById('duration-input');
const startStopBtn = document.getElementById('start-stop-btn');
const edgeModeBtn = document.getElementById('edge-mode-btn');
const container = document.querySelector('.container');
const freqInput = document.getElementById('freq-input');
const clickTypeSelect = document.getElementById('click-type-select');
const beatIndicator = document.getElementById('beat-indicator');

function playClick() {
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioCtx.createOscillator();
  const freq = parseInt(freqInput.value, 10) || 1000;
  const type = clickTypeSelect.value === 'tick' ? 'triangle' : 'square';
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(freq, audioCtx.currentTime);
  oscillator.connect(audioCtx.destination);
  const duration = clickTypeSelect.value === 'tick' ? 0.02 : 0.05;
  oscillator.start();
  oscillator.stop(audioCtx.currentTime + duration);
}

function startMetronome() {
  const bpm = parseInt(bpmInput.value, 10) || 120;
  const interval = (60 / bpm) * 1000;
  clearInterval(intervalId);
  clearTimeout(durationTimeoutId);
  startTime = Date.now();
  intervalId = setInterval(() => {
    beatCount++;
    beatCounterEl.textContent = `Beat: ${beatCount}`;
    playClick();
    beatIndicator.classList.add('beat-active');
    setTimeout(() => beatIndicator.classList.remove('beat-active'), 100);
    const elapsed = (Date.now() - startTime) / 1000;
    const durationMin = parseInt(durationInput.value, 10) || 0;
    const durationSec = durationMin * 60;
    if (durationSec > 0) {
      const percent = Math.min((elapsed / durationSec) * 100, 100);
      progressBar.style.width = percent + '%';
    }
  }, interval);
  const durationMin = parseInt(durationInput.value, 10) || 0;
  const durationSec = durationMin * 60;
  if (durationSec > 0) {
    durationTimeoutId = setTimeout(() => {
      stopMetronome();
      startStopBtn.textContent = 'Start';
      isRunning = false;
    }, durationSec * 1000);
  }
}

function stopMetronome() {
  clearInterval(intervalId);
  clearTimeout(durationTimeoutId);
  beatCount = 0;
  beatCounterEl.textContent = 'Beat: 0';
  progressBar.style.width = '0%';
  beatIndicator.style.transform = 'scale(1)';
}

startStopBtn.addEventListener('click', () => {
  if (isRunning) {
    stopMetronome();
    startStopBtn.textContent = 'Start';
  } else {
    startMetronome();
    startStopBtn.textContent = 'Stop';
  }
  isRunning = !isRunning;
});
const resetBtn = document.getElementById('reset-btn');
resetBtn.addEventListener('click', () => {
  stopMetronome();
  startStopBtn.textContent = 'Start';
  isRunning = false;
});

edgeModeBtn.addEventListener('click', () => {
  container.classList.toggle('edge-mode');
  edgeModeBtn.textContent = container.classList.contains('edge-mode') ? 'Edge Mode: On' : 'Edge Mode: Off';
});

// Write your JavaScript here...