// Small shared helpers for the Toán generators (generate.ts, generateMore.ts).
import type { Group } from "./types";
import type { Obj } from "./objects";
import { shuffle } from "@/lib/vn";

/** Random integer in [a, b]. */
export const rnd = (a: number, b: number) => a + Math.floor(Math.random() * (b - a + 1));

export const LETTERS = ["A", "B", "C", "D"];
export const SIGN_WORD: Record<string, string> = { ">": "lớn hơn", "<": "bé hơn", "=": "bằng" };

export const signOf = (a: number, b: number) => (a > b ? ">" : a < b ? "<" : "=");

/** Three distinct numbers within [lo, hi] including n, sorted ascending (like A/B/C on paper). */
export function abc(n: number, lo: number, hi: number): number[] {
  const pool: number[] = [];
  for (let v = lo; v <= hi; v++) if (v !== n) pool.push(v);
  const near = shuffle(pool)
    .sort((x, y) => Math.abs(x - n) - Math.abs(y - n))
    .slice(0, 4);
  return [n, ...shuffle(near).slice(0, 2)].sort((x, y) => x - y);
}

export const g = (o: Obj, n: number): Group => ({ emoji: o.emoji, name: o.name, n });

// ---- Walkthrough phrases (literal, same wording every time) ----
export const blocks = (n: number) => (n === 0 ? "Số 0: không có khối nào." : `Gấu xếp ${n} khối.`);
export const compareTowers = (a: number, b: number) =>
  a === b ? `Hai tháp cao bằng nhau. ${a} bằng ${b}.` : `Tháp số ${Math.max(a, b)} cao hơn. ${Math.max(a, b)} lớn hơn ${Math.min(a, b)}.`;
export const compareNums = (a: number, b: number) => (a === b ? `${a} bằng ${b}.` : `${Math.max(a, b)} lớn hơn ${Math.min(a, b)}.`);
export const pointSign = (a: number, b: number) =>
  a === b
    ? `Hai số bằng nhau. Mình chọn dấu bằng. ${a} bằng ${b}.`
    : `Đầu nhọn chỉ vào số bé hơn, là số ${Math.min(a, b)}. Mình chọn dấu ${SIGN_WORD[signOf(a, b)]}. ${a} ${SIGN_WORD[signOf(a, b)]} ${b}.`;

/**
 * Text with math symbols → what Gấu says. Vietnamese voices read "+ − = ☐" badly,
 * so every spoken line goes through this ("3 + 2 = ☐" → "3 cộng 2 bằng ô trống").
 */
export function spoken(s: string): string {
  return s
    .replace(/\s*\+\s*/g, " cộng ")
    .replace(/\s*[−-]\s*(?=\d|☐)/g, " trừ ")
    .replace(/\s*=\s*/g, " bằng ")
    .replace(/\s*>\s*/g, " lớn hơn ")
    .replace(/\s*<\s*/g, " bé hơn ")
    .replace(/☐/g, "ô trống")
    .replace(/\s+/g, " ")
    .trim();
}

/** A walk step written with symbols: shown as written, spoken in words. */
export const st = (text: string, extra: Record<string, unknown> = {}) => ({ say: spoken(text), caption: text, ...extra });
