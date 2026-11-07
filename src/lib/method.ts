"use client";
import { create } from "zustand";

/** Which method step is lit up right now (-1 = none). Set by the bear's walkthrough and hints. */
export const useMethodStep = create<{ active: number }>(() => ({ active: -1 }));

export const setMethodStep = (active: number) => useMethodStep.setState({ active });
