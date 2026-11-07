// Names of question kinds, for the parent's progress page.
import type { Spec } from "./types";

export const KIND_LABEL: Record<Spec["kind"], string> = {
  count: "Đếm và chọn số",
  basket: "Bỏ đúng số quả vào giỏ",
  make10: "Thêm cho đủ 10",
  sequence: "Điền số còn thiếu",
  "scene-count": "Đếm một loại trong tranh",
  "color-n": "Tô màu đúng số hình",
  "color-legend": "Tô màu theo bảng",
  match: "Nối nhóm với số",
  "pick-more": "Chọn tranh nhiều hơn",
  "add-equal": "Thêm để bằng nhau",
  "true-false": "Đúng ghi Đ, sai ghi S",
  "adjust-more": "Thêm để nhiều hơn",
  "adjust-equal": "Thêm hoặc bớt để bằng",
  sign: "Điền dấu >, <, =",
  "picture-sign": "Đếm tranh rồi chọn dấu",
  "pick-number": "Chọn số cho ô trống",
  "adjust-counts": "Vẽ thêm hình cho đúng",
  "attr-compare": "Loại nào nhiều hơn",
  "num-tf": "So sánh: đúng hay sai",
  extreme: "Lớn nhất, bé nhất",
  bond: "Gộp và tách số",
  add: "Phép cộng",
  sub: "Phép trừ",
  "expr-sign": "So sánh phép tính với số",
  "calc-match": "Nối phép tính",
  "calc-select": "Chọn phép tính theo kết quả",
  "shape-pick": "Nhận biết hình",
  "shape-object": "Vật có dạng hình gì",
  "shape-match": "Nối vật với hình",
  "shape-all": "Chọn tất cả hình …",
  "shape-count": "Đếm hình",
  "shape-pattern": "Hình tiếp theo",
  "tv-read": "Luyện đọc",
  "tv-trace": "Tập viết nét",
  "tv-tone": "Nhận biết dấu",
  "tv-tone-word": "Tiếng có dấu …",
  "tv-sound": "Hình có âm …",
  "tv-sound-all": "Chọn tất cả hình có âm …",
  "tv-word-pic": "Hình đúng với tiếng",
  "tv-rhyme": "Tiếng có vần …",
  "tv-correct-word": "Chọn từ viết đúng",
  "tv-wrong": "Tìm từ viết sai",
  "tv-cloze": "Chọn từ điền vào câu",
  "tv-order": "Sắp xếp thành câu",
  "tv-fill": "Điền chữ còn thiếu",
  "tv-match": "Đọc và nối",
  "tv-spell": "Ghép âm thành tiếng",
};

/** "add:số còn thiếu" → "Phép cộng (số còn thiếu)". */
export const kindLabel = (k: string) => {
  const [base, variant] = k.split(":");
  const label = KIND_LABEL[base as Spec["kind"]] ?? base;
  return variant ? `${label} (${variant})` : label;
};
