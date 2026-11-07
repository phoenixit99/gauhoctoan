import type { WeekDef } from "../types";

// Source: "K1 - Toan - Tuan 6" (21/09–25/09/2026)
// C1 đếm sâu trên lá (có lá 0 con) · C2 đoàn tàu: số còn thiếu (xuôi, ngược) · C3 Đúng / Sai: 8 > 9, 3 = 3…
// C4 3 gồm 2 và 1 (theo tranh) · C5 tô quả táo ghi số lớn nhất / bé nhất · C6 đếm từng loại trong tranh
export const tuan06: WeekDef = {
  subject: "toan",
  id: 6,
  title: "Tuần 6",
  topic: "Ôn các số từ 0 đến 10. Lớn nhất, bé nhất",
  dates: "21/09 – 25/09",
  color: "#b2dfdb",
  dark: "#00796b",
  lessons: [
    {
      id: "t6-l1",
      title: "Đếm và dãy số",
      icon: "🐛",
      goal: "Đếm từng hình. Không có hình nào là số 0.",
      demo: { kind: "count", min: 0, max: 6 },
      practice: [
        { kind: "count", min: 0, max: 10 },
        { kind: "sequence", dir: "up", style: "train", blanks: 6 },
        { kind: "count", min: 0, max: 10 },
        { kind: "sequence", dir: "down", style: "train", blanks: 6 },
        { kind: "scene-count", max: 9 },
      ],
    },
    {
      id: "t6-l2",
      title: "Đúng hay sai",
      icon: "✅",
      goal: "Xếp khối trên hai số. Xem dấu có đúng không.",
      demo: { kind: "num-tf", max: 5 },
      practice: [{ kind: "num-tf", max: 5 }, { kind: "num-tf", max: 10 }, { kind: "num-tf", max: 10 }, { kind: "num-tf", max: 10 }, { kind: "num-tf", max: 10 }],
    },
    {
      id: "t6-l3",
      title: "Gồm mấy và mấy",
      icon: "🧒",
      goal: "Đếm nhóm thứ nhất. Đếm nhóm còn lại.",
      demo: { kind: "bond", mode: "split", min: 3, max: 3, pictures: true },
      practice: [
        { kind: "bond", mode: "split", min: 3, max: 5, pictures: true },
        { kind: "bond", mode: "split", min: 3, max: 5, pictures: true },
        { kind: "bond", mode: "split", min: 4, max: 6 },
        { kind: "bond", mode: "split", min: 4, max: 6, pictures: true },
        { kind: "bond", mode: "split", min: 5, max: 7 },
      ],
    },
    {
      id: "t6-l4",
      title: "Lớn nhất, bé nhất",
      icon: "🍎",
      goal: "Xếp khối trên từng số. Tháp cao nhất là số lớn nhất.",
      demo: { kind: "extreme", mode: "max" },
      practice: [{ kind: "extreme", mode: "max" }, { kind: "extreme", mode: "min" }, { kind: "extreme", mode: "max" }, { kind: "extreme", mode: "min" }, { kind: "extreme", mode: "min" }],
    },
  ],
  worksheet: [
    { kind: "count", min: 0, max: 10 },
    { kind: "count", min: 0, max: 10 },
    { kind: "sequence", dir: "up", style: "train", blanks: 6 },
    { kind: "sequence", dir: "down", style: "train", blanks: 6 },
    { kind: "num-tf", max: 10 },
    { kind: "num-tf", max: 10 },
    { kind: "num-tf", max: 10 },
    { kind: "bond", mode: "split", min: 3, max: 5, pictures: true },
    { kind: "extreme", mode: "max" },
    { kind: "extreme", mode: "min" },
    { kind: "scene-count", max: 9 },
  ],
};
