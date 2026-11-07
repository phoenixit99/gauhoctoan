import type { WeekDef } from "../../types";

// Source: "K1-TV-Tuần 6" (21/09–25/09/2026) — Bài 21–25: r, s, t, tr, th, ia, ua, ưa
// Đọc · Bài 1 nối tranh với chữ (cà chua, tía tô, sữa chua, sư tử) · Bài 2 chọn từ trong ngoặc (tỉa lá, ô tô)
// Bài 3 điền th / tr (cá trê, lá thư, tre ngà) · Bài 4 nối thành câu · Viết: tả, thìa, sữa chua, lá mía
export const tv06: WeekDef = {
  subject: "tv",
  id: 6,
  title: "Tuần 6",
  topic: "Âm r, s, t, tr, th. Vần ia, ua, ưa",
  dates: "21/09 – 25/09",
  color: "#c5cae9",
  dark: "#303f9f",
  lessons: [
    {
      id: "tv6-l1",
      title: "Đọc r, s, t, tr, th, ia, ua, ưa",
      icon: "🔤",
      goal: "Nghe Gấu đánh vần, rồi đọc theo.",
      demo: { kind: "tv-read", items: ["th", "thìa", "ưa", "dừa"] },
      practice: [
        { kind: "tv-read", items: ["r", "s", "t", "tr", "th", "ia", "ua", "ưa"] },
        { kind: "tv-read", items: ["chữ số", "rổ rá", "cà chua", "sư tử", "cá trê"] },
        { kind: "tv-read", items: ["lá thư", "nhà trẻ", "cửa sổ", "thìa dĩa"] },
        { kind: "tv-read", items: ["Nghỉ hè, bố mẹ cho chị Kha và Hà về nhà bà.", "Nhà bà có mía, có dừa, có cà chua, có cả dưa lê."] },
        { kind: "tv-sound", sounds: ["th", "tr", "s"] },
      ],
    },
    {
      id: "tv6-l2",
      title: "Tìm âm, tìm vần",
      icon: "🔎",
      goal: "Nghe âm hoặc vần. Nói tên hình. Chọn hình đúng.",
      demo: { kind: "tv-rhyme", rhymes: ["ưa"] },
      practice: [
        { kind: "tv-rhyme", rhymes: ["ưa"] },
        { kind: "tv-rhyme", rhymes: ["ia"] },
        { kind: "tv-sound", sounds: ["th"] },
        { kind: "tv-rhyme", rhymes: ["ua"] },
        { kind: "tv-sound", sounds: ["tr", "s"] },
      ],
    },
    {
      id: "tv6-l3",
      title: "Điền th / tr",
      icon: "🧩",
      goal: "Đánh vần tiếng. Chọn âm đầu còn thiếu.",
      demo: { kind: "tv-fill", letters: ["th", "tr"], words: ["thỏ"] },
      practice: [
        { kind: "tv-fill", letters: ["th", "tr"], words: ["thỏ", "thư", "tre", "thìa"] },
        { kind: "tv-fill", letters: ["th", "tr"], words: ["cá trê", "lá thư", "tre ngà", "nhà trẻ"] },
        { kind: "tv-fill", letters: ["th", "tr"], words: ["thỏ", "thư", "tre", "thìa"] },
        { kind: "tv-fill", letters: ["th", "tr"], words: ["cá trê", "lá thư", "tre ngà", "nhà trẻ"] },
        { kind: "tv-match", words: ["cà chua", "tía tô", "sữa chua", "sư tử"] },
      ],
    },
    {
      id: "tv6-l4",
      title: "Chọn từ, nối câu, tập viết",
      icon: "🔗",
      goal: "Thử từng từ vào câu. Nối thành câu. Ghép âm để viết.",
      demo: { kind: "tv-cloze", items: [{ s: "Cả nhà đi ….", options: ["tỉa lá", "ô tô"], answer: "ô tô" }] },
      practice: [
        { kind: "tv-cloze", items: [{ s: "Bé Hà nhổ cỏ, chị Kha ….", options: ["tỉa lá", "ô tô"], answer: "tỉa lá" }] },
        { kind: "tv-match", sentences: [["Bà đi chợ mua", "mía."], ["Bé Hà", "đi nhà trẻ."], ["Mẹ ru bé", "ngủ trưa."]] },
        { kind: "tv-spell", words: ["tả", "thìa"], model: true, letters: ["t", "th", "tr", "s"] },
        { kind: "tv-spell", words: ["lá mía"], model: true, letters: ["l", "m", "n", "t"] },
        { kind: "tv-spell", words: ["sữa chua"], model: true, letters: ["s", "x", "ch", "tr"] },
      ],
    },
  ],
  worksheet: [
    { kind: "tv-match", words: ["cà chua", "tía tô", "sữa chua", "sư tử"] },
    { kind: "tv-cloze", items: [{ s: "Bé Hà nhổ cỏ, chị Kha ….", options: ["tỉa lá", "ô tô"], answer: "tỉa lá" }] },
    { kind: "tv-cloze", items: [{ s: "Cả nhà đi ….", options: ["tỉa lá", "ô tô"], answer: "ô tô" }] },
    { kind: "tv-fill", letters: ["th", "tr"], words: ["cá trê"] },
    { kind: "tv-fill", letters: ["th", "tr"], words: ["lá thư"] },
    { kind: "tv-fill", letters: ["th", "tr"], words: ["tre ngà"] },
    { kind: "tv-match", sentences: [["Bà đi chợ mua", "mía."], ["Bé Hà", "đi nhà trẻ."], ["Mẹ ru bé", "ngủ trưa."]] },
    { kind: "tv-spell", words: ["tả", "thìa"], model: true, letters: ["t", "th", "tr", "s"] },
    { kind: "tv-spell", words: ["sữa chua", "lá mía"], model: true, letters: ["s", "x", "ch", "tr", "l", "m"] },
  ],
};
