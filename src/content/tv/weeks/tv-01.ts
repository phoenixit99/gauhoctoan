import type { WeekDef } from "../../types";

// Source: "K1 - TV - Tuần 1" (17/08–21/08/2026)
// C1 tư thế ngồi học đúng (bỏ qua: cần hình của trường) · C2 dấu huyền là dấu nào · C3 tiếng chứa dấu sắc (bà / bé / cà)
// Tập viết: nét ngang, sổ, xiên phải, xiên trái, cong hở phải, cong hở trái, cong kín, móc xuôi, móc ngược, móc hai đầu,
// khuyết trên, khuyết dưới
export const tv01: WeekDef = {
  subject: "tv",
  id: 1,
  title: "Tuần 1",
  topic: "Các nét cơ bản. Dấu huyền, dấu sắc",
  dates: "17/08 – 21/08",
  color: "#b3e5fc",
  dark: "#0277bd",
  lessons: [
    {
      id: "tv1-l1",
      title: "Nét thẳng",
      icon: "📏",
      goal: "Tô từng nét. Bắt đầu ở chấm xanh, dừng ở chấm đỏ.",
      demo: { kind: "tv-trace", strokes: ["ngang"] },
      practice: [
        { kind: "tv-trace", strokes: ["ngang"] },
        { kind: "tv-trace", strokes: ["so"] },
        { kind: "tv-trace", strokes: ["xien-phai"] },
        { kind: "tv-trace", strokes: ["xien-trai"] },
        { kind: "tv-trace", strokes: ["ngang", "so", "xien-phai", "xien-trai"] },
      ],
    },
    {
      id: "tv1-l2",
      title: "Nét cong",
      icon: "🌙",
      goal: "Tô nét cong theo đường chấm.",
      demo: { kind: "tv-trace", strokes: ["cong-ho-phai"] },
      practice: [
        { kind: "tv-trace", strokes: ["cong-ho-phai"] },
        { kind: "tv-trace", strokes: ["cong-ho-trai"] },
        { kind: "tv-trace", strokes: ["cong-kin"] },
        { kind: "tv-trace", strokes: ["cong-ho-phai", "cong-ho-trai"] },
        { kind: "tv-trace", strokes: ["cong-kin"] },
      ],
    },
    {
      id: "tv1-l3",
      title: "Nét móc, nét khuyết",
      icon: "🪝",
      goal: "Tô nét móc và nét khuyết theo đường chấm.",
      demo: { kind: "tv-trace", strokes: ["moc-xuoi"] },
      practice: [
        { kind: "tv-trace", strokes: ["moc-xuoi"] },
        { kind: "tv-trace", strokes: ["moc-nguoc"] },
        { kind: "tv-trace", strokes: ["moc-hai-dau"] },
        { kind: "tv-trace", strokes: ["khuyet-tren"] },
        { kind: "tv-trace", strokes: ["khuyet-duoi"] },
      ],
    },
    {
      id: "tv1-l4",
      title: "Dấu huyền, dấu sắc",
      icon: "✏️",
      goal: "Nhìn hình của dấu. Tìm tiếng có dấu đó.",
      demo: { kind: "tv-tone", tones: ["huyền", "sắc", "nặng"] },
      practice: [
        { kind: "tv-tone", tones: ["huyền", "sắc", "nặng"] },
        { kind: "tv-tone", tones: ["huyền", "sắc", "nặng"] },
        { kind: "tv-tone-word", tones: ["sắc", "huyền"], words: ["bà", "bé", "cà", "cá", "bè", "bế", "ba", "be"] },
        { kind: "tv-tone-word", tones: ["sắc", "huyền"], words: ["bà", "bé", "cà", "cá", "bè", "bế", "ba", "be"] },
        { kind: "tv-tone", tones: ["huyền", "sắc", "nặng"] },
      ],
    },
  ],
  worksheet: [
    { kind: "tv-tone", tones: ["huyền", "sắc", "nặng"] },
    { kind: "tv-tone-word", tones: ["sắc"], words: ["bà", "bé", "cà"] },
    { kind: "tv-trace", strokes: ["ngang"] },
    { kind: "tv-trace", strokes: ["so"] },
    { kind: "tv-trace", strokes: ["xien-phai", "xien-trai"] },
    { kind: "tv-trace", strokes: ["cong-ho-phai", "cong-ho-trai", "cong-kin"] },
    { kind: "tv-trace", strokes: ["moc-xuoi", "moc-nguoc", "moc-hai-dau"] },
    { kind: "tv-trace", strokes: ["khuyet-tren", "khuyet-duoi"] },
  ],
};
