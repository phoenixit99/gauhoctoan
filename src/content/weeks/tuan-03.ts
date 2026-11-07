import type { WeekDef } from "../types";

// Source: "K1-Toan-Tuan3" (31/08–04/09/2026)
// C1 đoàn tàu xuôi/ngược · C2 vẽ thêm bóng để nhiều hơn số gấu · C3 thêm bao nhiêu để bằng (A/B/C)
// C4 chọn tranh nhiều con vật hơn · C5 vẽ thêm hoặc gạch bớt để bằng · C5' Đúng/Sai
export const tuan03: WeekDef = {
  subject: "toan",
  id: 3,
  title: "Tuần 3",
  topic: "Nhiều hơn – Ít hơn – Bằng nhau",
  dates: "31/08 – 04/09",
  color: "#5cbf94",
  dark: "#2f7d5d",
  lessons: [
    {
      id: "t3-l1",
      title: "Nhiều hơn – Ít hơn",
      icon: "🐥",
      goal: "Ghép từng cặp. Nhóm nào còn thừa là nhóm nhiều hơn.",
      demo: { kind: "pick-more" },
      practice: [{ kind: "pick-more" }, { kind: "pick-more" }, { kind: "true-false" }, { kind: "pick-more" }, { kind: "true-false" }],
    },
    {
      id: "t3-l2",
      title: "Bằng nhau",
      icon: "🐶",
      goal: "Hai nhóm bằng nhau khi ghép đủ từng cặp, không thừa con nào.",
      demo: { kind: "add-equal" },
      practice: [{ kind: "add-equal" }, { kind: "adjust-equal" }, { kind: "add-equal" }, { kind: "adjust-equal" }, { kind: "add-equal" }],
    },
    {
      id: "t3-l3",
      title: "Thêm, bớt cho đúng",
      icon: "🎈",
      goal: "Vẽ thêm hoặc gạch bớt để nhiều hơn hoặc bằng nhau.",
      demo: { kind: "adjust-more" },
      practice: [{ kind: "adjust-more" }, { kind: "adjust-equal" }, { kind: "adjust-more" }, { kind: "adjust-equal" }, { kind: "true-false" }],
    },
    {
      id: "t3-l4",
      title: "Ôn dãy số",
      icon: "🚂",
      goal: "Đếm xuôi, đếm ngược trên đoàn tàu.",
      demo: { kind: "sequence", dir: "down", style: "train", blanks: 4 },
      practice: [
        { kind: "sequence", dir: "up", style: "train", blanks: 6 },
        { kind: "sequence", dir: "down", style: "train", blanks: 6 },
        { kind: "sequence", dir: "up", style: "train", blanks: 7 },
        { kind: "sequence", dir: "down", style: "train", blanks: 7 },
        { kind: "sequence", dir: "down", style: "flags", blanks: 7 },
      ],
    },
  ],
  worksheet: [
    { kind: "sequence", dir: "up", style: "train", blanks: 7 },
    { kind: "sequence", dir: "down", style: "train", blanks: 7 },
    { kind: "adjust-more" },
    { kind: "add-equal" },
    { kind: "pick-more" },
    { kind: "pick-more" },
    { kind: "adjust-equal" },
    { kind: "adjust-equal" },
    { kind: "true-false" },
    { kind: "true-false" },
  ],
};
