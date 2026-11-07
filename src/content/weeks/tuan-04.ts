import type { WeekDef } from "../types";

// Source: "K1-Toan-Tuan4" (07/09–11/09/2026)
// C1 nối ô trống với số (7 > ☐) · C2 viết phép so sánh từ tranh · C3 điền dấu >, <, =
// C4 vẽ thêm hình theo mẫu (2 < 3) · C5 đếm theo màu rồi so sánh · C6 nối (8 < ☐, ☐ = 7)
export const tuan04: WeekDef = {
  subject: "toan",
  id: 4,
  title: "Tuần 4",
  topic: "Lớn hơn, bé hơn, bằng nhau. Dấu >, <, =",
  dates: "07/09 – 11/09",
  color: "#c4b0ec",
  dark: "#7e57c2",
  lessons: [
    {
      id: "t4-l1",
      title: "Dấu > < =",
      icon: "⚖️",
      goal: "Chọn dấu >, <, = giữa hai số.",
      demo: { kind: "sign", max: 5 },
      practice: [{ kind: "sign", max: 5 }, { kind: "sign", max: 5 }, { kind: "sign", max: 10 }, { kind: "sign", max: 10 }, { kind: "sign", max: 10 }],
    },
    {
      id: "t4-l2",
      title: "So sánh từ tranh",
      icon: "🌸",
      goal: "Đếm hai nhóm, rồi so sánh hai số.",
      demo: { kind: "picture-sign" },
      practice: [{ kind: "picture-sign" }, { kind: "attr-compare" }, { kind: "picture-sign" }, { kind: "attr-compare" }, { kind: "picture-sign" }],
    },
    {
      id: "t4-l3",
      title: "Tìm số phù hợp",
      icon: "🚂",
      goal: "Thử từng số vào ô trống.",
      demo: { kind: "pick-number" },
      practice: [{ kind: "pick-number" }, { kind: "pick-number" }, { kind: "pick-number" }, { kind: "pick-number" }, { kind: "pick-number" }],
    },
    {
      id: "t4-l4",
      title: "Vẽ thêm theo mẫu",
      icon: "🍦",
      goal: "Thêm hình cho mỗi hàng đủ số cần có.",
      demo: { kind: "adjust-counts" },
      practice: [{ kind: "adjust-counts" }, { kind: "adjust-counts" }, { kind: "adjust-counts" }, { kind: "adjust-counts" }, { kind: "sign" }],
    },
  ],
  worksheet: [
    { kind: "pick-number" },
    { kind: "pick-number" },
    { kind: "pick-number" },
    { kind: "picture-sign" },
    { kind: "picture-sign" },
    { kind: "sign" },
    { kind: "sign" },
    { kind: "sign" },
    { kind: "adjust-counts" },
    { kind: "attr-compare" },
    { kind: "pick-number" },
  ],
};
