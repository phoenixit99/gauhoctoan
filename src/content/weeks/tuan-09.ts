import type { WeekDef } from "../types";

// Source: "K1-Toan-Tuan9" (12/10–16/10/2026)
// C1 hình thích hợp đặt vào dấu ? · C2 nối vật với tên hình · C3, C4 viết phép cộng từ tranh (2 + 1 = ☐)
// C5 điền dấu >, <, = (3 + 2 ☐ 6)
export const tuan09: WeekDef = {
  subject: "toan",
  id: 9,
  title: "Tuần 9",
  topic: "Hình lặp lại. Phép cộng trong phạm vi 10",
  dates: "12/10 – 16/10",
  color: "#f8bbd0",
  dark: "#c2185b",
  lessons: [
    {
      id: "t9-l1",
      title: "Hình lặp lại",
      icon: "🔁",
      goal: "Tìm nhóm hình lặp lại. Chọn hình tiếp theo.",
      demo: { kind: "shape-pattern" },
      practice: [{ kind: "shape-pattern" }, { kind: "shape-pattern" }, { kind: "shape-match" }, { kind: "shape-pattern" }, { kind: "shape-pattern" }],
    },
    {
      id: "t9-l2",
      title: "Phép cộng từ tranh",
      icon: "🐷",
      goal: "Đếm nhóm thứ nhất. Đếm tiếp nhóm thứ hai. Được kết quả.",
      demo: { kind: "add", max: 5, pictures: true },
      practice: [
        { kind: "add", max: 5, pictures: true },
        { kind: "add", max: 6, pictures: true },
        { kind: "add", max: 7, pictures: true },
        { kind: "add", max: 8, pictures: true },
        { kind: "add", max: 10, pictures: true },
      ],
    },
    {
      id: "t9-l3",
      title: "Tính cộng",
      icon: "➕",
      goal: "Xếp chấm cho từng số. Đếm tiếp để được kết quả.",
      demo: { kind: "add", max: 5 },
      practice: [{ kind: "add", max: 5 }, { kind: "add", max: 6 }, { kind: "add", max: 8 }, { kind: "add", max: 10 }, { kind: "add", max: 10 }],
    },
    {
      id: "t9-l4",
      title: "So sánh phép cộng",
      icon: "⚖️",
      goal: "Tính phép cộng trước, rồi chọn dấu.",
      demo: { kind: "expr-sign", max: 6 },
      practice: [{ kind: "expr-sign", max: 6 }, { kind: "expr-sign", max: 8 }, { kind: "expr-sign", max: 10 }, { kind: "expr-sign", max: 10 }, { kind: "expr-sign", max: 10 }],
    },
  ],
  worksheet: [
    { kind: "shape-pattern" },
    { kind: "shape-pattern" },
    { kind: "shape-match" },
    { kind: "add", max: 7, pictures: true },
    { kind: "add", max: 7, pictures: true },
    { kind: "add", max: 7, pictures: true },
    { kind: "add", max: 10, pictures: true },
    { kind: "add", max: 10, pictures: true },
    { kind: "expr-sign", max: 10 },
    { kind: "expr-sign", max: 10 },
    { kind: "expr-sign", max: 10 },
  ],
};
