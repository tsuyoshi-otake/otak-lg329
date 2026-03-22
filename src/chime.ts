import { pad, CONFIG } from "./config";

let audioCtx: AudioContext | null = null;
let audioUnlocked = false;
let lastChimeHour = -1;

export function initAudio(): void {
  try {
    const AC = window.AudioContext || (window as any).webkitAudioContext;
    if (AC) audioCtx = new AC();
  } catch {
    // Audio not available
  }
}

export function unlockAudio(): void {
  if (!audioCtx) initAudio();
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  audioUnlocked = true;

  // Play silent buffer to fully unlock
  if (audioCtx) {
    const buf = audioCtx.createBuffer(1, 1, 22050);
    const src = audioCtx.createBufferSource();
    src.buffer = buf;
    src.connect(audioCtx.destination);
    src.start(0);
  }
}

function playChime(hour: number): void {
  if (!audioCtx || !audioUnlocked || !CONFIG.chimeEnabled) return;

  const t = audioCtx.currentTime;

  // Two-tone bell chime (ding-dong)
  const tones = [
    { freq: 659.25, start: 0, dur: 1.2 }, // E5
    { freq: 523.25, start: 0.6, dur: 1.5 }, // C5
  ];

  for (const tone of tones) {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = "sine";
    osc.frequency.value = tone.freq;

    // Slight vibrato for realism
    const vibrato = audioCtx.createOscillator();
    const vibratoGain = audioCtx.createGain();
    vibrato.frequency.value = 5;
    vibratoGain.gain.value = 2;
    vibrato.connect(vibratoGain);
    vibratoGain.connect(osc.frequency);
    vibrato.start(t + tone.start);
    vibrato.stop(t + tone.start + tone.dur);

    gain.gain.setValueAtTime(0, t + tone.start);
    gain.gain.linearRampToValueAtTime(0.15, t + tone.start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, t + tone.start + tone.dur);

    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(t + tone.start);
    osc.stop(t + tone.start + tone.dur);
  }

  // Visual indicator
  const ind = document.getElementById("chime-indicator");
  if (ind) {
    ind.textContent = `${pad(hour)}:00`;
    ind.className = "chime-indicator active";
    setTimeout(() => {
      ind.className = "chime-indicator";
    }, 3000);
  }
}

export function checkChime(): void {
  const now = new Date();
  const h = now.getHours();
  const m = now.getMinutes();
  const s = now.getSeconds();

  if (m === 0 && s === 0 && h !== lastChimeHour) {
    lastChimeHour = h;
    playChime(h);
  }
  if (m !== 0) lastChimeHour = -1;
}
