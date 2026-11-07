import type { WeekDef } from "../../types";

// Source: "K1-TV-Tuần 2" (phiếu không ghi ngày)
// Luyện đọc: A-a B-b C-c E-e Ê-ê · ba ba, bà ba, bè cá, cá bé, bế bé, be bé, bề bề · Bà bế bé. Cá be bé. Ba bê ba ba.
// C1 vật có âm a (ô / chó / na) · C2 vật có âm c (vịt / cây / mèo) · C3 tiếng có dấu sắc (cờ / dừa / kéo)
// C4 tiếng có dấu huyền (cam / táo / đào) · B1 nối a với hình có âm a · B2 nối b với hình có âm b
// B3 đọc và nối (ba ba / ba / ca / bé) · B4 khoanh từ viết đúng (cà/cá, bế/bế, bè/bé, bê/bề) · B5 viết tên (cá, cà, bà)
export const tv02: WeekDef = {
  subject: "tv",
  id: 2,
  title: "Tuần 2",
  topic: "Âm a, b, c, e, ê. Dấu sắc, dấu huyền",
  color: "#c8e6c9",
  dark: "#2e7d32",
  lessons: [
    {
      id: "tv2-l1",
      title: "Đọc a, b, c, e, ê",
      icon: "🔤",
      goal: "Nghe Gấu đánh vần, rồi đọc theo.",
      demo: { kind: "tv-read", items: ["a", "b", "ba", "bà"] },
      practice: [
        { kind: "tv-read", items: ["a", "b", "c", "e", "ê"] },
        { kind: "tv-read", items: ["ba", "bà", "bé", "bè", "cá", "bê"] },
        { kind: "tv-read", items: ["ba ba", "bè cá", "cá bé", "bế bé"] },
        { kind: "tv-read", items: ["Bà bế bé.", "Cá be bé.", "Ba bê ba ba."] },
        { kind: "tv-sound", sounds: ["a", "b", "c", "e", "ê"] },
      ],
    },
    {
      id: "tv2-l2",
      title: "Tìm âm",
      icon: "🔎",
      goal: "Nghe âm. Nói tên hình. Chọn hình có âm đó.",
      demo: { kind: "tv-sound", sounds: ["a"] },
      practice: [
        { kind: "tv-sound", sounds: ["a"] },
        { kind: "tv-sound", sounds: ["c"] },
        { kind: "tv-sound", sounds: ["b"] },
        { kind: "tv-sound-all", sounds: ["a"] },
        { kind: "tv-sound-all", sounds: ["b"] },
      ],
    },
    {
      id: "tv2-l3",
      title: "Dấu sắc, dấu huyền",
      icon: "✏️",
      goal: "Nói tên hình. Nghe dấu của tiếng đó.",
      demo: { kind: "tv-tone-word", tones: ["sắc"], pictures: true, words: ["cờ", "dừa", "kéo", "cá", "bò", "bé", "gà", "chó"] },
      practice: [
        { kind: "tv-tone-word", tones: ["sắc"], pictures: true, words: ["cờ", "dừa", "kéo", "cá", "bò", "bé", "gà", "chó"] },
        { kind: "tv-tone-word", tones: ["huyền"], pictures: true, words: ["cam", "táo", "đào", "bà", "lá", "gà", "nho"] },
        { kind: "tv-tone-word", tones: ["sắc", "huyền"], pictures: true, words: ["cờ", "dừa", "kéo", "cam", "táo", "đào", "bà", "cá"] },
        { kind: "tv-correct-word", words: ["cá", "bà", "bé", "bò", "gà"] },
        { kind: "tv-tone-word", tones: ["huyền"], pictures: true, words: ["cam", "táo", "đào", "bà", "lá", "gà", "nho"] },
      ],
    },
    {
      id: "tv2-l4",
      title: "Đọc, nối và viết",
      icon: "🔗",
      goal: "Đọc chữ, nối với hình. Ghép âm để viết tên hình.",
      demo: { kind: "tv-match", words: ["ba ba", "ba", "bé", "cá"] },
      practice: [
        { kind: "tv-match", words: ["ba ba", "ba", "bé", "cá"] },
        { kind: "tv-correct-word", words: ["cá", "bà", "bé", "bò"] },
        { kind: "tv-spell", words: ["cá"] },
        { kind: "tv-spell", words: ["bà"] },
        { kind: "tv-spell", words: ["bé", "bò", "cá", "bà"] },
      ],
    },
  ],
  worksheet: [
    { kind: "tv-read", items: ["ba ba", "bà ba", "bè cá", "cá bé", "bế bé", "Bà bế bé."] },
    { kind: "tv-sound", sounds: ["a"] },
    { kind: "tv-sound", sounds: ["c"] },
    { kind: "tv-tone-word", tones: ["sắc"], pictures: true, words: ["cờ", "dừa", "kéo"] },
    { kind: "tv-tone-word", tones: ["huyền"], pictures: true, words: ["cam", "táo", "đào"] },
    { kind: "tv-sound-all", sounds: ["a"] },
    { kind: "tv-sound-all", sounds: ["b"] },
    { kind: "tv-match", words: ["ba ba", "ba", "bé", "cá"] },
    { kind: "tv-correct-word", words: ["cá", "bà", "bé"] },
    { kind: "tv-correct-word", words: ["bò", "gà", "lá"] },
    { kind: "tv-spell", words: ["cá", "bà"] },
  ],
};
