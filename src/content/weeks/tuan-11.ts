import type { WeekDef } from "../types";

// Source: "K1- Toán - Tuan 11" (26/10–30/10/2026)
// C1 tính cộng (3 + 7 = ☐) · C2 phép trừ từ tranh (4 − ☐ = 3) · C3 tính theo mẫu: 5 + 2 + 2 = 7 + 2 = 9
// C4 từ "7 gồm 4 và 3" viết phép trừ · C5 tô quả táo có kết quả bằng 10 / bằng 4
// Chưa làm: C6 tháp số (mỗi ô bằng tổng hai ô bên dưới).
export const tuan11: WeekDef = {
  subject: "toan",
  id: 11,
  title: "Tuần 11",
  topic: "Phép cộng, phép trừ trong phạm vi 10",
  dates: "26/10 – 30/10",
  color: "#dcedc8",
  dark: "#558b2f",
  lessons: [
    {
      id: "t11-l1",
      title: "Cộng hai số, ba số",
      icon: "➕",
      goal: "Cộng hai số đầu trước, rồi cộng tiếp số thứ ba.",
      demo: { kind: "add", max: 10, terms: 3 },
      practice: [{ kind: "add", max: 10 }, { kind: "add", max: 10, terms: 3 }, { kind: "add", max: 10 }, { kind: "add", max: 10, terms: 3 }, { kind: "add", max: 10, terms: 3 }],
    },
    {
      id: "t11-l2",
      title: "Phép trừ từ tranh",
      icon: "🚗",
      goal: "Gạch bớt hình. Đếm số hình còn lại.",
      demo: { kind: "sub", max: 5, pictures: true },
      practice: [
        { kind: "sub", max: 6, pictures: true },
        { kind: "sub", max: 8, pictures: true },
        { kind: "sub", max: 6, missing: true, pictures: true },
        { kind: "sub", max: 10, pictures: true },
        { kind: "sub", max: 10, missing: true, pictures: true },
      ],
    },
    {
      id: "t11-l3",
      title: "Trừ từ số gồm",
      icon: "🔗",
      goal: "7 gồm 4 và 3. Bớt 3 thì còn lại 4.",
      demo: { kind: "sub", max: 7, bond: true },
      practice: [{ kind: "sub", max: 7, bond: true }, { kind: "sub", max: 8 }, { kind: "sub", max: 9, bond: true }, { kind: "sub", max: 10 }, { kind: "sub", max: 10, bond: true }],
    },
    {
      id: "t11-l4",
      title: "Chọn theo kết quả",
      icon: "🍎",
      goal: "Tính từng phép tính. Chọn phép tính có kết quả cần tìm.",
      demo: { kind: "calc-select" },
      practice: [{ kind: "calc-select" }, { kind: "calc-select", sub: true }, { kind: "calc-select" }, { kind: "calc-select", sub: true }, { kind: "calc-select" }],
    },
  ],
  worksheet: [
    { kind: "add", max: 10 },
    { kind: "add", max: 10 },
    { kind: "add", max: 10 },
    { kind: "sub", max: 10, missing: true, pictures: true },
    { kind: "sub", max: 10, missing: true, pictures: true },
    { kind: "add", max: 10, terms: 3 },
    { kind: "add", max: 10, terms: 3 },
    { kind: "sub", max: 9, bond: true },
    { kind: "sub", max: 9, bond: true },
    { kind: "calc-select" },
    { kind: "calc-select", sub: true },
  ],
};
