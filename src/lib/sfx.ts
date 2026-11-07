"use client";
// Tiny synthesized sound effects (no audio files needed). Volume comes from parent settings.
import { settings } from "./settings";
let ctx: AudioContext | null = null;

function ac(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const C =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!C) return null;
    ctx = new C();
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function tone(freq: number, dur: number, type: OscillatorType = "sine", when = 0, gain = 0.15) {
  const vol = settings().sfxVolume;
  if (vol <= 0) return;
  const c = ac();
  if (!c) return;
  gain *= vol;
  const t = c.currentTime + when;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(gain, t + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(c.destination);
  o.start(t);
  o.stop(t + dur + 0.05);
}

export const sfx = {
  unlock: () => void ac(),
  pop: () => {
    tone(620, 0.09, "triangle");
    tone(930, 0.08, "triangle", 0.05);
  },
  ding: () => [523, 659, 784, 1046].forEach((f, i) => tone(f, 0.25, "sine", i * 0.08, 0.12)),
  soft: () => {
    tone(330, 0.18, "sine", 0, 0.1);
    tone(262, 0.22, "sine", 0.14, 0.1);
  },
  star: () => [784, 1046, 1318].forEach((f, i) => tone(f, 0.3, "triangle", i * 0.06, 0.1)),
  tap: () => tone(500, 0.06, "triangle", 0, 0.08),
};
