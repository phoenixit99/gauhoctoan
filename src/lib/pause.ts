"use client";
// The child's break (nút Nghỉ). While paused, spoken prompts and idle hints wait.
import { create } from "zustand";

export const usePause = create<{ paused: boolean }>(() => ({ paused: false }));

const waiters: (() => void)[] = [];

export function setPaused(paused: boolean) {
  usePause.setState({ paused });
  if (!paused) waiters.splice(0).forEach((w) => w());
}

/** Resolves immediately, or when the break ends. */
export function waitUnpaused(): Promise<void> {
  if (!usePause.getState().paused) return Promise.resolve();
  return new Promise((r) => waiters.push(r));
}
