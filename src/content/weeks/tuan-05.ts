import type { WeekDef } from "../types";

// Source: "K1-Toán-Tuần 5" (14/09–18/09/2026)
// C1 viết phép so sánh từ tranh (4 = 4) · C2 điền dấu >, <, = · C3 tách 8 viên bi thành 2 nhóm (8 gồm 5 và 3)
// C4 gộp hai nhóm ngôi sao (3 và 5 được 8) · C5 đàn gà 10 con gồm … gà mẹ và … gà con · C6 Đúng / Sai (hoa và bướm)
export const tuan05: WeekDef = {
  subject: "toan",
  id: 5,
  title: "Tuần 5",
  topic: "Gộp số, tách số. Ôn so sánh",
  dates: "14/09 – 18/09",
  color: "#ffccbc",
  dark: "#d84315",
  lessons: [
    {
      id: "t5-l1",
      title: "Ôn so sánh",
      icon: "⚖️",
      goal: "Đếm hai nhóm, rồi chọn dấu >, <, =.",
      demo: { kind: "picture-sign" },
      practice: [{ kind: "picture-sign" }, { kind: "sign", max: 10 }, { kind: "picture-sign" }, { kind: "sign", max: 10 }, { kind: "sign", max: 10 }],
    },
    {
      id: "t5-l2",
      title: "Tách số",
      icon: "🔵",
      goal: "Chia các chấm thành hai nhóm. Đếm nhóm còn lại.",
      demo: { kind: "bond", mode: "split", min: 4, max: 6 },
      practice: [
        { kind: "bond", mode: "split", min: 3, max: 6 },
        { kind: "bond", mode: "split", min: 4, max: 8 },
        { kind: "bond", mode: "split", min: 8, max: 8 },
        { kind: "bond", mode: "split", min: 5, max: 10 },
        { kind: "bond", mode: "split", min: 5, max: 10 },
      ],
    },
    {
      id: "t5-l3",
      title: "Gộp số",
      icon: "⭐",
      goal: "Đếm nhóm thứ nhất, rồi đếm tiếp nhóm thứ hai.",
      demo: { kind: "bond", mode: "join", max: 6, pictures: true },
      practice: [
        { kind: "bond", mode: "join", max: 6, pictures: true },
        { kind: "bond", mode: "join", max: 8, pictures: true },
        { kind: "bond", mode: "join", max: 10, pictures: true },
        { kind: "bond", mode: "join", max: 10 },
        { kind: "bond", mode: "join", max: 10, pictures: true },
      ],
    },
    {
      id: "t5-l4",
      title: "Gồm mấy và mấy",
      icon: "🐔",
      goal: "Đếm từng nhóm trong tranh. Nói số gồm mấy và mấy.",
      demo: { kind: "bond", mode: "split", min: 5, max: 10, pictures: true },
      practice: [
        { kind: "bond", mode: "split", min: 5, max: 10, pictures: true },
        { kind: "true-false" },
        { kind: "bond", mode: "split", min: 5, max: 10, pictures: true },
        { kind: "true-false" },
        { kind: "bond", mode: "split", min: 6, max: 10, pictures: true },
      ],
    },
  ],
  worksheet: [
    { kind: "picture-sign" },
    { kind: "picture-sign" },
    { kind: "sign", max: 10 },
    { kind: "sign", max: 10 },
    { kind: "sign", max: 10 },
    { kind: "bond", mode: "split", min: 8, max: 8 },
    { kind: "bond", mode: "split", min: 8, max: 8 },
    { kind: "bond", mode: "join", max: 10, pictures: true },
    { kind: "bond", mode: "join", max: 10, pictures: true },
    { kind: "bond", mode: "split", min: 6, max: 10, pictures: true },
    { kind: "true-false" },
  ],
};
