"use client";
// The child using the app: name and boy/girl, set by a parent on first launch and saved on this device.
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Gender = "boy" | "girl";

type KidState = {
  name: string; // "" until a parent fills in the setup screen
  gender: Gender;
  setKid: (name: string, gender: Gender) => void;
};

export const NAME_MAX = 20;

export const useKid = create<KidState>()(
  persist(
    (set) => ({
      name: "",
      gender: "boy",
      setKid: (name, gender) => set({ name: name.trim().slice(0, NAME_MAX), gender }),
    }),
    { name: "gau-hoc-toan-kid" },
  ),
);

/**
 * Read at the moment a line is spoken or a screen is drawn, so a new name shows up everywhere.
 * Screens are remounted after the setup screen, so plain reads (no hook) stay current.
 */
export const KID = {
  get name() {
    return useKid.getState().name || "Con";
  },
  get gender() {
    return useKid.getState().gender;
  },
};
