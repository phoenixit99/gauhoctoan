"use client";
// Parent settings (sensory, hints, session length, theme). Stored separately from the
// child's progress so "xoá tiến độ" never wipes them.
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Theme = "mix" | "animals" | "fruits" | "vehicles";

export type Settings = {
  sfxVolume: number; // 0 = off … 1 = full (sound effects only, not the bear's voice)
  voiceVolume: number; // 0.2 … 1
  voiceRate: number; // 0.6 (slow) … 1
  reduceMotion: boolean; // no bouncing, spinning or shaking
  no3D: boolean; // flat 2D screens instead of the 3D school and orchard
  softColors: boolean; // calmer, less saturated colours
  celebrate: boolean; // confetti after a right answer (off by default: it can be too much)
  autoHintSec: number; // seconds without a tap before the bear helps (0 = off)
  sessionMin: number; // learning time per session in minutes (0 = no limit)
  theme: Theme; // objects the child likes to count
  unlockAll: boolean; // open every lesson (to preview tomorrow's worksheet)
};

export const DEFAULT_SETTINGS: Settings = {
  sfxVolume: 0.6,
  voiceVolume: 1,
  voiceRate: 0.92,
  reduceMotion: false,
  no3D: false,
  softColors: false,
  celebrate: false,
  autoHintSec: 7,
  sessionMin: 0,
  theme: "mix",
  unlockAll: false,
};

type SettingsState = Settings & { set: (patch: Partial<Settings>) => void; reset: () => void };

export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      ...DEFAULT_SETTINGS,
      set: (patch) => set(patch),
      reset: () => set(DEFAULT_SETTINGS),
    }),
    { name: "gau-hoc-toan-settings" },
  ),
);

export const settings = () => useSettings.getState();
