const SOUND_MUTE_KEY = "jevallene-sound-muted";

let audioCtx: AudioContext | null = null;
let noiseBuffer: AudioBuffer | null = null;
let lastSwingAt = 0;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const Ctx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!Ctx) return null;
  if (!audioCtx) {
    audioCtx = new Ctx();
  }
  if (audioCtx.state === "suspended") {
    void audioCtx.resume();
  }
  return audioCtx;
}

function getNoiseBuffer(ctx: AudioContext): AudioBuffer {
  if (noiseBuffer && noiseBuffer.sampleRate === ctx.sampleRate) {
    return noiseBuffer;
  }
  const length = Math.floor(ctx.sampleRate * 0.4);
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  noiseBuffer = buffer;
  return buffer;
}

export function isSoundMuted(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(SOUND_MUTE_KEY) === "true";
  } catch {
    return false;
  }
}

export function setSoundMuted(muted: boolean): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(SOUND_MUTE_KEY, muted ? "true" : "false");
  } catch {
    // Ignore storage errors
  }
}

/**
 * Playful water-droplet / bubble "bloop" click with slight random pitch variation.
 */
export function playClickSound(force = false): void {
  if (!force && isSoundMuted()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const pitchShift = 0.92 + Math.random() * 0.22; // playful organic variation

  // Bouncy upward bubble "bloop"
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(420 * pitchShift, now);
  osc.frequency.exponentialRampToValueAtTime(920 * pitchShift, now + 0.055);

  gain.gain.setValueAtTime(0.001, now);
  gain.gain.linearRampToValueAtTime(0.07, now + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.075);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.08);

  // Tiny crisp glass sparkle overtone
  const overtone = ctx.createOscillator();
  const overtoneGain = ctx.createGain();
  overtone.type = "triangle";
  overtone.frequency.setValueAtTime(1320 * pitchShift, now);
  overtone.frequency.exponentialRampToValueAtTime(1680 * pitchShift, now + 0.03);

  overtoneGain.gain.setValueAtTime(0.02, now);
  overtoneGain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

  overtone.connect(overtoneGain);
  overtoneGain.connect(ctx.destination);
  overtone.start(now);
  overtone.stop(now + 0.04);
}

/**
 * Elastic, slightly funny cartoon "boing-tug" when grabbing or pulling the lanyard.
 */
export function playLanyardGrabSound(): void {
  if (isSoundMuted()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // Rubber/springy boing
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "triangle";
  osc.frequency.setValueAtTime(165, now);
  osc.frequency.exponentialRampToValueAtTime(340, now + 0.05);
  osc.frequency.exponentialRampToValueAtTime(220, now + 0.11);

  gain.gain.setValueAtTime(0.001, now);
  gain.gain.linearRampToValueAtTime(0.085, now + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.125);

  // Subtle strap snap
  const noise = ctx.createBufferSource();
  noise.buffer = getNoiseBuffer(ctx);
  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.setValueAtTime(1400, now);
  filter.Q.setValueAtTime(1.6, now);

  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(0.03, now);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

  noise.connect(filter);
  filter.connect(noiseGain);
  noiseGain.connect(ctx.destination);
  noise.start(now);
  noise.stop(now + 0.05);
}

/**
 * Expressive airy "fwoosh-wheee" swing sound scaled by lanyard velocity.
 */
export function playLanyardSwingSound(intensity = 0.8): void {
  if (isSoundMuted()) return;
  const perfNow = performance.now();
  if (perfNow - lastSwingAt < 165) return;
  lastSwingAt = perfNow;

  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const level = Math.min(1.4, Math.max(0.3, intensity));
  const duration = 0.16 + level * 0.07;

  // Airy whoosh noise sweep
  const noise = ctx.createBufferSource();
  noise.buffer = getNoiseBuffer(ctx);

  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.Q.setValueAtTime(1.8, now);
  filter.frequency.setValueAtTime(320, now);
  filter.frequency.exponentialRampToValueAtTime(860 + level * 420, now + duration * 0.42);
  filter.frequency.exponentialRampToValueAtTime(260, now + duration);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.001, now);
  gain.gain.linearRampToValueAtTime(0.042 * level, now + duration * 0.3);
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  noise.start(now);
  noise.stop(now + duration + 0.01);

  // Playful soft "wheee" harmonic glide when swinging briskly
  if (level > 0.5) {
    const glide = ctx.createOscillator();
    const glideGain = ctx.createGain();
    glide.type = "sine";
    glide.frequency.setValueAtTime(280, now);
    glide.frequency.exponentialRampToValueAtTime(460 + level * 140, now + duration * 0.45);
    glide.frequency.exponentialRampToValueAtTime(250, now + duration);

    glideGain.gain.setValueAtTime(0.001, now);
    glideGain.gain.linearRampToValueAtTime(0.022 * level, now + duration * 0.32);
    glideGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    glide.connect(glideGain);
    glideGain.connect(ctx.destination);
    glide.start(now);
    glide.stop(now + duration + 0.01);
  }
}

/**
 * Smooth rocket ignition thump, rising thruster roar, and supersonic whoosh.
 */
export function playRocketLaunchSound(): void {
  if (isSoundMuted()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const duration = 1.25;

  // 1. Sub-bass ignition punch
  const thump = ctx.createOscillator();
  const thumpGain = ctx.createGain();
  thump.type = "sine";
  thump.frequency.setValueAtTime(125, now);
  thump.frequency.exponentialRampToValueAtTime(36, now + 0.24);

  thumpGain.gain.setValueAtTime(0.001, now);
  thumpGain.gain.linearRampToValueAtTime(0.18, now + 0.025);
  thumpGain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

  thump.connect(thumpGain);
  thumpGain.connect(ctx.destination);
  thump.start(now);
  thump.stop(now + 0.3);

  // 2. Looped filtered noise for rocket thruster roar & upward whoosh
  const noise = ctx.createBufferSource();
  noise.buffer = getNoiseBuffer(ctx);
  noise.loop = true;

  const roarFilter = ctx.createBiquadFilter();
  roarFilter.type = "bandpass";
  roarFilter.Q.setValueAtTime(0.95, now);
  roarFilter.frequency.setValueAtTime(160, now);
  roarFilter.frequency.exponentialRampToValueAtTime(1150, now + 0.55);
  roarFilter.frequency.exponentialRampToValueAtTime(380, now + duration);

  const roarGain = ctx.createGain();
  roarGain.gain.setValueAtTime(0.001, now);
  roarGain.gain.linearRampToValueAtTime(0.14, now + 0.14);
  roarGain.gain.setValueAtTime(0.13, now + 0.52);
  roarGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

  noise.connect(roarFilter);
  roarFilter.connect(roarGain);
  roarGain.connect(ctx.destination);
  noise.start(now);
  noise.stop(now + duration + 0.02);

  // 3. Rising futuristic turbine / plasma sweep
  const turbine = ctx.createOscillator();
  const turbineFilter = ctx.createBiquadFilter();
  const turbineGain = ctx.createGain();

  turbine.type = "sawtooth";
  turbine.frequency.setValueAtTime(62, now);
  turbine.frequency.exponentialRampToValueAtTime(460, now + 0.92);

  turbineFilter.type = "lowpass";
  turbineFilter.frequency.setValueAtTime(220, now);
  turbineFilter.frequency.exponentialRampToValueAtTime(1400, now + 0.65);
  turbineFilter.frequency.exponentialRampToValueAtTime(520, now + 1.05);

  turbineGain.gain.setValueAtTime(0.001, now);
  turbineGain.gain.linearRampToValueAtTime(0.045, now + 0.12);
  turbineGain.gain.exponentialRampToValueAtTime(0.001, now + 1.02);

  turbine.connect(turbineFilter);
  turbineFilter.connect(turbineGain);
  turbineGain.connect(ctx.destination);
  turbine.start(now);
  turbine.stop(now + 1.05);
}
