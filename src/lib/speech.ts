"use client";
// One place for every spoken prompt. Uses the browser's Vietnamese voice when
// available; otherwise it shows the caption only. Later, recorded clips (e.g. a
// parent's voice) can be plugged in here without touching lesson code.
import { create } from "zustand";
import { settings, type TalkLevel } from "./settings";
import { waitUnpaused } from "./pause";

type CaptionState = { text: string; spoken: string; speaking: boolean };
export const useCaption = create<CaptionState>(() => ({ text: "", spoken: "", speaking: false }));

let voice: SpeechSynthesisVoice | null | undefined;
let token = 0;

const supported = () => typeof window !== "undefined" && "speechSynthesis" in window;

function pickVoice(): SpeechSynthesisVoice | null {
  if (!supported()) return null;
  const vs = window.speechSynthesis.getVoices();
  return vs.find((v) => v.lang?.toLowerCase().replace("_", "-").startsWith("vi")) ?? null;
}

if (supported()) {
  window.speechSynthesis.onvoiceschanged = () => {
    voice = pickVoice();
  };
}

export function hasVietnameseVoice() {
  if (!voice) voice = pickVoice();
  return !!voice;
}

/**
 * What a line is for, so the parent's "Gấu nói" setting can silence the less needed ones:
 *  - q:      the question / what to do now (default)
 *  - help:   method steps, hints, walkthroughs, "Chưa đúng…"
 *  - praise: "Đúng rồi! … giỏi lắm"
 *  - echo:   repeating what the child just tapped (a number, a picture name)
 *  - chat:   greetings, navigation, rewards, small talk
 *  - asked:  the child or parent asked for it (🔊, a "tap to hear" card): always spoken
 */
export type Talk = "q" | "help" | "praise" | "echo" | "chat" | "asked";

const VOICED: Record<TalkLevel, Talk[]> = {
  full: ["q", "help", "praise", "echo", "chat", "asked"],
  less: ["q", "help", "praise", "echo", "asked"],
  min: ["q", "help", "asked"],
  off: ["asked"],
};

type SpeakOpts = { caption?: string; kind?: Talk };

/**
 * Speak Vietnamese text. Resolves when finished (or after an estimated time).
 * While the child is on a break (Nghỉ), it waits until the break ends, so a walkthrough
 * that is playing pauses instead of talking over the calm screen.
 */
export async function speak(text: string, opts: SpeakOpts = {}): Promise<void> {
  await waitUnpaused();
  return say(text, opts);
}

function say(text: string, opts: SpeakOpts): Promise<void> {
  const my = ++token;
  const { voiceRate, voiceVolume, talk } = settings();
  const kind = opts.kind ?? "q";
  const estimate = (700 + text.length * 75) * (0.92 / voiceRate);

  if (!VOICED[talk].includes(kind)) {
    if (supported()) window.speechSynthesis.cancel();
    // Silenced by the parent. Lesson lines (question, help) keep their caption and reading time,
    // so a walkthrough still moves at a pace the child can follow. Extra lines just show briefly.
    const essential = kind === "q" || kind === "help";
    useCaption.setState({ text: opts.caption ?? text, spoken: text, speaking: essential });
    return new Promise((resolve) =>
      setTimeout(
        () => {
          if (my === token && essential) useCaption.setState({ speaking: false });
          resolve();
        },
        essential ? estimate : Math.min(estimate, 900),
      ),
    );
  }

  useCaption.setState({ text: opts.caption ?? text, spoken: text, speaking: true });

  return new Promise((resolve) => {
    let finished = false;
    const fin = () => {
      if (finished) return;
      finished = true;
      if (my === token) useCaption.setState({ speaking: false });
      resolve();
    };

    if (!supported()) {
      setTimeout(fin, estimate);
      return;
    }
    if (!voice) voice = pickVoice();
    window.speechSynthesis.cancel();
    if (!voice) {
      // No Vietnamese voice: a foreign voice would mangle the words, so caption only.
      setTimeout(fin, estimate);
      return;
    }
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "vi-VN";
    u.voice = voice;
    u.rate = voiceRate;
    u.volume = voiceVolume;
    u.pitch = 1.15;
    u.onend = fin;
    u.onerror = fin;
    setTimeout(fin, estimate * 2 + 2500); // safety net for browsers that never fire onend
    window.speechSynthesis.speak(u);
  });
}

/** Speak right away, even during a break (used by the break screen itself). */
export const speakNow = (text: string, opts: SpeakOpts = {}) => say(text, opts);

export function stopSpeech() {
  token++;
  useCaption.setState({ speaking: false });
  if (supported()) window.speechSynthesis.cancel();
}

/** Must be called from a tap handler once, so iPad Safari allows audio. */
export function unlockSpeech() {
  if (!supported()) return;
  const u = new SpeechSynthesisUtterance(" ");
  u.volume = 0;
  window.speechSynthesis.speak(u);
}

/** Resolves once the bear is quiet (after the current sentence, if one is playing). */
export function afterSpeech(): Promise<void> {
  if (!useCaption.getState().speaking) return Promise.resolve();
  return new Promise((resolve) => {
    const off = useCaption.subscribe((s) => {
      if (!s.speaking) {
        off();
        resolve();
      }
    });
  });
}
