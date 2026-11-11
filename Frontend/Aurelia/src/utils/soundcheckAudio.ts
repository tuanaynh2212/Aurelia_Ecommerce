type BeatListener = (step: number) => void;

const BPM = 120;
const STEP_MS = (60 / BPM / 2) * 1000;
const BASS_NOTES = [55, 55, 65.41, 73.42, 55, 55, 82.41, 65.41];

let audioCtx: AudioContext | null = null;
let timerId: number | null = null;
let activeStep = 0;
let isPlaying = false;
const listeners = new Set<BeatListener>();

function playSynthStep(step: number) {
  if (!audioCtx) return;
  const now = audioCtx.currentTime;

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = step % 2 === 0 ? "triangle" : "sine";
  osc.frequency.setValueAtTime(BASS_NOTES[step % BASS_NOTES.length], now);

  gain.gain.setValueAtTime(0.001, now);
  gain.gain.exponentialRampToValueAtTime(step % 4 === 0 ? 0.075 : 0.035, now + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.19);

  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start(now);
  osc.stop(now + 0.2);

  if (step % 4 === 2) {
    const hat = audioCtx.createOscillator();
    const hatGain = audioCtx.createGain();
    hat.type = "square";
    hat.frequency.setValueAtTime(880, now);
    hatGain.gain.setValueAtTime(0.012, now);
    hatGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);
    hat.connect(hatGain);
    hatGain.connect(audioCtx.destination);
    hat.start(now);
    hat.stop(now + 0.045);
  }
}

export function startSoundcheckAudio(): boolean {
  if (typeof window === "undefined") return false;
  const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctx) return false;

  if (!audioCtx) {
    audioCtx = new Ctx();
  }
  if (audioCtx.state === "suspended") {
    void audioCtx.resume();
  }

  if (isPlaying) return true;
  isPlaying = true;
  activeStep = 0;

  playSynthStep(activeStep);
  listeners.forEach((fn) => fn(activeStep));

  timerId = window.setInterval(() => {
    activeStep = (activeStep + 1) % 8;
    playSynthStep(activeStep);
    listeners.forEach((fn) => fn(activeStep));
  }, STEP_MS);

  return true;
}

export function stopSoundcheckAudio(): void {
  isPlaying = false;
  if (timerId !== null) {
    window.clearInterval(timerId);
    timerId = null;
  }
  listeners.forEach((fn) => fn(-1));
}

export function subscribeSoundcheckBeat(listener: BeatListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

