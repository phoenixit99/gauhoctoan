import type { WeekDef } from "../types";

// Source: "K1-Toan- Tuan 8" (05/10–09/10/2026)
// C1 tô màu hình tam giác / hình tròn · C2, C3 đếm hình vuông, tròn, tam giác, chữ nhật trong tranh
// C5, C6 khoanh số hình (A/B/C)
// Chưa làm: C4 ghép hai miếng bìa thành một hình; đếm hình chữ nhật chồng lên nhau (C5).
export const tuan08: WeekDef = {
  subject: "toan",
  id: 8,
  title: "Tuần 8",
  topic: "Hình tròn, hình vuông, hình tam giác, hình chữ nhật",
  dates: "05/10 – 09/10",
  color: "#bbdefb",
  dark: "#1565c0",
  lessons: [
    {
      id: "t8-l1",
      title: "Tên các hình",
      icon: "🔺",
      goal: "Đếm cạnh để biết tên hình.",
      demo: { kind: "shape-pick" },
      practice: [{ kind: "shape-pick" }, { kind: "shape-pick" }, { kind: "shape-pick" }, { kind: "shape-pick" }, { kind: "shape-pick" }],
    },
    {
      id: "t8-l2",
      title: "Vật có dạng hình gì",
      icon: "📺",
      goal: "Nhìn cạnh của vật. Chọn hình giống vật.",
      demo: { kind: "shape-object" },
      practice: [{ kind: "shape-object" }, { kind: "shape-object" }, { kind: "shape-match" }, { kind: "shape-object" }, { kind: "shape-match" }],
    },
    {
      id: "t8-l3",
      title: "Chọn tất cả hình",
      icon: "🎨",
      goal: "Xem từng hình. Chọn tất cả hình cần tìm.",
      demo: { kind: "shape-all" },
      practice: [{ kind: "shape-all" }, { kind: "shape-all" }, { kind: "shape-all" }, { kind: "shape-all" }, { kind: "shape-all" }],
    },
    {
      id: "t8-l4",
      title: "Đếm hình",
      icon: "🏠",
      goal: "Chỉ đếm hình cần tìm.",
      demo: { kind: "shape-count" },
      practice: [{ kind: "shape-count" }, { kind: "shape-count" }, { kind: "shape-count" }, { kind: "shape-count" }, { kind: "shape-count" }],
    },
  ],
  worksheet: [
    { kind: "shape-all" },
    { kind: "shape-all" },
    { kind: "shape-count" },
    { kind: "shape-count" },
    { kind: "shape-count" },
    { kind: "shape-count" },
    { kind: "shape-count" },
    { kind: "shape-object" },
    { kind: "shape-count" },
    { kind: "shape-count" },
  ],
};
