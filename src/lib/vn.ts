// Vietnamese number words and small helpers.
import { KID } from "./kid";
export const SO = ["không", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín", "mười"];

export const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

export const PRAISE = [
  "Đúng rồi! Giỏi quá!",
  "Tuyệt vời!",
  "Con giỏi lắm!",
  "Chính xác! Hoan hô!",
  "Đúng rồi! Gấu thích quá!",
  `${KID.name} giỏi lắm!`,
  `Hoan hô ${KID.name}!`,
];

export function pick<T>(a: readonly T[]): T {
  return a[Math.floor(Math.random() * a.length)];
}

export function shuffle<T>(a: readonly T[]): T[] {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
}
