import type { WeekDef } from "../types";

// Source: "K1-Toan-Tuan10" (19/10–23/10/2026)
// C1 nối hai phép cộng có cùng kết quả · C2 số còn thiếu từ tranh (6 + ☐ = 8) · C3 tính (2 + 4 = …)
// C4 nối phép cộng với kết quả · C5 điền dấu (3 + 2 ☐ 6) · C6 nối ô trống với số (1 + … = 6) · C7 phép cộng từ tranh (2 hoặc 3 nhóm)
export const tuan10: WeekDef = {
  subject: "toan",
  id: 10,
  title: "Tuần 10",
  topic: "Phép cộng trong phạm vi 10",
  dates: "19/10 – 23/10",
  color: "#d1c4e9",
  dark: "#512da8",
  lessons: [
    {
      id: "t10-l1",
      title: "Tính cộng",
      icon: "➕",
      goal: "Xếp chấm cho từng số. Đếm tiếp để được kết quả.",
      demo: { kind: "add", max: 6 },
      practice: [{ kind: "add", max: 6 }, { kind: "add", max: 8 }, { kind: "add", max: 10 }, { kind: "add", max: 10 }, { kind: "add", max: 10 }],
    },
    {
      id: "t10-l2",
      title: "Nối phép tính",
      icon: "🔗",
      goal: "Tính phép tính bên trái. Nối với kết quả đúng.",
      demo: { kind: "calc-match", to: "number" },
      practice: [
        { kind: "calc-match", to: "number" },
        { kind: "calc-match", to: "number" },
        { kind: "calc-match", to: "expr" },
        { kind: "calc-match", to: "expr" },
        { kind: "calc-match", to: "number" },
      ],
    },
    {
      id: "t10-l3",
      title: "Số còn thiếu",
      icon: "🧩",
      goal: "Xếp chấm cho số đã biết. Đếm tiếp đến kết quả.",
      demo: { kind: "add", max: 6, missing: true, pictures: true },
      practice: [
        { kind: "add", max: 8, missing: true, pictures: true },
        { kind: "add", max: 8, missing: true },
        { kind: "add", max: 10, missing: true, pictures: true },
        { kind: "add", max: 10, missing: true },
        { kind: "add", max: 10, missing: true },
      ],
    },
    {
      id: "t10-l4",
      title: "So sánh, cộng ba số",
      icon: "⚖️",
      goal: "Tính phép cộng trước, rồi so sánh.",
      demo: { kind: "expr-sign", max: 10 },
      practice: [{ kind: "expr-sign", max: 10 }, { kind: "add", max: 10, pictures: true }, { kind: "expr-sign", max: 10 }, { kind: "add", max: 10, terms: 3 }, { kind: "expr-sign", max: 10 }],
    },
  ],
  worksheet: [
    { kind: "calc-match", to: "expr" },
    { kind: "add", max: 10, missing: true, pictures: true },
    { kind: "add", max: 10, missing: true, pictures: true },
    { kind: "add", max: 10 },
    { kind: "add", max: 10 },
    { kind: "add", max: 10 },
    { kind: "calc-match", to: "number" },
    { kind: "expr-sign", max: 10 },
    { kind: "expr-sign", max: 10 },
    { kind: "add", max: 10, missing: true },
    { kind: "add", max: 10, pictures: true },
    { kind: "add", max: 10, terms: 3 },
  ],
};
