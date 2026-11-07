"use client";
// Learning time in this session (counted only inside lessons, not during a break).
import { create } from "zustand";

export const useSession = create<{ learnedMs: number; timeUp: boolean }>(() => ({ learnedMs: 0, timeUp: false }));

export const isTimeUp = () => useSession.getState().timeUp;

/** Parent gives more time: the limit starts counting again from now. */
export const extendSession = () => useSession.setState({ learnedMs: 0, timeUp: false });
