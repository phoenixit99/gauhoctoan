import type { WeekDef } from "../../types";

// Source: "K1-TIENG VIET-Tuan8" (05/10–09/10/2026, ngày theo phiếu Toán cùng tuần)
// Luyện đọc an ăn ân on ôn ơn am ăm âm en ên in un · TN C1 từ có vần on (bốn / lợn / son) · C2 hình đúng với "nấm"
// C3 chọn từ điền vào câu (thảm cỏ) · C4 nhìn ảnh chọn từ (bạn thân) · Bài 1 đọc và nối (bến xe, con giun, ăn cơm, đèn pin)
// Bài 2 điền am / ăm / âm · Bài 3 đánh dấu X vào từ viết sai · Bài 4 điền on / ôn / ơn · Bài 5 nối tạo thành từ và câu
// Bài 6 điền từ có vần ăn / ân (mận, vằn)
export const tv08: WeekDef = {
  subject: "tv",
  id: 8,
  title: "Tuần 8",
  topic: "Vần an, ăn, ân, on, ôn, ơn, am, ăm, âm, en, ên, in, un",
  dates: "05/10 – 09/10",
  color: "#ffcdd2",
  dark: "#c62828",
  lessons: [
    {
      id: "tv8-l1",
      title: "Đọc vần an, on, am, en…",
      icon: "🔤",
      goal: "Nghe Gấu đánh vần, rồi đọc theo.",
      demo: { kind: "tv-read", items: ["on", "son", "ân", "cân"] },
      practice: [
        { kind: "tv-read", items: ["an", "ăn", "ân", "on", "ôn", "ơn", "am"] },
        { kind: "tv-read", items: ["ăm", "âm", "en", "ên", "in", "un"] },
        { kind: "tv-read", items: ["nhà sàn", "bạn thân", "quả mận", "củ sắn", "nón lá", "con chồn", "sơn ca"] },
        { kind: "tv-read", items: ["giòn tan", "ngọn nến", "đèn pin", "con tằm", "củ sâm", "tam ca"] },
        { kind: "tv-read", items: ["Ủn à ủn ỉn.", "Chín chú lợn con.", "Ăn đã no tròn.", "Cả đàn đi ngủ."] },
      ],
    },
    {
      id: "tv8-l2",
      title: "Tìm vần",
      icon: "🔎",
      goal: "Nghe vần. Nói tên hình. Chọn hình có vần đó.",
      demo: { kind: "tv-rhyme", rhymes: ["on"], words: ["bốn", "lợn", "son"] },
      practice: [
        { kind: "tv-rhyme", rhymes: ["on", "ôn", "ơn"] },
        { kind: "tv-rhyme", rhymes: ["an", "ăn", "ân"] },
        { kind: "tv-rhyme", rhymes: ["am", "ăm", "âm"] },
        { kind: "tv-rhyme", rhymes: ["en", "ên", "in"] },
        { kind: "tv-word-pic", words: ["nấm", "đèn pin", "bến xe", "bạn thân"] },
      ],
    },
    {
      id: "tv8-l3",
      title: "Điền vần",
      icon: "🧩",
      goal: "Đánh vần tiếng. Chọn vần còn thiếu.",
      demo: { kind: "tv-fill", letters: ["am", "ăm", "âm"], words: ["tắm"] },
      practice: [
        { kind: "tv-fill", letters: ["am", "ăm", "âm"], words: ["tắm", "quả cam", "nắm cơm", "tam ca", "nấm", "mầm non"] },
        { kind: "tv-fill", letters: ["on", "ôn", "ơn"], words: ["lợn", "thủ môn", "thợ sơn", "phân bón", "son", "bốn"] },
        { kind: "tv-fill", letters: ["am", "ăm", "âm"], words: ["tắm", "quả cam", "nắm cơm", "tam ca", "nấm", "mầm non"] },
        { kind: "tv-fill", letters: ["on", "ôn", "ơn"], words: ["lợn", "thủ môn", "thợ sơn", "phân bón", "son", "bốn"] },
        { kind: "tv-correct-word", pairs: [["ăn", "ăm"], ["cú đấm", "cú đầm"], ["nhà sàn", "nhà xàn"]] },
      ],
    },
    {
      id: "tv8-l4",
      title: "Chọn từ, nối từ và câu",
      icon: "🔗",
      goal: "Thử từng từ vào câu. Nối thành từ, thành câu.",
      demo: { kind: "tv-cloze", items: [{ s: "Thắm và Lan là ….", options: ["bàn ghế", "bạn thân", "bố mẹ"], answer: "bạn thân", emoji: "👭" }] },
      practice: [
        { kind: "tv-cloze", items: [{ s: "Lũ trẻ nô đùa trên ….", options: ["quả mận", "củ sắn", "thảm cỏ"], answer: "thảm cỏ" }] },
        { kind: "tv-match", words: ["bến xe", "ăn cơm", "đèn pin", "bạn thân"] },
        { kind: "tv-match", sentences: [["mua", "bán"], ["cẩn", "thận"], ["căn", "dặn"]], join: "từ" },
        { kind: "tv-match", sentences: [["Chậm", "như chú rùa."], ["Da em bé", "mịn quá!"], ["Mẹ dặn", "bé dọn nhà cho mẹ."]] },
        {
          kind: "tv-cloze",
          items: [
            { s: "Bà cho Nam quả ….", options: ["mận", "vằn"], answer: "mận" },
            { s: "Ngựa … gặm cỏ non.", options: ["mận", "vằn"], answer: "vằn", emoji: "🦓" },
          ],
        },
      ],
    },
  ],
  worksheet: [
    { kind: "tv-rhyme", rhymes: ["on"], words: ["bốn", "lợn", "son"] },
    { kind: "tv-word-pic", words: ["nấm"] },
    { kind: "tv-cloze", items: [{ s: "Lũ trẻ nô đùa trên ….", options: ["quả mận", "củ sắn", "thảm cỏ"], answer: "thảm cỏ" }] },
    { kind: "tv-cloze", items: [{ s: "Thắm và Lan là ….", options: ["bàn ghế", "bạn thân", "bố mẹ"], answer: "bạn thân", emoji: "👭" }] },
    { kind: "tv-match", words: ["bến xe", "ăn cơm", "đèn pin", "bạn thân"] },
    { kind: "tv-fill", letters: ["am", "ăm", "âm"], words: ["tắm", "quả cam", "nắm cơm"] },
    { kind: "tv-fill", letters: ["am", "ăm", "âm"], words: ["tam ca", "mầm non"] },
    { kind: "tv-correct-word", pairs: [["ăn", "ăm"], ["cú đấm", "cú đầm"], ["nhà sàn", "nhà xàn"]] },
    { kind: "tv-fill", letters: ["on", "ôn", "ơn"], words: ["phân bón", "lợn"] },
    { kind: "tv-fill", letters: ["on", "ôn", "ơn"], words: ["thủ môn", "thợ sơn"] },
    { kind: "tv-match", sentences: [["mua", "bán"], ["cẩn", "thận"], ["căn", "dặn"]], join: "từ" },
    { kind: "tv-match", sentences: [["Chậm", "như chú rùa."], ["Da em bé", "mịn quá!"], ["Mẹ dặn", "bé dọn nhà cho mẹ."]] },
    {
      kind: "tv-cloze",
      items: [
        { s: "Bà cho Nam quả ….", options: ["mận", "vằn"], answer: "mận" },
        { s: "Ngựa … gặm cỏ non.", options: ["mận", "vằn"], answer: "vằn", emoji: "🦓" },
      ],
    },
  ],
};
