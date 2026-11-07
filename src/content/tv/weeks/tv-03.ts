import type { WeekDef } from "../../types";

// Source: "K1-TV-Tuần 3" (31/08–04/09/2026) — Bài 6–10: O o, Ô ô, Ơ ơ, D d, Đ đ
// 1. Đọc: đỡ bò đố để dẻ đò · đố bé, bò bê, cô bé, cá cờ, bờ đê · Bà đố bé. Bò bê có cỏ.
// B1 đánh dấu sự vật có âm ô (cô / cò / đỗ) · B2 điền d hay đ (dế / đỗ / đò) · B3 tô hoa chứa âm ơ (dỡ dỗ đỏ đờ)
// B4 nối (Bố – đỡ bé, Bờ đê – có cỏ, Bé có – cá cờ) · 3. Viết: da, dỗ, đê, bờ đê
export const tv03: WeekDef = {
  subject: "tv",
  id: 3,
  title: "Tuần 3",
  topic: "Âm o, ô, ơ, d, đ",
  dates: "31/08 – 04/09",
  color: "#ffe0b2",
  dark: "#ef6c00",
  lessons: [
    {
      id: "tv3-l1",
      title: "Đọc o, ô, ơ, d, đ",
      icon: "🔤",
      goal: "Nghe Gấu đánh vần, rồi đọc theo.",
      demo: { kind: "tv-read", items: ["o", "ô", "ơ", "bò", "đò"] },
      practice: [
        { kind: "tv-read", items: ["o", "ô", "ơ", "d", "đ"] },
        { kind: "tv-read", items: ["đỡ", "bò", "đố", "để", "dẻ", "đò"] },
        { kind: "tv-read", items: ["đố bé", "bò bê", "cô bé", "cá cờ", "bờ đê"] },
        { kind: "tv-read", items: ["Bà đố bé.", "Bò bê có cỏ."] },
        { kind: "tv-sound", sounds: ["o", "ô", "ơ", "d", "đ"] },
      ],
    },
    {
      id: "tv3-l2",
      title: "Tìm âm ô, ơ",
      icon: "🔎",
      goal: "Nghe âm. Tìm hình hoặc tiếng có âm đó.",
      demo: { kind: "tv-sound", sounds: ["ô"] },
      practice: [
        { kind: "tv-sound", sounds: ["ô"] },
        { kind: "tv-sound", sounds: ["ơ"] },
        { kind: "tv-sound-all", sounds: ["ơ"], words: ["dỡ", "dỗ", "đỏ", "đờ"] },
        { kind: "tv-sound", sounds: ["o"] },
        { kind: "tv-sound-all", sounds: ["ô"], words: ["bố", "bò", "cô", "cờ", "đỗ", "đỏ"] },
      ],
    },
    {
      id: "tv3-l3",
      title: "d hay đ",
      icon: "🦗",
      goal: "Đánh vần tiếng. Nghe âm đầu là dờ hay đờ.",
      demo: { kind: "tv-fill", letters: ["d", "đ"], words: ["dế"] },
      practice: [
        { kind: "tv-fill", letters: ["d", "đ"], words: ["dế", "dê", "dù"] },
        { kind: "tv-fill", letters: ["d", "đ"], words: ["đò", "đào", "đũa"] },
        { kind: "tv-fill", letters: ["d", "đ"], words: ["dế", "đò", "dê", "đũa", "dù", "đào", "dừa"] },
        { kind: "tv-fill", letters: ["d", "đ"], words: ["dế", "đò", "dê", "đũa", "dù", "đào", "dừa"] },
        { kind: "tv-fill", letters: ["d", "đ"], words: ["dế", "đò", "dê", "đũa", "dù", "đào", "dừa"] },
      ],
    },
    {
      id: "tv3-l4",
      title: "Nối câu, viết",
      icon: "🔗",
      goal: "Nối phần đầu với phần cuối. Ghép âm để viết.",
      demo: { kind: "tv-match", sentences: [["Bố", "đỡ bé."], ["Bờ đê", "có cỏ."], ["Bé có", "cá cờ."]] },
      practice: [
        { kind: "tv-match", sentences: [["Bố", "đỡ bé."], ["Bờ đê", "có cỏ."], ["Bé có", "cá cờ."]] },
        { kind: "tv-spell", words: ["da"], model: true, letters: ["d", "đ", "b"] },
        { kind: "tv-spell", words: ["đê"], model: true, letters: ["d", "đ", "b"] },
        { kind: "tv-spell", words: ["dỗ"], model: true, letters: ["d", "đ", "b"] },
        { kind: "tv-spell", words: ["bờ đê"], model: true, letters: ["d", "đ", "b", "c"] },
      ],
    },
  ],
  worksheet: [
    { kind: "tv-read", items: ["đỡ", "bò", "đố", "đố bé", "bờ đê", "Bò bê có cỏ."] },
    { kind: "tv-sound", sounds: ["ô"] },
    { kind: "tv-fill", letters: ["d", "đ"], words: ["dế"] },
    { kind: "tv-fill", letters: ["d", "đ"], words: ["đò"] },
    { kind: "tv-fill", letters: ["d", "đ"], words: ["đũa", "đào", "dê", "dù"] },
    { kind: "tv-sound-all", sounds: ["ơ"], words: ["dỡ", "dỗ", "đỏ", "đờ"] },
    { kind: "tv-match", sentences: [["Bố", "đỡ bé."], ["Bờ đê", "có cỏ."], ["Bé có", "cá cờ."]] },
    { kind: "tv-spell", words: ["da", "đê", "dỗ"], model: true, letters: ["d", "đ", "b"] },
    { kind: "tv-spell", words: ["bờ đê"], model: true, letters: ["d", "đ", "b", "c"] },
  ],
};
