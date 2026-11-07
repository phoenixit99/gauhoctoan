import type { WeekDef } from "../../types";

// Source: "K1-TIENG VIET-Tuan5" (14/09–18/09/2026, ngày theo phiếu Toán cùng tuần)
// Luyện đọc g, gi, m, n, gh, nh, ng, ngh · TN C1 tiếng có âm nh (hoa / cam / nhà) · C2 hình đúng với "ghế gỗ" · C3 tiếng có âm m (mắt / hoa / na)
// Bài 1 đọc và nối (giỏ ngô, giá đỗ, ghế đá, ca nô) · Bài 2 khoanh từ viết đúng (nho / no, cụ già / cụ dà, mỏ / mọ, nghe / nge)
// Bài 3 điền g / gh · Bài 4 điền ng / ngh · Bài 5 thêm dấu hỏi / nặng · Bài 6 nối tạo thành từ · Bài 7 viết từ theo hình (ngủ)
export const tv05: WeekDef = {
  subject: "tv",
  id: 5,
  title: "Tuần 5",
  topic: "Âm g, gh, gi, m, n, nh, ng, ngh",
  dates: "14/09 – 18/09",
  color: "#ffecb3",
  dark: "#ff8f00",
  lessons: [
    {
      id: "tv5-l1",
      title: "Đọc g, gh, gi, m, n, nh, ng, ngh",
      icon: "🔤",
      goal: "Nghe Gấu đánh vần, rồi đọc theo.",
      demo: { kind: "tv-read", items: ["nh", "nhà", "ng", "ngô"] },
      practice: [
        { kind: "tv-read", items: ["g", "gi", "m", "n", "gh", "nh", "ng", "ngh"] },
        { kind: "tv-read", items: ["cá mè", "lá me", "nơ đỏ", "ca nô", "gà gô", "giá đỗ", "cụ già"] },
        { kind: "tv-read", items: ["ghế đá", "nhà gỗ", "lá nho", "ngã ba", "ngõ nhỏ", "nghỉ hè", "củ nghệ"] },
        { kind: "tv-read", items: ["Bà che gió cho ba chú gà.", "Mẹ nhờ Hà bê ghế gỗ."] },
        { kind: "tv-word-pic", words: ["ghế gỗ", "giỏ ngô", "ca nô", "cụ già"] },
      ],
    },
    {
      id: "tv5-l2",
      title: "Tìm âm m, nh, ng, g",
      icon: "🔎",
      goal: "Nghe âm. Nói tên hình. Chọn hình có âm đó.",
      demo: { kind: "tv-sound", sounds: ["nh"] },
      practice: [
        { kind: "tv-sound", sounds: ["nh"] },
        { kind: "tv-sound", sounds: ["m"] },
        { kind: "tv-sound", sounds: ["ng"] },
        { kind: "tv-sound", sounds: ["g", "gh"] },
        { kind: "tv-sound-all", sounds: ["m", "nh", "g"] },
      ],
    },
    {
      id: "tv5-l3",
      title: "Điền g / gh, ng / ngh",
      icon: "🧩",
      goal: "Trước i, e, ê viết gh, ngh. Còn lại viết g, ng.",
      demo: { kind: "tv-fill", letters: ["g", "gh"], words: ["ghế"] },
      practice: [
        { kind: "tv-fill", letters: ["g", "gh"], words: ["gà", "ghế", "gấu", "ghế gỗ", "gồ ghề"] },
        { kind: "tv-fill", letters: ["ng", "ngh"], words: ["ngô", "ngủ", "nghé", "củ nghệ", "ngã ba"] },
        { kind: "tv-fill", letters: ["g", "gh"], words: ["gà", "ghế", "gấu", "gõ mõ", "gà gô"] },
        { kind: "tv-fill", letters: ["ng", "ngh"], words: ["ngô", "nghé", "cá ngừ", "nghỉ ngơi", "ngõ nhỏ"] },
        { kind: "tv-correct-word", pairs: [["nghe", "nge"], ["ghế gỗ", "gế gỗ"], ["nghé", "ngé"]] },
      ],
    },
    {
      id: "tv5-l4",
      title: "Viết đúng, đọc nối",
      icon: "🔗",
      goal: "Đọc chữ, nối với hình. Chọn từ viết đúng.",
      demo: { kind: "tv-match", words: ["giỏ ngô", "giá đỗ", "ghế đá", "ca nô"] },
      practice: [
        { kind: "tv-match", words: ["giỏ ngô", "giá đỗ", "ghế đá", "ca nô"] },
        { kind: "tv-correct-word", pairs: [["nho", "no"], ["cụ già", "cụ dà"], ["mỏ", "mọ"], ["nghe", "nge"]] },
        { kind: "tv-correct-word", pairs: [["ghẹ", "ghẻ"], ["nụ", "nủ"], ["nổ", "nộ"]] },
        { kind: "tv-match", sentences: [["nghỉ", "hè"], ["nho", "nhỏ"], ["bỡ", "ngỡ"], ["giỗ", "cụ"]], join: "từ" },
        { kind: "tv-spell", words: ["ngủ"], letters: ["ng", "ngh", "g", "n"] },
      ],
    },
  ],
  worksheet: [
    { kind: "tv-sound", sounds: ["nh"] },
    { kind: "tv-word-pic", words: ["ghế gỗ"] },
    { kind: "tv-sound", sounds: ["m"] },
    { kind: "tv-match", words: ["giỏ ngô", "giá đỗ", "ghế đá", "ca nô"] },
    { kind: "tv-correct-word", pairs: [["nho", "no"], ["cụ già", "cụ dà"]] },
    { kind: "tv-correct-word", pairs: [["mỏ", "mọ"], ["nghe", "nge"]] },
    { kind: "tv-fill", letters: ["g", "gh"], words: ["gõ mõ", "ghế gỗ", "gà gô", "gỗ gụ", "gồ ghề"] },
    { kind: "tv-fill", letters: ["ng", "ngh"], words: ["ngã ba", "cá ngừ", "củ nghệ", "nghỉ ngơi", "ngõ nhỏ"] },
    { kind: "tv-correct-word", pairs: [["ghẹ", "ghẻ"], ["nụ", "nủ"], ["nổ", "nộ"]] },
    { kind: "tv-match", sentences: [["nghỉ", "hè"], ["nho", "nhỏ"], ["bỡ", "ngỡ"], ["giỗ", "cụ"]], join: "từ" },
    { kind: "tv-spell", words: ["ngủ"], letters: ["ng", "ngh", "g", "n"] },
  ],
};
