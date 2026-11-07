import type { WeekDef } from "../../types";

// Source: "K1-TV-Tuần 11" (26/10–30/10/2026, ngày theo phiếu Toán cùng tuần)
// Luyện đọc ac ăc âc oc ôc uc ưc at ăt ât ot ôt ơt · TN C1 từ có vần at (tất / ớt / bát) · C2 hình đúng với "lọ mực"
// C3, C4 chọn từ điền vào câu (bác sĩ, đi học) · Bài 1 đọc và nối (gấu trúc, tức giận, ốc sên, học bài)
// Bài 2 điền ac / ăc / âc · Bài 3 đánh dấu X vào từ viết sai · Bài 4 điền ot / ôt / ơt · Bài 5 nối tạo thành từ và câu
// Bài 6 chọn từ (hạt dẻ, áo ấm) · Bài 7 viết từ theo hình (rửa bát)
// "lọ mực" không có hình emoji phù hợp: app dùng hình "con sóc" cho câu C2.
export const tv11: WeekDef = {
  subject: "tv",
  id: 11,
  title: "Tuần 11",
  topic: "Vần ac, ăc, âc, oc, ôc, uc, ưc, at, ăt, ât, ot, ôt, ơt",
  dates: "26/10 – 30/10",
  color: "#cfd8dc",
  dark: "#455a64",
  lessons: [
    {
      id: "tv11-l1",
      title: "Đọc vần ac, oc, at, ot…",
      icon: "🔤",
      goal: "Nghe Gấu đánh vần, rồi đọc theo.",
      demo: { kind: "tv-read", items: ["at", "bát", "ơt", "ớt"] },
      practice: [
        { kind: "tv-read", items: ["ac", "ăc", "âc", "oc", "ôc", "uc", "ưc"] },
        { kind: "tv-read", items: ["at", "ăt", "ât", "ot", "ôt", "ơt"] },
        { kind: "tv-read", items: ["bác sĩ", "mắc áo", "quả gấc", "con sóc", "máy xúc", "cái cốc", "con mực"] },
        { kind: "tv-read", items: ["bãi cát", "mặt trời", "quả ớt", "hải tặc", "giấc mơ", "leo dốc"] },
        { kind: "tv-read", items: ["Mấy khóm cúc nở rực rỡ.", "Nghỉ hè, nhà Đức đi nghỉ mát ở Cát Bà.", "Máy xúc đào đất ở bờ đê."] },
      ],
    },
    {
      id: "tv11-l2",
      title: "Tìm vần",
      icon: "🔎",
      goal: "Nghe vần. Nói tên hình. Chọn hình có vần đó.",
      demo: { kind: "tv-rhyme", rhymes: ["at"], words: ["tất", "ớt", "bát"] },
      practice: [
        { kind: "tv-rhyme", rhymes: ["at", "ăt", "ât"] },
        { kind: "tv-rhyme", rhymes: ["oc", "ưc", "ac"] },
        { kind: "tv-rhyme", rhymes: ["ơt", "ut", "at"] },
        { kind: "tv-word-pic", words: ["con sóc", "ốc sên", "gấu trúc", "mặt trời"] },
        { kind: "tv-match", words: ["gấu trúc", "tức giận", "ốc sên", "học bài"] },
      ],
    },
    {
      id: "tv11-l3",
      title: "Điền vần, tìm từ viết sai",
      icon: "🧩",
      goal: "Đánh vần tiếng. Chọn vần còn thiếu.",
      demo: { kind: "tv-fill", letters: ["ot", "ôt", "ơt"], words: ["ớt"] },
      practice: [
        { kind: "tv-fill", letters: ["ac", "ăc", "âc"], words: ["đi lạc", "tắc kè", "quả gấc", "mắc áo", "hạt lạc", "nhạc"] },
        { kind: "tv-fill", letters: ["ot", "ôt", "ơt"], words: ["bột mì", "gọt vỏ", "sốt cao", "cái vợt", "dao thớt", "ớt"] },
        { kind: "tv-wrong", items: [["mức dừa", "mứt dừa"], ["con sóc", null], ["súc đất", "xúc đất"], ["mặt chời", "mặt trời"]] },
        { kind: "tv-fill", letters: ["ac", "ăc", "âc"], words: ["đi lạc", "tắc kè", "quả gấc", "mắc áo", "hạt lạc", "nhạc"] },
        { kind: "tv-fill", letters: ["ot", "ôt", "ơt"], words: ["bột mì", "gọt vỏ", "sốt cao", "cái vợt", "dao thớt", "ớt"] },
      ],
    },
    {
      id: "tv11-l4",
      title: "Chọn từ, nối, viết",
      icon: "🔗",
      goal: "Thử từng từ vào câu. Nối thành từ, thành câu. Ghép âm và vần để viết.",
      demo: { kind: "tv-cloze", items: [{ s: "Sóc nhỏ ăn ….", options: ["áo ấm", "bật lửa", "hạt dẻ"], answer: "hạt dẻ", emoji: "🐿️" }] },
      practice: [
        { kind: "tv-cloze", items: [{ s: "Mẹ của Hà là ….", options: ["quả gấc", "mật mã", "bác sĩ"], answer: "bác sĩ" }] },
        { kind: "tv-cloze", items: [{ s: "Hai bạn rủ nhau ….", options: ["đi học", "đi cấy", "đi bơi"], answer: "đi học", emoji: "🎒" }] },
        { kind: "tv-match", sentences: [["gật", "gù"], ["mát", "mẻ"], ["máy", "giặt"]], join: "từ" },
        { kind: "tv-match", sentences: [["Mẹ giặt", "quần áo."], ["Lạc đà", "đi trên sa mạc."], ["Quả ớt", "có vị cay."]] },
        { kind: "tv-spell", words: ["rửa bát"], letters: ["r", "d", "b", "gi"] },
      ],
    },
  ],
  worksheet: [
    { kind: "tv-rhyme", rhymes: ["at"], words: ["tất", "ớt", "bát"] },
    { kind: "tv-word-pic", words: ["con sóc"] },
    { kind: "tv-cloze", items: [{ s: "Mẹ của Hà là ….", options: ["quả gấc", "mật mã", "bác sĩ"], answer: "bác sĩ" }] },
    { kind: "tv-cloze", items: [{ s: "Hai bạn rủ nhau ….", options: ["đi học", "đi cấy", "đi bơi"], answer: "đi học", emoji: "🎒" }] },
    { kind: "tv-match", words: ["gấu trúc", "tức giận", "ốc sên", "học bài"] },
    { kind: "tv-fill", letters: ["ac", "ăc", "âc"], words: ["đi lạc", "tắc kè", "quả gấc"] },
    { kind: "tv-fill", letters: ["ac", "ăc", "âc"], words: ["mắc áo", "hạt lạc"] },
    { kind: "tv-wrong", items: [["mức dừa", "mứt dừa"], ["con sóc", null], ["súc đất", "xúc đất"], ["mặt chời", "mặt trời"]] },
    { kind: "tv-fill", letters: ["ot", "ôt", "ơt"], words: ["bột mì", "gọt vỏ", "sốt cao"] },
    { kind: "tv-fill", letters: ["ot", "ôt", "ơt"], words: ["cái vợt", "dao thớt"] },
    { kind: "tv-match", sentences: [["gật", "gù"], ["mát", "mẻ"], ["máy", "giặt"]], join: "từ" },
    { kind: "tv-match", sentences: [["Mẹ giặt", "quần áo."], ["Lạc đà", "đi trên sa mạc."], ["Quả ớt", "có vị cay."]] },
    {
      kind: "tv-cloze",
      items: [
        { s: "Sóc nhỏ ăn ….", options: ["áo ấm", "bật lửa", "hạt dẻ"], answer: "hạt dẻ", emoji: "🐿️" },
        { s: "Mẹ dặn em mặc ….", options: ["áo ấm", "bật lửa", "hạt dẻ"], answer: "áo ấm" },
      ],
    },
    { kind: "tv-spell", words: ["rửa bát"], letters: ["r", "d", "b", "gi"] },
  ],
};
