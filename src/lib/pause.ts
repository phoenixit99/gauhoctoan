"use client";
// The child's break (nút Nghỉ). While paused, spoken prompts and idle hints wait.
import { create } from "zustand";

export const usePause = create<{ paused: boolean }>(() => ({ paused: false }));

const waiters: (() => void)[] = [];

/** Returns how many paused prompts were waiting (they continue now). */
export function setPaused(paused: boolean): number {
  usePause.setState({ paused });
  if (paused) return 0;
  const ws = waiters.splice(0);
  ws.forEach((w) => w());
  return ws.length;
}

/** Resolves immediately, or when the break ends. */
export function waitUnpaused(): Promise<void> {
  if (!usePause.getState().paused) return Promise.resolve();
  return new Promise((r) => waiters.push(r));
}
