// Rewards the child picks after finishing a lesson or worksheet.
export type Sticker = { emoji: string; name: string };

export const STICKERS: Sticker[] = [
  { emoji: "🦁", name: "con sư tử" },
  { emoji: "🐯", name: "con hổ" },
  { emoji: "🐼", name: "con gấu trúc" },
  { emoji: "🐨", name: "con gấu túi" },
  { emoji: "🐸", name: "con ếch" },
  { emoji: "🐵", name: "con khỉ" },
  { emoji: "🦄", name: "con kỳ lân" },
  { emoji: "🐙", name: "con bạch tuộc" },
  { emoji: "🐬", name: "con cá heo" },
  { emoji: "🦒", name: "con hươu cao cổ" },
  { emoji: "🦖", name: "con khủng long" },
  { emoji: "🐘", name: "con voi" },
  { emoji: "🚀", name: "tên lửa" },
  { emoji: "🚒", name: "xe cứu hỏa" },
  { emoji: "🚂", name: "tàu hỏa" },
  { emoji: "🚁", name: "máy bay trực thăng" },
  { emoji: "🌈", name: "cầu vồng" },
  { emoji: "🎈", name: "quả bóng bay" },
  { emoji: "🍉", name: "miếng dưa hấu" },
  { emoji: "⚽", name: "quả bóng" },
];

/** n stickers to choose from, preferring ones the child does not have yet. */
export function pickStickers(owned: string[], n: number): Sticker[] {
  const fresh = STICKERS.filter((s) => !owned.includes(s.emoji));
  const pool = fresh.length >= n ? fresh : STICKERS;
  return [...pool].sort(() => Math.random() - 0.5).slice(0, n);
}

export const stickerName = (emoji: string) => STICKERS.find((s) => s.emoji === emoji)?.name ?? "";
