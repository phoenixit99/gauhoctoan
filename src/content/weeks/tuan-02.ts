import type { WeekDef } from "../types";

// Source: "K1 - TOÁN - TUẦN 2" (24/08–28/08/2026)
// Câu TN1 đếm thỏ (A/B/C) · TN2 để có 10 cần thêm · TL1 đoàn tàu 0→10, dây cờ 10→0
// TL2 đếm số lượng trong tranh · TL3 nối nhóm với số (6–10)
export const tuan02: WeekDef = {
  subject: "toan",
  id: 2,
  title: "Tuần 2",
  topic: "Các số từ 0 đến 10",
  dates: "24/08 – 28/08",
  color: "#8fd16a",
  dark: "#4f9a35",
  lessons: [
    {
      id: "t2-l1",
      title: "Đếm đến 10",
      icon: "🍎",
      goal: "Đếm từng quả, mỗi quả chỉ đếm một lần.",
      play: "orchard",
      demo: { kind: "count", min: 6, max: 9 },
      practice: [
        { kind: "basket", min: 3, max: 7 },
        { kind: "count", min: 4, max: 10 },
        { kind: "basket", min: 6, max: 10 },
        { kind: "count", min: 6, max: 10 },
        { kind: "count", min: 6, max: 10 },
      ],
    },
    {
      id: "t2-l2",
      title: "Dãy số 0 → 10",
      icon: "🚂",
      goal: "Đếm xuôi từ 0 đến 10 và đếm ngược từ 10 về 0.",
      demo: { kind: "sequence", dir: "up", style: "train", blanks: 3 },
      practice: [
        { kind: "sequence", dir: "up", style: "train", blanks: 3 },
        { kind: "sequence", dir: "up", style: "train", blanks: 5 },
        { kind: "sequence", dir: "down", style: "flags", blanks: 3 },
        { kind: "sequence", dir: "down", style: "flags", blanks: 5 },
        { kind: "sequence", dir: "up", style: "flags", blanks: 5 },
      ],
    },
    {
      id: "t2-l3",
      title: "Đếm trong tranh",
      icon: "🦆",
      goal: "Trong tranh có nhiều loại, chỉ đếm đúng một loại.",
      demo: { kind: "scene-count" },
      practice: [
        { kind: "scene-count" },
        { kind: "scene-count" },
        { kind: "match", pairs: 3 },
        { kind: "scene-count" },
        { kind: "match", pairs: 4 },
      ],
    },
    {
      id: "t2-l4",
      title: "Thêm cho đủ 10",
      icon: "🍓",
      goal: "Đã có mấy, đếm tiếp đến 10 để biết cần thêm mấy.",
      demo: { kind: "make10", min: 6, max: 8 },
      practice: [
        { kind: "make10", min: 7, max: 9 },
        { kind: "make10", min: 6, max: 8 },
        { kind: "make10", min: 5, max: 8 },
        { kind: "make10", min: 4, max: 7 },
        { kind: "make10", min: 4, max: 9 },
      ],
    },
  ],
  worksheet: [
    { kind: "count", min: 4, max: 9 },
    { kind: "make10", min: 4, max: 8 },
    { kind: "sequence", dir: "up", style: "train", blanks: 5 },
    { kind: "sequence", dir: "down", style: "flags", blanks: 5 },
    { kind: "scene-count" },
    { kind: "scene-count" },
    { kind: "match", pairs: 5 },
  ],
};
