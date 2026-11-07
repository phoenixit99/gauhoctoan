// Things children count. `name` includes the Vietnamese classifier (con, quả, bông…).
export type Obj = { emoji: string; name: string };

export const ANIMALS: Obj[] = [
  { emoji: "🐰", name: "con thỏ" },
  { emoji: "🦆", name: "con vịt" },
  { emoji: "🐔", name: "con gà" },
  { emoji: "🐱", name: "con mèo" },
  { emoji: "🐶", name: "con chó" },
  { emoji: "🧸", name: "con gấu" },
  { emoji: "🐟", name: "con cá" },
  { emoji: "🐦", name: "con chim" },
  { emoji: "🐥", name: "con gà con" },
  { emoji: "🦋", name: "con bướm" },
  { emoji: "🐛", name: "con sâu" },
  { emoji: "🐝", name: "con ong" },
];

export const FRUITS: Obj[] = [
  { emoji: "🍓", name: "quả dâu" },
  { emoji: "🍎", name: "quả táo" },
  { emoji: "🍌", name: "quả chuối" },
  { emoji: "🍐", name: "quả lê" },
  { emoji: "🍊", name: "quả cam" },
  { emoji: "🍉", name: "miếng dưa hấu" },
  { emoji: "🍍", name: "quả dứa" },
  { emoji: "🥑", name: "quả bơ" },
  { emoji: "🍅", name: "quả cà chua" },
  { emoji: "🍇", name: "chùm nho" },
];

export const THINGS: Obj[] = [
  { emoji: "🌸", name: "bông hoa" },
  { emoji: "🍃", name: "chiếc lá" },
  { emoji: "⭐", name: "ngôi sao" },
  { emoji: "🎈", name: "quả bóng bay" },
  { emoji: "🍦", name: "cây kem" },
  { emoji: "🌙", name: "mặt trăng" },
  { emoji: "💧", name: "giọt nước" },
  { emoji: "☁️", name: "đám mây" },
  { emoji: "🌈", name: "cầu vồng" },
  { emoji: "🚗", name: "chiếc ô tô" },
];

export const ALL_OBJS = [...ANIMALS, ...FRUITS, ...THINGS];

/** Pairs used for "two colours / two kinds" questions. */
export const COLOR_PAIRS: [Obj, Obj][] = [
  [
    { emoji: "🍏", name: "quả màu xanh" },
    { emoji: "🍋", name: "quả màu vàng" },
  ],
  [
    { emoji: "🔵", name: "hạt màu xanh" },
    { emoji: "🔴", name: "hạt màu đỏ" },
  ],
  [
    { emoji: "🟩", name: "khối màu xanh" },
    { emoji: "🟨", name: "khối màu vàng" },
  ],
];

export const VEHICLES: Obj[] = [
  { emoji: "🚗", name: "chiếc ô tô" },
  { emoji: "🚌", name: "chiếc xe buýt" },
  { emoji: "🚲", name: "chiếc xe đạp" },
  { emoji: "✈️", name: "chiếc máy bay" },
  { emoji: "🚂", name: "chiếc tàu hỏa" },
  { emoji: "🚁", name: "chiếc trực thăng" },
  { emoji: "🚜", name: "chiếc máy cày" },
  { emoji: "🚒", name: "chiếc xe cứu hỏa" },
  { emoji: "🛵", name: "chiếc xe máy" },
  { emoji: "⛵", name: "chiếc thuyền" },
];

/**
 * Theme pools the parent (or child) can choose. Each needs at least 4 different objects
 * (match uses 4, scene-count 3, comparisons 2), and every name needs its classifier (con, quả, chiếc…).
 */
export const THEME_POOLS: Record<"animals" | "fruits" | "vehicles", Obj[]> = { animals: ANIMALS, fruits: FRUITS, vehicles: VEHICLES };

/**
 * The objects one question may use.
 * - theme "mix": the kind's own pool; otherwise the theme's pool.
 * - fixed (the child has not mastered this kind yet): only the first `need` objects, so the
 *   pictures stay the same every time. Once mastered, objects vary (generalisation).
 */
export function objectPool(base: Obj[], need: number, fixed: boolean, theme: "mix" | keyof typeof THEME_POOLS): Obj[] {
  const pool = theme === "mix" ? base : THEME_POOLS[theme];
  return fixed ? pool.slice(0, need) : pool;
}
