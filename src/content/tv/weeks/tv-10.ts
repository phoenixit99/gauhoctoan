import type { WeekDef } from "../../types";

// Source: "K1-TV-Tuần 10" (19/10–23/10/2026)
// TN C1 tiếng có vần ao (táo / kẹo / rau) · C2 hình đúng với "cái lều" · C3 chọn từ điền vào câu (gửi) · C4 nhìn ảnh chọn từ (câu cá)
// C5 đọc và nối (châu chấu, rau củ, cái lều, mèo con) · C6 đọc bài, nối câu trả lời · C7 sắp xếp thành câu
// Tập viết: thi đấu, quả lựu, "Bé và ba đi đá cầu."
export const tv10: WeekDef = {
  subject: "tv",
  id: 10,
  title: "Tuần 10",
  topic: "Vần ao, eo, au, âu, êu, iu, ưu",
  dates: "19/10 – 23/10",
  color: "#f0f4c3",
  dark: "#827717",
  lessons: [
    {
      id: "tv10-l1",
      title: "Đọc vần ao, eo, au, âu…",
      icon: "🔤",
      goal: "Nghe Gấu đánh vần, rồi đọc theo.",
      demo: { kind: "tv-read", items: ["ao", "táo", "êu", "lều"] },
      practice: [
        { kind: "tv-read", items: ["ao", "eo", "au", "âu", "êu", "iu", "ưu"] },
        { kind: "tv-read", items: ["cái lều", "châu chấu", "rau củ", "mèo con", "cầu khỉ", "ao bèo"] },
        { kind: "tv-read", items: ["rau má", "dưa hấu", "trĩu quả", "quả lựu", "thi đấu"] },
        { kind: "tv-read", items: ["Nhà dì Tư ở quê có cầu khỉ, ao bèo.", "Sau nhà có rau má và cả dưa hấu.", "Đào, lựu đều trĩu quả."] },
        { kind: "tv-word-pic", words: ["cái lều", "châu chấu", "rau củ", "mèo con"] },
      ],
    },
    {
      id: "tv10-l2",
      title: "Tìm vần",
      icon: "🔎",
      goal: "Nghe vần. Nói tên hình. Chọn hình có vần đó.",
      demo: { kind: "tv-rhyme", rhymes: ["ao"], words: ["táo", "kẹo", "rau"] },
      practice: [
        { kind: "tv-rhyme", rhymes: ["ao", "eo"] },
        { kind: "tv-rhyme", rhymes: ["au", "âu"] },
        { kind: "tv-rhyme", rhymes: ["êu", "iu", "ưu"] },
        { kind: "tv-rhyme", rhymes: ["ao", "eo", "au", "âu"] },
        { kind: "tv-match", words: ["châu chấu", "rau củ", "cái lều", "mèo con"] },
      ],
    },
    {
      id: "tv10-l3",
      title: "Chọn từ điền vào câu",
      icon: "🧩",
      goal: "Thử từng từ vào chỗ trống. Chọn từ đúng với câu.",
      demo: { kind: "tv-cloze", items: [{ s: "Bạn nhỏ ….", options: ["trốn tìm", "kéo co", "câu cá"], answer: "câu cá", emoji: "🎣" }] },
      practice: [
        { kind: "tv-cloze", items: [{ s: "Châu … thư cho bạn.", options: ["lau", "đào", "gửi"], answer: "gửi" }] },
        { kind: "tv-cloze", items: [{ s: "Bạn nhỏ ….", options: ["trốn tìm", "kéo co", "câu cá"], answer: "câu cá", emoji: "🎣" }] },
        { kind: "tv-read", items: ["Nhà dì Tư ở quê có cầu khỉ, ao bèo.", "Sau nhà có rau má và cả dưa hấu."] },
        { kind: "tv-match", sentences: [["Nhà dì Tư", "ở quê."], ["Sau nhà dì Tư có", "rau má, dưa hấu."]] },
        { kind: "tv-cloze", items: [{ s: "Mèo con … cây cau.", options: ["trèo", "thêu", "kêu"], answer: "trèo", emoji: "🐱" }] },
      ],
    },
    {
      id: "tv10-l4",
      title: "Sắp xếp câu, tập viết",
      icon: "✏️",
      goal: "Thẻ có chữ viết hoa đứng đầu câu. Ghép âm và vần để viết.",
      demo: { kind: "tv-order", sentences: [["Chú mèo", "trèo", "cây cau."]] },
      practice: [
        { kind: "tv-order", sentences: [["Chú mèo", "trèo", "cây cau."]] },
        { kind: "tv-order", sentences: [["Bà", "thêu", "khăn tay", "cho bé."]] },
        { kind: "tv-spell", words: ["thi đấu"], model: true, letters: ["th", "tr", "đ", "d"] },
        { kind: "tv-spell", words: ["quả lựu"], model: true, letters: ["qu", "c", "l", "n"] },
        { kind: "tv-read", items: ["Bé và ba đi đá cầu."] },
      ],
    },
  ],
  worksheet: [
    { kind: "tv-rhyme", rhymes: ["ao"], words: ["táo", "kẹo", "rau"] },
    { kind: "tv-word-pic", words: ["cái lều"] },
    { kind: "tv-cloze", items: [{ s: "Châu … thư cho bạn.", options: ["lau", "đào", "gửi"], answer: "gửi" }] },
    { kind: "tv-cloze", items: [{ s: "Bạn nhỏ ….", options: ["trốn tìm", "kéo co", "câu cá"], answer: "câu cá", emoji: "🎣" }] },
    { kind: "tv-match", words: ["châu chấu", "rau củ", "cái lều", "mèo con"] },
    { kind: "tv-read", items: ["Nhà dì Tư ở quê có cầu khỉ, ao bèo.", "Sau nhà có rau má và cả dưa hấu.", "Đào, lựu đều trĩu quả."] },
    { kind: "tv-match", sentences: [["Nhà dì Tư", "ở quê."], ["Sau nhà dì Tư có", "rau má, dưa hấu."]] },
    { kind: "tv-order", sentences: [["Chú mèo", "trèo", "cây cau."]] },
    { kind: "tv-order", sentences: [["Bà", "thêu", "khăn tay", "cho bé."]] },
    { kind: "tv-spell", words: ["thi đấu", "quả lựu"], model: true, letters: ["th", "đ", "qu", "l"] },
    { kind: "tv-read", items: ["Bé và ba đi đá cầu."] },
  ],
};
