import type { WeekDef } from "../../types";

// Source: "K1-TV-TUAN 7" (28/09–02/10/2026)
// Luyện đọc ph, qu, v, x, y · TN C1 tiếng có âm ph (phở / ngô / gà) · C2 hình đúng với "quả dừa" · C3 tô màu mảnh ghép có âm qu, gi, x, y
// TL C1 đánh dấu X vào từ viết sai (ngĩ, ghế gỗ, gi vở, gế đá) · C2 điền s / x (sữa bò, xe ô tô, sả, xô nhựa)
// Tập viết: y tá, phố cổ, xứ sở, chú ý
export const tv07: WeekDef = {
  subject: "tv",
  id: 7,
  title: "Tuần 7",
  topic: "Âm ph, qu, v, x, y",
  dates: "28/09 – 02/10",
  color: "#b2ebf2",
  dark: "#00838f",
  lessons: [
    {
      id: "tv7-l1",
      title: "Đọc ph, qu, v, x, y",
      icon: "🔤",
      goal: "Nghe Gấu đánh vần, rồi đọc theo.",
      demo: { kind: "tv-read", items: ["ph", "phở", "qu", "quà"] },
      practice: [
        { kind: "tv-read", items: ["ph", "qu", "v", "x", "y"] },
        { kind: "tv-read", items: ["pha trà", "phố cổ", "phở bò", "quê nhà", "quả khế", "dã quỳ"] },
        { kind: "tv-read", items: ["vi vu", "vỉa hè", "xe lu", "quý giá", "thị xã", "quả cà"] },
        { kind: "tv-read", items: ["Nghỉ hè, cả nhà Hà đi phà về quê.", "Quê Hà là xứ sở của dừa.", "Xa xa, bờ đê có bò, có bê, có nghé."] },
        { kind: "tv-word-pic", words: ["quả dừa", "phở", "quà", "xe"] },
      ],
    },
    {
      id: "tv7-l2",
      title: "Tìm âm ph, qu, gi, x, y",
      icon: "🔎",
      goal: "Nghe âm. Nói tên hình. Chọn hình có âm đó.",
      demo: { kind: "tv-sound", sounds: ["ph"] },
      practice: [
        { kind: "tv-sound", sounds: ["ph"] },
        { kind: "tv-sound", sounds: ["qu"] },
        { kind: "tv-sound-all", sounds: ["qu", "gi"], words: ["quả", "quê", "giỏ", "giò", "xô", "xa", "y tá"] },
        { kind: "tv-sound", sounds: ["x"] },
        { kind: "tv-sound-all", sounds: ["x", "y"], words: ["quả", "giỏ", "xô", "xa", "y tá", "ý", "quê"] },
      ],
    },
    {
      id: "tv7-l3",
      title: "Điền s / x",
      icon: "🧩",
      goal: "Gấu đọc từ. Nhớ cách viết: s hay x.",
      demo: { kind: "tv-fill", letters: ["s", "x"], words: ["xe"] },
      practice: [
        { kind: "tv-fill", letters: ["s", "x"], words: ["sò", "xe", "sư tử", "sữa bò"] },
        { kind: "tv-fill", letters: ["s", "x"], words: ["xe ô tô", "sả", "xô nhựa", "xứ sở"] },
        { kind: "tv-fill", letters: ["s", "x"], words: ["sò", "xe", "sư tử", "sữa bò"] },
        { kind: "tv-fill", letters: ["s", "x"], words: ["xe ô tô", "sả", "xô nhựa", "xứ sở"] },
        { kind: "tv-wrong", items: [["ngĩ", "nghĩ"], ["ghế gỗ", null], ["gi vở", "ghi vở"], ["gế đá", "ghế đá"]] },
      ],
    },
    {
      id: "tv7-l4",
      title: "Tìm từ viết sai, tập viết",
      icon: "✏️",
      goal: "Trước i, e, ê viết gh, ngh. Ghép âm để viết.",
      demo: { kind: "tv-wrong", items: [["ngĩ", "nghĩ"], ["ghế gỗ", null], ["gi vở", "ghi vở"], ["gế đá", "ghế đá"]] },
      practice: [
        { kind: "tv-wrong", items: [["nghé", null], ["gà", null], ["ghi vở", null], ["ngỉ hè", "nghỉ hè"], ["gế", "ghế"]] },
        { kind: "tv-spell", words: ["y tá"], model: true, letters: ["t", "th", "y", "d"] },
        { kind: "tv-spell", words: ["phố cổ"], model: true, letters: ["ph", "c", "k", "qu"] },
        { kind: "tv-spell", words: ["xứ sở"], model: true, letters: ["x", "s", "ch", "th"] },
        { kind: "tv-spell", words: ["chú ý"], model: true, letters: ["ch", "tr", "kh", "y"] },
      ],
    },
  ],
  worksheet: [
    { kind: "tv-sound", sounds: ["ph"] },
    { kind: "tv-word-pic", words: ["quả dừa"] },
    { kind: "tv-sound-all", sounds: ["qu", "gi"], words: ["quả", "quê", "giỏ", "giò", "xô", "xa", "y tá"] },
    { kind: "tv-sound-all", sounds: ["x", "y"], words: ["quả", "giỏ", "xô", "xa", "y tá", "ý", "quê"] },
    { kind: "tv-wrong", items: [["ngĩ", "nghĩ"], ["ghế gỗ", null], ["gi vở", "ghi vở"], ["gế đá", "ghế đá"]] },
    { kind: "tv-fill", letters: ["s", "x"], words: ["sữa bò"] },
    { kind: "tv-fill", letters: ["s", "x"], words: ["xe ô tô"] },
    { kind: "tv-fill", letters: ["s", "x"], words: ["sả", "xô nhựa"] },
    { kind: "tv-spell", words: ["y tá", "chú ý"], model: true, letters: ["t", "ch", "tr", "y"] },
    { kind: "tv-spell", words: ["phố cổ", "xứ sở"], model: true, letters: ["ph", "c", "x", "s"] },
  ],
};
