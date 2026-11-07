import type { WeekDef } from "../types";

// Source: "K1-Toan-Tuan7" (28/09–02/10/2026)
// C1 số còn thiếu 1→10, 10→1 · C2 điền dấu >, <, = · C3 gộp hai nhóm (2 và 3 được 5)
// C4 tranh có nhiều cá nhất / ít cá nhất · C5 nối vật với hình (vuông, tròn, tam giác, chữ nhật)
// C6 tô màu theo hình · C7 đếm từng loại hình trong tranh
export const tuan07: WeekDef = {
  subject: "toan",
  id: 7,
  title: "Tuần 7",
  topic: "Ôn tập số 0–10. Nhiều nhất, ít nhất. Hình phẳng",
  dates: "28/09 – 02/10",
  color: "#fff59d",
  dark: "#f9a825",
  lessons: [
    {
      id: "t7-l1",
      title: "Dãy số, so sánh",
      icon: "🦒",
      goal: "Đếm xuôi, đếm ngược. Chọn dấu >, <, =.",
      demo: { kind: "sequence", dir: "up", style: "train", blanks: 5 },
      practice: [
        { kind: "sequence", dir: "up", style: "train", blanks: 7 },
        { kind: "sign", max: 10 },
        { kind: "sequence", dir: "down", style: "train", blanks: 7 },
        { kind: "sign", max: 10 },
        { kind: "sign", max: 10 },
      ],
    },
    {
      id: "t7-l2",
      title: "Gộp hai nhóm",
      icon: "🐞",
      goal: "Đếm nhóm thứ nhất, rồi đếm tiếp nhóm thứ hai.",
      demo: { kind: "bond", mode: "join", max: 6, pictures: true },
      practice: [
        { kind: "bond", mode: "join", max: 6, pictures: true },
        { kind: "bond", mode: "join", max: 8, pictures: true },
        { kind: "bond", mode: "join", max: 10, pictures: true },
        { kind: "bond", mode: "join", max: 10, pictures: true },
        { kind: "bond", mode: "join", max: 10, pictures: true },
      ],
    },
    {
      id: "t7-l3",
      title: "Nhiều nhất, ít nhất",
      icon: "🐟",
      goal: "Đếm từng tranh. Số lớn nhất là tranh nhiều nhất.",
      demo: { kind: "extreme", mode: "max", pictures: true },
      practice: [
        { kind: "extreme", mode: "max", pictures: true },
        { kind: "extreme", mode: "min", pictures: true },
        { kind: "extreme", mode: "max", pictures: true },
        { kind: "extreme", mode: "min", pictures: true },
        { kind: "extreme", mode: "min", pictures: true },
      ],
    },
    {
      id: "t7-l4",
      title: "Hình phẳng",
      icon: "🔷",
      goal: "Đếm cạnh để biết tên hình.",
      demo: { kind: "shape-pick" },
      practice: [{ kind: "shape-pick" }, { kind: "shape-object" }, { kind: "shape-pick" }, { kind: "shape-all" }, { kind: "shape-count" }],
    },
  ],
  worksheet: [
    { kind: "sequence", dir: "up", style: "train", blanks: 7 },
    { kind: "sequence", dir: "down", style: "train", blanks: 7 },
    { kind: "sign", max: 10 },
    { kind: "sign", max: 10 },
    { kind: "bond", mode: "join", max: 10, pictures: true },
    { kind: "bond", mode: "join", max: 10, pictures: true },
    { kind: "extreme", mode: "max", pictures: true },
    { kind: "extreme", mode: "min", pictures: true },
    { kind: "shape-match" },
    { kind: "shape-all" },
    { kind: "shape-count" },
  ],
};
