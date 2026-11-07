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
