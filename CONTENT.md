# Thêm bài học cho một tuần mới

App có **hai môn**: Toán (`src/content/weeks/`) và Tiếng Việt (`src/content/tv/weeks/`). Ở sân trường, bé chọn **môn** trước, rồi mới chọn **tuần**. Mỗi tuần có trường `subject` (`"toan"` hoặc `"tv"`). Mã bài của Toán là `t4-l1`, `t4-ws`; của Tiếng Việt là `tv4-l1`, `tv4-ws`. **Không đổi mã bài Toán**, vì tiến độ (sao) đã lưu của bé dựa vào các mã đó.

Đường đi của bé trong app: **cổng trường** → đi bộ vào **sân trường** → chọn **học liệu (tuần)** → đi vào **phòng học đầu tiên bên trái** (tầng trệt) → chọn bài trên **bảng đen** → học bài. Mỗi tuần mới thêm vào `WEEKS` sẽ tự xuất hiện thành một thẻ học liệu ở sân trường.

Mỗi tuần ở trường có một **phiếu bài tập Toán (PDF)**. App dạy trước các kỹ năng của phiếu đó, rồi cho bé làm một **phiếu bài tập thử** có cùng dạng câu hỏi (số được đổi ngẫu nhiên mỗi lần).

## Cách thêm Tuần N

1. Đọc phiếu PDF. Với mỗi câu, chọn một `kind` trong bảng dưới đây.
2. Copy `src/content/weeks/tuan-04.ts` thành `tuan-NN.ts` rồi sửa:
   - `id`, `title`, `topic`, `dates`, màu `color`/`dark`
   - `lessons`: 3–4 bài, mỗi bài gồm `goal` (một câu dễ hiểu), `demo` (Gấu làm mẫu) và `practice` (5 câu)
   - `worksheet`: các câu theo **đúng thứ tự trong phiếu**
3. Đăng ký tuần mới trong `src/content/weeks/index.ts` (thêm vào `WEEKS`).
4. Nếu phiếu có dạng câu mới chưa có trong bảng: thêm `kind` vào `Spec` (`src/content/types.ts`), viết phần sinh câu hỏi trong `src/content/generate.ts`, và chỉ viết thêm renderer mới (`src/components/ex/`) khi các renderer có sẵn không làm được.

Không đưa logo, hình ảnh hay nhân vật trong phiếu của trường vào app. Chỉ dùng emoji và hình 3D của app.

## Phương pháp từng bước (cho mọi bé, kể cả bé ASD)

Mỗi **dạng câu** (`kind`) có một phương pháp cố định gồm 3–4 bước, khai báo trong `src/content/methods.ts`. Dạng câu đó xuất hiện ở đâu (bài học, luyện tập hay phiếu bài tập) thì các bước cũng giữ đúng thứ tự và đúng câu chữ, để bé luôn biết trước mình sẽ làm gì.

- **Màn hình mục tiêu:** Gấu đọc lần lượt từng bước, bước đang đọc sáng lên.
- **Gấu làm mẫu và gợi ý bậc 3:** Gấu làm từng bước với số thật của câu hỏi (`walk` trong `generate.ts`). Bước nào đang làm thì sáng lên trên thanh ① ② ③.
- **Gợi ý bậc 1:** Gấu chỉ về bước 1 ("Mình làm lại từ bước 1: …"), không đọc lại cả danh sách.
- Dạng câu chưa có phương pháp thì không hiện thanh bước và chạy như cũ.

**Thêm phương pháp cho một dạng câu:**
1. Thêm các bước vào `METHODS` (`methods.ts`).
2. Trong `generate.ts`, thêm `walk` có **đúng số bước đó**. Mỗi bước một câu `say` dùng số thật của câu hỏi. Có thể kèm `count` (đếm to từng hình), `show` (hiện khối hoặc số đếm), `fill` (hiện đáp án) hoặc `row` (sửa từng hình của một hàng).

**Quy tắc viết lời (bài giảng, gợi ý, phương pháp):**
1. Câu ngắn. Mỗi câu chỉ có một việc cần làm.
2. Nói đúng nghĩa đen. Không ẩn dụ, không thành ngữ (ví dụ: không dùng "miệng cá sấu"; dùng "đầu nhọn chỉ vào số bé hơn").
3. Mỗi khái niệm chỉ dùng một từ. Với **số**, dùng "lớn hơn / bé hơn / bằng". Với **nhóm đồ vật**, dùng "nhiều hơn / ít hơn / bằng nhau". Không dùng từ khác như "đông hơn".
4. Lời nói phải khớp với hình trên màn hình. Nếu nói "khối" thì trên màn hình phải có khối.
5. Phương pháp so sánh luôn nói rõ phải làm gì khi **hai bên bằng nhau**.
6. Nói điều cần làm, không nói điều không được làm. Khi bé làm sai, nói "Chưa đúng", không nói "Gần đúng rồi".

## Cách dạy cho bé ASD (đã có sẵn trong app, áp dụng cho mọi bài)

- **Biết trước mọi việc (TEACCH):** mục tiêu → các bước ①②③ → "Câu X/N" và các chấm → dải "✏️ Làm N câu → 🎁 Chọn sticker" → màn hình "Xong rồi", lần nào cũng giống nhau.
- **Gợi ý theo bậc, rút dần** (`Runner.tsx`): dạng câu mới thì đầu mỗi câu Gấu sáng và đọc bước 1. Bé làm đúng thì bậc 2 → 1 (chỉ sáng) → 0 (không gợi ý); bé sai thì tăng lại. Bậc gợi ý lưu theo `kind` (`support` trong `store.ts`).
- **Bé chưa chạm** sau `autoHintSec` giây (cài đặt): lần 1 Gấu đọc bước 1, lần 2 Gấu đưa gợi ý đếm (hint 2). Gợi ý này **không tính là lỗi**.
- **Khi sai:** lần 1 Gấu nói "Chưa đúng. Mình làm lại từ bước 1". Lần 2 Gấu làm mẫu cả câu, rồi cho một câu dễ hơn (`easier()` trong `generate.ts`). Câu nói khi sai luôn bắt đầu bằng "Chưa đúng." **Không rung, không đỏ, không buzz.**
- **Khen cố định:** "Đúng rồi! {tên} giỏi lắm." Pháo giấy tắt theo mặc định.
- **Không trừ sao trước mặt bé:** bé chỉ thấy "Xong rồi" và chọn phần thưởng. Sao chỉ dùng nội bộ (đánh dấu cần ôn); phụ huynh xem bé "đã thuộc" dạng nào (3 câu gần nhất đúng ngay, không gợi ý).
- **Khái quát hóa:** dạng câu bé chưa thuộc thì luôn dùng cùng một hình (`objectPool`, `fixed`). Thuộc rồi mới đổi hình.
- **Chủ đề bé thích** (`theme`): con vật, hoa quả, xe cộ. Mỗi bộ cần **ít nhất 4 hình khác nhau** và tên phải có **loại từ** (con, quả, chiếc…). Khi viết câu nói, không ghi cứng "con vật" hay "quả". Dùng `o.name`.
- Nút **Nghỉ** (góc trên phải) và nút **⚙️ phụ huynh** (giữ 2 giây) luôn ở cùng chỗ. Đừng đặt nút khác vào góc đó.

Dạng câu đã có phương pháp: `sign`, `picture-sign`, `attr-compare`, `pick-number`, `adjust-counts` (Tuần 4), mọi dạng mới của Tuần 5–11 và mọi dạng Tiếng Việt.

**Lời nói có ký hiệu:** giọng đọc tiếng Việt đọc sai "+ − = ☐". Câu nào có ký hiệu thì dùng `st()` / `spoken()` (`src/content/mathUtil.ts`): màn hình hiện "3 + 2 = 5", Gấu nói "3 cộng 2 bằng 5".

## Các dạng câu có sẵn

| `kind` | Dạng trong phiếu | Renderer |
|---|---|---|
| `count` | Có bao nhiêu …? (A/B/C), `min: 0` cho phép ô trống = số 0, `dice: true` = chấm tròn như mặt xúc xắc | ChooseEx |
| `basket` | Bỏ n quả vào giỏ (3D) | BasketEx |
| `make10` | Để có 10 cần thêm …? | ChooseEx (thẻ hình) |
| `sequence` | Số? đoàn tàu / dây cờ, xuôi / ngược, `to: 5` hoặc `10` | SequenceEx |
| `scene-count` | Đếm một loại trong tranh nhiều loại (`max` = số lớn nhất) | ChooseEx |
| `color-n` | Tô màu n hình (theo mẫu) | ColorEx |
| `color-legend` | Tô màu theo yêu cầu: Số 1 màu vàng… | ChooseEx |
| `match` | Nối nhóm đồ vật với số | MatchEx |
| `pick-more` | Chọn tranh có nhiều hơn | ChooseEx (thẻ hình) |
| `add-equal` | Thêm bao nhiêu để bằng (A/B/C) | ChooseEx |
| `true-false` | Đúng ghi Đ, sai ghi S | ChooseEx |
| `adjust-more` | Vẽ thêm để nhiều hơn | AdjustEx |
| `adjust-equal` | Vẽ thêm hoặc gạch bớt để bằng | AdjustEx |
| `sign` | Điền dấu >, <, = | ChooseEx |
| `picture-sign` | Viết phép so sánh từ tranh | ChooseEx |
| `pick-number` | Nối ô trống với số (7 > ☐) | ChooseEx |
| `adjust-counts` | Vẽ thêm hình theo mẫu (2 < 3) | AdjustEx |
| `attr-compare` | Đếm theo màu rồi so sánh | ChooseEx |
| `num-tf` | Đúng ghi Đ, sai ghi S: 8 > 9 | ChooseEx |
| `extreme` | Số lớn nhất / bé nhất (`mode`), tranh nhiều nhất / ít nhất (`pictures: true`) | ChooseEx |
| `bond` | Tách số: 8 gồm 5 và ☐ (`mode: "split"`) · gộp hai nhóm (`"join"`); `pictures` = hiện hình ngay | ChooseEx (sơ đồ tách–gộp) |
| `add` | 2 + 4 = ☐ · `pictures` (phép cộng từ tranh) · `missing` (6 + ☐ = 8) · `terms: 3` (3 + 4 + 1) | ChooseEx |
| `sub` | 7 − 3 = ☐ · `pictures` · `missing` (4 − ☐ = 3) · `bond` (7 gồm 4 và 3 → 7 − 3) | ChooseEx |
| `expr-sign` | Điền dấu: 3 + 2 ☐ 6 | ChooseEx |
| `calc-match` | Nối phép tính với kết quả (`to: "number"`) hoặc với phép tính cùng kết quả (`"expr"`) | PairEx |
| `calc-select` | Tô tất cả quả táo có kết quả bằng 10 | SelectEx |
| `shape-pick` | Chọn hình tròn / vuông / tam giác / chữ nhật | ChooseEx |
| `shape-object` | Vật này có dạng hình gì? | ChooseEx |
| `shape-match` | Nối mỗi vật với tên hình | PairEx |
| `shape-all` | Tô màu tất cả hình tam giác | SelectEx |
| `shape-count` | Trong hình có mấy hình vuông? | ChooseEx |
| `shape-pattern` | Hình thích hợp đặt vào dấu ? | ChooseEx |

**Tiến độ theo phương pháp:** mức gợi ý, số lần làm và "đã thuộc" được lưu theo `methodKey(spec)` (`methods.ts`), không chỉ theo `kind`. Ví dụ `add` và `add:số còn thiếu` có các bước khác nhau nên được tính riêng. Khi thêm biến thể mới có các bước khác, thêm vào `variantOf`.

Hình phẳng được vẽ bằng SVG (`src/content/shapes.ts`, `src/components/ex/Emo.tsx`), không dùng emoji (không có emoji hình chữ nhật). Ở chỗ cần emoji, viết `shapeToken("tron")`. Mọi hình trong một câu cùng một màu, để bé phân biệt theo hình chứ không theo màu.

**Chưa làm (Toán):** Tuần 8 C4 (ghép hai miếng bìa thành một hình) và đếm hình chữ nhật chồng lên nhau (C5); Tuần 11 C6 (tháp số).

Mọi câu hỏi đều được đọc thành tiếng và có gợi ý 3 bậc: nhắc → đếm cùng → Gấu làm mẫu, sau đó bé làm thêm 1 câu tương tự.


## Tiếng Việt

**Thêm Tuần N:** copy `src/content/tv/weeks/tv-04.ts` thành `tv-NN.ts`, đặt `subject: "tv"` và id bài dạng `tvN-lK`, rồi thêm vào `TV_WEEKS` (`src/content/tv/weeks/index.ts`). Dạng câu và từ vựng nằm trong `src/content/tv/`:

- `words.ts`: kho từ có hình, cách tách tiếng (âm đầu, vần, dấu), cách đánh vần và cách kiểm tra "có âm …".
- `generate.ts`: sinh câu hỏi. Câu nào cũng có `walk` để Gấu làm mẫu từng bước.
- `strokes.ts`: hình các nét cơ bản. Muốn đổi hình một nét, chỉ sửa dòng `d` của nét đó.

| `kind` | Dạng trong phiếu | Renderer |
|---|---|---|
| `tv-read` | Luyện đọc: chạm thẻ, Gấu đánh vần rồi đọc | ReadEx |
| `tv-trace` | Tập viết nét (kéo ngón tay theo đường chấm) | TraceEx |
| `tv-tone` | Dấu huyền là dấu nào? | ChooseEx |
| `tv-tone-word` | Tiếng có dấu sắc là? (`pictures: true` = chọn hình) | ChooseEx |
| `tv-sound` | Vật chứa tiếng có âm a là? | ChooseEx (thẻ hình) |
| `tv-sound-all` | Nối/tô tất cả hình (hoặc tiếng, `words`) có âm … | SelectEx |
| `tv-word-pic` | Hình đúng với tiếng/từ … là? | ChooseEx (thẻ hình) |
| `tv-correct-word` | Khoanh từ viết đúng (cà / cá) | ChooseEx |
| `tv-fill` | Điền d hay đ / i, u, ư / k, ch, kh | ChooseEx |
| `tv-match` | Đọc và nối chữ ↔ hình (`words`), hoặc nối thành câu (`sentences`) | PairEx |
| `tv-spell` | Viết tên sự vật, hoặc tập viết từ mẫu (`model: true`): ghép âm đầu → âm thứ hai (hoặc vần) → dấu. Tiếng không có âm đầu (y, ý) thì bỏ ô âm đầu | SpellEx |
| `tv-rhyme` | Tiếng có vần on là? (`words` = chỉ chọn trong các từ này) | ChooseEx (thẻ hình) |
| `tv-correct-word` + `pairs` | Khoanh từ viết đúng: [đúng, sai], ví dụ ["nghe", "nge"] | ChooseEx |
| `tv-wrong` | Đánh dấu X vào từ viết sai: [chữ hiện ra, cách viết đúng hoặc `null`] | SelectEx |
| `tv-cloze` | Chọn từ điền vào chỗ trống trong câu (có thể kèm hình `emoji`) | ChooseEx |
| `tv-order` | Sắp xếp các từ thành câu | OrderEx |

`tv-fill` điền được âm đầu (d / đ, g / gh, ng / ngh, s / x, th / tr), âm (i / u / ư) và vần (am / ăm / âm…). Từ không có trong kho từ thì hiện chữ, không có hình, Gấu đọc từ đó.

**Quy tắc riêng cho Tiếng Việt (để trẻ ASD hiểu đúng nghĩa đen):**
1. **Tên hình là từ trần, không có loại từ.** Viết "chó", không viết "con chó"; viết "na", không viết "quả na". Lý do: "con" có âm c, "quả" có âm a, nên câu hỏi về âm sẽ bị mâu thuẫn. Dùng từ miền Bắc như phiếu của trường.
2. Ở câu hỏi về âm và dấu, **Gấu nói tên từng hình**. Bài này kiểm tra việc nghe âm, không kiểm tra việc đoán tên hình.
3. Hình gây nhiễu **không được chứa chữ của âm cần tìm ở bất kỳ đâu**. Ví dụ: "chó" không bao giờ được dùng làm hình gây nhiễu cho âm c, và cũng không được tính là "có âm c". Tiếng có vần đôi (cua, dừa, hoa, chuối…) không được tính là "có âm a / u / o" (`hasSound`).
4. Gấu chỉ dùng một từ cho mỗi khái niệm:
   - **âm**: một âm, ví dụ âm bờ
   - **tiếng**: một âm tiết, ví dụ bé
   - **từ**: nhiều tiếng, ví dụ bí đỏ
   - **dấu**: dấu huyền, dấu sắc… (phiếu Tuần 2 viết "thanh sắc", nhưng app luôn nói "dấu sắc")
   - **đánh vần**: bờ, e, be, sắc, bé
5. Màn hình hiện chữ "b" thì Gấu đọc là "bờ". Khi chữ hiện ra khác với lời nói, dùng `caption` riêng cho bước đó.
6. **vần**: phần sau âm đầu có nhiều chữ cái (an, ao, ia…). Gấu nói "tiếng có vần on", kể cả khi phiếu viết "Từ có vần on".
7. **g / gh, ng / ngh, c / k nghe giống nhau.** Gấu nói rõ quy tắc: "Trước i, e, ê viết gh. Còn lại viết g. Sau âm đầu là ê, nên viết gh." Gấu gọi gh là "gờ kép", ngh là "ngờ kép". Với s / x, ch / tr, d / gi, Gấu không nói là nghe được khác nhau. Gấu nói "Nhớ cách viết: sả viết bằng s." Hình gây nhiễu không bao giờ chứa âm đọc giống âm cần tìm (`lacksSound`).
8. Từ trong kho có vần nhiều chữ cái được đánh dấu `late`. Các từ này chỉ dùng khi tuần ghi tên từ đó, hoặc trong câu hỏi về vần. Bé tuần 1–4 không gặp các từ này.
9. Một hình chỉ có một tên. Không cho hai từ khác nhau dùng chung emoji, trừ các cặp trong `SHARED_EMOJI_OK` (`words.ts`): 🌿 lá chè / tía tô, 🦗 dế / châu chấu, 🌱 cỏ / giá đỗ. Từ không có hình phù hợp thì để `emoji: ""` (Gấu đọc chữ).
10. Chỉ dùng emoji có trên iPad đời cũ. Chữ "ghép tiếng" và chữ có ô trống chỉ dùng tiếng có vần một chữ cái (ba, khỉ, chợ).

**Chưa làm:**
- Câu "Tô màu tư thế ngồi học đúng" (Tuần 1), vì câu này cần hình của trường.
- Viết câu (Tuần 9, 10): app cho bé luyện đọc câu, chưa cho viết cả câu.
- Câu "nối câu trả lời" có một thẻ thừa (Tuần 10): app bỏ thẻ thừa.
- "lọ mực" (Tuần 11) không có emoji phù hợp, nên app dùng "con sóc".
