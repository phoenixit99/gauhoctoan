import type { WeekDef } from "../../types";

// Source: "K1-TV-TUẦN 4" (07/09–11/09/2026)
// TN C1 tiếng có âm kh (khỉ / cam / ô) · C2 hình đúng với "hổ dữ" (nho / hổ / nhà) · C3 tiếng có âm h (gấu / mắt / hoa)
// C4 đọc và nối (kì đà, bí đỏ, lá khô, lá chè) · TL C1 điền i/u/ư (dù, đi bộ, đu đủ) · C2 điền k/ch/kh (kệ, cá khô, khỉ)
// Tập viết: chú khỉ, đi chợ, cá khô, lừ đừ
export const tv04: WeekDef = {
  subject: "tv",
  id: 4,
  title: "Tuần 4",
  topic: "Âm i, u, ư, h, k, kh, ch",
  dates: "07/09 – 11/09",
  color: "#e1bee7",
  dark: "#7b1fa2",
  lessons: [
    {
      id: "tv4-l1",
      title: "Đọc i, u, ư, h, k, kh, ch",
      icon: "🔤",
      goal: "Nghe Gấu đánh vần, rồi đọc theo.",
      demo: { kind: "tv-read", items: ["kh", "khỉ", "h", "hổ"] },
      practice: [
        { kind: "tv-read", items: ["i", "u", "ư", "h", "k", "kh", "ch"] },
        { kind: "tv-read", items: ["kì đà", "bí đỏ", "lá khô", "lá chè"] },
        { kind: "tv-read", items: ["hổ dữ", "đi chợ", "chú khỉ", "cá khô", "lừ đừ"] },
        { kind: "tv-word-pic", words: ["hổ dữ", "khỉ", "chó", "kì đà"] },
        { kind: "tv-sound", sounds: ["kh", "h", "ch"] },
      ],
    },
    {
      id: "tv4-l2",
      title: "Tìm âm h, kh",
      icon: "🔎",
      goal: "Nghe âm. Nói tên hình. Chọn hình có âm đó.",
      demo: { kind: "tv-sound", sounds: ["kh"] },
      practice: [
        { kind: "tv-sound", sounds: ["kh"] },
        { kind: "tv-sound", sounds: ["h"] },
        { kind: "tv-word-pic", words: ["hổ dữ", "khỉ", "kì đà", "bí đỏ"] },
        { kind: "tv-sound", sounds: ["ch"] },
        { kind: "tv-sound-all", sounds: ["h", "kh"] },
      ],
    },
    {
      id: "tv4-l3",
      title: "Điền âm còn thiếu",
      icon: "🧩",
      goal: "Đánh vần tiếng. Chọn chữ còn thiếu.",
      demo: { kind: "tv-fill", letters: ["k", "ch", "kh"], words: ["khỉ"] },
      practice: [
        { kind: "tv-fill", letters: ["i", "u", "ư"], words: ["dù", "đi bộ", "sư tử", "khỉ", "cú"] },
        { kind: "tv-fill", letters: ["k", "ch", "kh"], words: ["khỉ", "kéo", "chó", "chè", "kẹo", "lá khô"] },
        { kind: "tv-fill", letters: ["i", "u", "ư"], words: ["dù", "đi bộ", "sư tử", "khỉ", "cú"] },
        { kind: "tv-fill", letters: ["k", "ch", "kh"], words: ["khỉ", "kéo", "chó", "chè", "kẹo", "lá khô"] },
        { kind: "tv-fill", letters: ["k", "ch", "kh"], words: ["khỉ", "kéo", "chó", "chè", "kẹo", "lá khô"] },
      ],
    },
    {
      id: "tv4-l4",
      title: "Đọc nối, tập viết",
      icon: "🔗",
      goal: "Đọc chữ, nối với hình. Ghép âm để viết.",
      demo: { kind: "tv-match", words: ["kì đà", "bí đỏ", "lá khô", "lá chè"] },
      practice: [
        { kind: "tv-match", words: ["kì đà", "bí đỏ", "lá khô", "lá chè"] },
        { kind: "tv-spell", words: ["chú khỉ"], model: true, letters: ["ch", "kh", "k", "c"] },
        { kind: "tv-spell", words: ["đi chợ"], model: true, letters: ["đ", "d", "ch", "kh"] },
        { kind: "tv-spell", words: ["cá khô"], model: true, letters: ["c", "k", "kh", "ch"] },
        { kind: "tv-spell", words: ["lừ đừ"], model: true, letters: ["l", "đ", "d", "h"] },
      ],
    },
  ],
  worksheet: [
    { kind: "tv-sound", sounds: ["kh"] },
    { kind: "tv-word-pic", words: ["hổ dữ"] },
    { kind: "tv-sound", sounds: ["h"] },
    { kind: "tv-match", words: ["kì đà", "bí đỏ", "lá khô", "lá chè"] },
    { kind: "tv-fill", letters: ["i", "u", "ư"], words: ["dù"] },
    { kind: "tv-fill", letters: ["i", "u", "ư"], words: ["đi bộ"] },
    { kind: "tv-fill", letters: ["i", "u", "ư"], words: ["sư tử", "cú"] },
    { kind: "tv-fill", letters: ["k", "ch", "kh"], words: ["kéo", "kẹo"] },
    { kind: "tv-fill", letters: ["k", "ch", "kh"], words: ["lá khô"] },
    { kind: "tv-fill", letters: ["k", "ch", "kh"], words: ["khỉ"] },
    { kind: "tv-spell", words: ["chú khỉ", "đi chợ", "cá khô", "lừ đừ"], model: true, letters: ["ch", "kh", "k", "đ", "l", "c"] },
  ],
};
