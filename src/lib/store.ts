"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Mistake = { item: string; kind: string; at: number };

/**
 * One finished question. `wrongs` = wrong taps before the right answer.
 * `help` = help the bear gave without a mistake (0 none · 1 step lit · 2 step said · 3 more help after waiting).
 */
export type Attempt = { item: string; kind: string; wrongs: number; help: number; at: number };

/** Where the child stopped inside a lesson or worksheet (so leaving early loses nothing). */
export type Resume = { done: number; score: number };

/** How much help the bear gives at the start of a question of this kind: 2 → 1 → 0 as the child succeeds. */
export type Support = 0 | 1 | 2;

/** A kind is "đã thuộc" when the last MASTERY_RUN attempts were right with no help at all. */
export const MASTERY_RUN = 3;

export function isMastered(attempts: Attempt[], kind: string) {
  const mine = attempts.filter((a) => a.kind === kind).slice(-MASTERY_RUN);
  return mine.length === MASTERY_RUN && mine.every((a) => a.wrongs === 0 && a.help === 0);
}

type ProgressState = {
  stars: Record<string, number>; // lesson/worksheet id -> best stars (1..3), shown to parents only
  review: Record<string, boolean>; // id -> needs review (last result < 2 stars)
  mistakes: Mistake[];
  attempts: Attempt[];
  support: Record<string, Support>; // kind -> starting help level
  resume: Record<string, Resume>;
  stickers: string[]; // the child's sticker album
  lastWeek: number | null;
  finish: (id: string, stars: number) => void;
  logMistake: (m: Omit<Mistake, "at">) => void;
  logAttempt: (a: Omit<Attempt, "at">) => void;
  setSupport: (kind: string, s: Support) => void;
  saveResume: (id: string, r: Resume | null) => void;
  addSticker: (s: string) => void;
  setLastWeek: (w: number) => void;
  resetAll: () => void;
};

export const useProgress = create<ProgressState>()(
  persist(
    (set) => ({
      stars: {},
      review: {},
      mistakes: [],
      attempts: [],
      support: {},
      resume: {},
      stickers: [],
      lastWeek: null,
      finish: (id, s) =>
        set((st) => {
          const resume = { ...st.resume };
          delete resume[id];
          return {
            stars: { ...st.stars, [id]: Math.max(st.stars[id] ?? 0, s) },
            review: { ...st.review, [id]: s < 2 },
            resume,
          };
        }),
      logMistake: (m) => set((st) => ({ mistakes: [...st.mistakes.slice(-299), { ...m, at: Date.now() }] })),
      logAttempt: (a) => set((st) => ({ attempts: [...st.attempts.slice(-499), { ...a, at: Date.now() }] })),
      setSupport: (kind, s) => set((st) => ({ support: { ...st.support, [kind]: s } })),
      saveResume: (id, r) =>
        set((st) => {
          const resume = { ...st.resume };
          if (r) resume[id] = r;
          else delete resume[id];
          return { resume };
        }),
      addSticker: (s) => set((st) => ({ stickers: [...st.stickers, s] })),
      setLastWeek: (w) => set({ lastWeek: w }),
      resetAll: () => set({ stars: {}, review: {}, mistakes: [], attempts: [], support: {}, resume: {}, stickers: [], lastWeek: null }),
    }),
    { name: "gau-hoc-toan-v2" },
  ),
);
