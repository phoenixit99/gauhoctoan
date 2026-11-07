import type { WeekDef } from "../../types";

// Source: "K1-TV-Tuần 9" (12/10–16/10/2026) — Bài 36–40: om ôm ơm, em êm im um, ai ay ây, oi ôi ơi
// Đọc · Bài 1 Đ – S (kim, kem, ngày, nghài, cúm, gim) · Bài 2 chọn từ (mũm mĩm, nhảy dây)
// Bài 3 điền em / êm / im / um (thềm nhà, cái kim, bị cúm, tem thư) · Bài 4 nối thành câu
// Viết: mây, cơm, kim, "Nhím tìm thấy quả chín."
export const tv09: WeekDef = {
  subject: "tv",
  id: 9,
  title: "Tuần 9",
  topic: "Vần om, ôm, ơm, em, êm, im, um, ai, ay, ây, oi, ôi, ơi",
  dates: "12/10 – 16/10",
  color: "#d7ccc8",
  dark: "#5d4037",
  lessons: [
    {
      id: "tv9-l1",
      title: "Đọc vần om, em, ai, oi…",
      icon: "🔤",
      goal: "Nghe Gấu đánh vần, rồi đọc theo.",
      demo: { kind: "tv-read", items: ["ôm", "tôm", "oi", "voi"] },
      practice: [
        { kind: "tv-read", items: ["om", "ôm", "ơm", "em", "êm", "im", "um"] },
        { kind: "tv-read", items: ["ai", "ay", "ây", "oi", "ôi", "ơi"] },
        { kind: "tv-read", items: ["con tôm", "chôm chôm", "thơm tho", "que kem", "ghế đệm", "con chim"] },
        { kind: "tv-read", items: ["tủm tỉm", "cái tai", "nhảy dây", "chồi non", "con voi", "đồ chơi"] },
        { kind: "tv-read", items: ["Cả nhà làm bữa cơm trưa.", "Mẹ rán nem.", "Bà thổi xôi.", "Chị và bé rửa đũa, thìa dĩa và nồi cho mẹ."] },
      ],
    },
    {
      id: "tv9-l2",
      title: "Tìm vần",
      icon: "🔎",
      goal: "Nghe vần. Nói tên hình. Chọn hình có vần đó.",
      demo: { kind: "tv-rhyme", rhymes: ["oi"] },
      practice: [
        { kind: "tv-rhyme", rhymes: ["ôm", "ơm", "em", "im"] },
        { kind: "tv-rhyme", rhymes: ["ai", "ay", "ây"] },
        { kind: "tv-rhyme", rhymes: ["oi", "ôi", "ơi"] },
        { kind: "tv-rhyme", rhymes: ["ôm", "ơm", "em", "im"] },
        { kind: "tv-rhyme", rhymes: ["ai", "ay", "ây", "oi", "ôi", "ơi"] },
      ],
    },
    {
      id: "tv9-l3",
      title: "Đúng – sai, điền vần",
      icon: "🧩",
      goal: "Đọc từng từ. Trước i, e, ê viết gh, ngh. Chọn vần còn thiếu.",
      demo: { kind: "tv-fill", letters: ["em", "êm", "im", "um"], words: ["kem"] },
      practice: [
        { kind: "tv-fill", letters: ["em", "êm", "im", "um"], words: ["thềm nhà", "cái kim", "bị cúm", "tem thư", "kem", "chim"] },
        { kind: "tv-wrong", items: [["kim", null], ["kem", null], ["ngày", null], ["nghài", "ngài"], ["cúm", null], ["gim", "ghim"]] },
        { kind: "tv-fill", letters: ["em", "êm", "im", "um"], words: ["thềm nhà", "cái kim", "bị cúm", "tem thư", "kem", "chim"] },
        { kind: "tv-wrong", items: [["ghế đệm", null], ["ngỉ ngơi", "nghỉ ngơi"], ["gi nhớ", "ghi nhớ"], ["que kem", null]] },
        { kind: "tv-fill", letters: ["em", "êm", "im", "um"], words: ["thềm nhà", "cái kim", "bị cúm", "tem thư", "kem", "chim"] },
      ],
    },
    {
      id: "tv9-l4",
      title: "Chọn từ, nối câu, tập viết",
      icon: "🔗",
      goal: "Thử từng từ vào câu. Nối thành câu. Ghép âm và vần để viết.",
      demo: { kind: "tv-cloze", items: [{ s: "Hà và chị chơi ….", options: ["mũm mĩm", "nhảy dây"], answer: "nhảy dây" }] },
      practice: [
        { kind: "tv-cloze", items: [{ s: "Em bé ….", options: ["mũm mĩm", "nhảy dây"], answer: "mũm mĩm" }] },
        { kind: "tv-match", sentences: [["Nem rán", "thơm ngon."], ["Bà đi", "lom khom."], ["Bé ăn", "quả vải."]] },
        { kind: "tv-spell", words: ["mây"], model: true, letters: ["m", "n", "l", "b"] },
        { kind: "tv-spell", words: ["cơm"], model: true, letters: ["c", "k", "qu", "g"] },
        { kind: "tv-spell", words: ["kim"], model: true, letters: ["k", "c", "kh", "h"] },
      ],
    },
  ],
  worksheet: [
    { kind: "tv-wrong", items: [["kim", null], ["kem", null], ["ngày", null], ["nghài", "ngài"], ["cúm", null], ["gim", "ghim"]] },
    { kind: "tv-cloze", items: [{ s: "Hà và chị chơi ….", options: ["mũm mĩm", "nhảy dây"], answer: "nhảy dây" }] },
    { kind: "tv-cloze", items: [{ s: "Em bé ….", options: ["mũm mĩm", "nhảy dây"], answer: "mũm mĩm" }] },
    { kind: "tv-fill", letters: ["em", "êm", "im", "um"], words: ["thềm nhà", "cái kim"] },
    { kind: "tv-fill", letters: ["em", "êm", "im", "um"], words: ["bị cúm", "tem thư"] },
    { kind: "tv-match", sentences: [["Nem rán", "thơm ngon."], ["Bà đi", "lom khom."], ["Bé ăn", "quả vải."]] },
    { kind: "tv-spell", words: ["mây", "cơm", "kim"], model: true, letters: ["m", "c", "k", "n"] },
    { kind: "tv-read", items: ["Nhím tìm thấy quả chín."] },
  ],
};
