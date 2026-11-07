import type { WeekDef } from "../types";

// Source: "K1 - Toan - Tuan 1" (17/08–21/08/2026)
// C1 khoanh số đúng (0–5, có ô trống = 0) · C2 dây cờ chấm tròn → số · C3 dãy số 0→5, 5→0
// C4 tô màu theo yêu cầu (Số 1 màu vàng…) · C5 đếm dâu rồi nối với số · C6 tô màu n quả · C7 đếm trong tranh
export const tuan01: WeekDef = {
  subject: "toan",
  id: 1,
  title: "Tuần 1",
  topic: "Các số 0, 1, 2, 3, 4, 5",
  dates: "17/08 – 21/08",
  color: "#ffd180",
  dark: "#e08a00",
  lessons: [
    {
      id: "t1-l1",
      title: "Đếm đến 5",
      icon: "🐱",
      goal: "Đếm từng con. Không có con nào là số 0.",
      demo: { kind: "count", min: 1, max: 5 },
      practice: [
        { kind: "count", min: 1, max: 3 },
        { kind: "count", min: 2, max: 5 },
        { kind: "count", min: 0, max: 5 },
        { kind: "basket", min: 1, max: 5 },
        { kind: "count", min: 0, max: 5 },
      ],
    },
    {
      id: "t1-l2",
      title: "Chấm tròn",
      icon: "🎲",
      goal: "Nhìn các chấm tròn, nói nhanh có mấy chấm.",
      demo: { kind: "count", dice: true, min: 3, max: 5 },
      practice: [
        { kind: "count", dice: true, min: 1, max: 3 },
        { kind: "count", dice: true, min: 2, max: 5 },
        { kind: "count", dice: true, min: 1, max: 5 },
        { kind: "count", dice: true, min: 3, max: 5 },
        { kind: "count", dice: true, min: 1, max: 5 },
      ],
    },
    {
      id: "t1-l3",
      title: "Dãy số 0 → 5",
      icon: "🐝",
      goal: "Đếm xuôi 0, 1, 2, 3, 4, 5 và đếm ngược 5, 4, 3, 2, 1, 0.",
      demo: { kind: "sequence", dir: "up", style: "train", blanks: 2, to: 5 },
      practice: [
        { kind: "sequence", dir: "up", style: "train", blanks: 2, to: 5 },
        { kind: "sequence", dir: "up", style: "flags", blanks: 3, to: 5 },
        { kind: "sequence", dir: "down", style: "train", blanks: 2, to: 5 },
        { kind: "sequence", dir: "down", style: "flags", blanks: 3, to: 5 },
        { kind: "sequence", dir: "up", style: "train", blanks: 3, to: 5 },
      ],
    },
    {
      id: "t1-l4",
      title: "Tô màu theo số",
      icon: "🌈",
      goal: "Đọc số rồi tô đúng số hình, đúng màu.",
      demo: { kind: "color-n", min: 2, max: 4 },
      practice: [
        { kind: "color-n", min: 1, max: 3 },
        { kind: "color-legend" },
        { kind: "color-n", min: 2, max: 5 },
        { kind: "color-legend" },
        { kind: "color-n", min: 1, max: 5 },
      ],
    },
    {
      id: "t1-l5",
      title: "Đếm rồi nối",
      icon: "🍓",
      goal: "Đếm từng nhóm, rồi nối với số đúng.",
      demo: { kind: "match", pairs: 3, min: 1, max: 5 },
      practice: [
        { kind: "match", pairs: 3, min: 1, max: 5 },
        { kind: "scene-count", max: 5 },
        { kind: "match", pairs: 4, min: 1, max: 5 },
        { kind: "scene-count", max: 5 },
        { kind: "match", pairs: 5, min: 1, max: 5 },
      ],
    },
  ],
  worksheet: [
    { kind: "count", min: 0, max: 5 },
    { kind: "count", min: 0, max: 5 },
    { kind: "count", dice: true, min: 1, max: 5 },
    { kind: "sequence", dir: "up", style: "train", blanks: 3, to: 5 },
    { kind: "sequence", dir: "down", style: "train", blanks: 3, to: 5 },
    { kind: "color-legend" },
    { kind: "match", pairs: 5, min: 1, max: 5 },
    { kind: "color-n", min: 1, max: 4 },
    { kind: "scene-count", max: 5 },
  ],
};
