"use client";
import { useMemo, useState } from "react";
import { useSettings, type Settings, type Theme } from "@/lib/settings";
import { MASTERY_RUN, isMastered, useProgress, type Attempt } from "@/lib/store";
import { kindLabel } from "@/content/kinds";
import { SUBJECTS } from "@/content/subjects";
import { weekStatuses } from "@/lib/progress";
import { speak } from "@/lib/speech";
import { KID, useKid } from "@/lib/kid";
import { KidFields } from "./KidSetup";

type Opt<T> = { v: T; label: string };

function Seg<K extends keyof Settings>({ k, title, note, opts }: { k: K; title: string; note?: string; opts: Opt<Settings[K]>[] }) {
  const value = useSettings((s) => s[k]);
  const set = useSettings((s) => s.set);
  return (
    <div className="flex flex-col gap-1.5">
      <div className="text-lg font-extrabold">{title}</div>
      {note && <div className="-mt-1 text-sm font-semibold text-amber-900/70">{note}</div>}
      <div className="flex flex-wrap gap-2">
        {opts.map((o) => (
          <button
            key={String(o.v)}
            onClick={() => set({ [k]: o.v } as Partial<Settings>)}
            aria-pressed={value === o.v}
            className={`rounded-2xl px-4 py-2 text-base font-bold shadow ${value === o.v ? "bg-orange-400 text-white" : "bg-white text-amber-900"}`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4 rounded-3xl bg-white/80 p-5 shadow">
      <h3 className="text-2xl font-extrabold text-amber-800">{title}</h3>
      {children}
    </section>
  );
}

const THEMES: { v: Theme; icon: string; label: string }[] = [
  { v: "mix", icon: "🎲", label: "Trộn tất cả" },
  { v: "animals", icon: "🐶", label: "Con vật" },
  { v: "fruits", icon: "🍎", label: "Hoa quả" },
  { v: "vehicles", icon: "🚗", label: "Xe cộ" },
];

/** Name and boy/girl. Saved as the parent types; an empty box keeps the old name. */
function KidSection() {
  const kid = useKid();
  const [name, setName] = useState(kid.name);
  return (
    <Section title="🧒 Bé">
      <KidFields
        name={name}
        gender={kid.gender}
        onName={(v) => {
          setName(v);
          if (v.trim()) kid.setKid(v, kid.gender);
        }}
        onGender={(g) => kid.setKid(kid.name, g)}
      />
      {!name.trim() && <p className="-mt-2 text-sm font-semibold text-red-700">Chưa có tên, Gấu sẽ gọi bé là “{kid.name || "Con"}”.</p>}
    </Section>
  );
}

type KindRow = { kind: string; total: number; recent: Attempt[]; mastered: boolean };

function useKindRows(): KindRow[] {
  const attempts = useProgress((s) => s.attempts);
  return useMemo(() => {
    const kinds = [...new Set(attempts.map((a) => a.kind))];
    return kinds.map((kind) => {
      const mine = attempts.filter((a) => a.kind === kind);
      return { kind, total: mine.length, recent: mine.slice(-5), mastered: isMastered(attempts, kind) };
    });
  }, [attempts]);
}

/** Parent area: sensory settings, hints, session length, theme, preview and the child's progress per question kind. */
export function ParentPanel({ onClose }: { onClose: () => void }) {
  const theme = useSettings((s) => s.theme);
  const set = useSettings((s) => s.set);
  const reset = useSettings((s) => s.reset);
  const { stars, review } = useProgress();
  const rows = useKindRows();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-amber-50" role="dialog" aria-label="Cài đặt cho phụ huynh">
      <div className="mx-auto flex max-w-3xl flex-col gap-5 p-5 pb-16">
        <div className="flex items-center gap-3">
          <h2 className="text-3xl font-extrabold text-amber-800">⚙️ Phụ huynh</h2>
          <button className="btn btn-green ml-auto !min-h-14 !text-xl" onClick={onClose}>
            ✔ Xong
          </button>
        </div>

        <KidSection />

        <Section title="🔊 Âm thanh và giọng đọc">
          <Seg k="sfxVolume" title="Âm thanh hiệu ứng (ting, pop…)" opts={[{ v: 0, label: "Tắt" }, { v: 0.3, label: "Nhỏ" }, { v: 0.6, label: "Vừa" }, { v: 1, label: "To" }]} />
          <Seg k="voiceVolume" title="Giọng Gấu: âm lượng" opts={[{ v: 0.4, label: "Nhỏ" }, { v: 0.7, label: "Vừa" }, { v: 1, label: "To" }]} />
          <Seg k="voiceRate" title="Giọng Gấu: tốc độ" opts={[{ v: 0.7, label: "Chậm" }, { v: 0.82, label: "Hơi chậm" }, { v: 0.92, label: "Bình thường" }]} />
          <div>
            <button className="btn btn-white !min-h-12 !text-lg" onClick={() => void speak(`Chào ${KID.name}. Gấu nói thế này có dễ nghe không?`)}>
              🔊 Nghe thử
            </button>
          </div>
        </Section>

        <Section title="👀 Hình ảnh và chuyển động">
          <Seg k="reduceMotion" title="Chuyển động" note="Giảm: không nảy, không xoay, không rung." opts={[{ v: false, label: "Bình thường" }, { v: true, label: "Giảm chuyển động" }]} />
          <Seg k="no3D" title="Hình 3D" note="2D: trường, lớp học và vườn táo là hình phẳng, đứng yên." opts={[{ v: false, label: "3D" }, { v: true, label: "2D (tĩnh)" }]} />
          <Seg k="softColors" title="Màu sắc" opts={[{ v: false, label: "Bình thường" }, { v: true, label: "Màu dịu" }]} />
          <Seg k="celebrate" title="Pháo giấy khi trả lời đúng" note="Mặc định tắt, vì có bé thấy quá nhiều." opts={[{ v: false, label: "Tắt" }, { v: true, label: "Bật" }]} />
        </Section>

        <Section title="💡 Gợi ý và thời gian">
          <Seg
            k="autoHintSec"
            title="Gấu tự gợi ý khi bé chưa chạm"
            note="Bé không cần làm sai mới được giúp. Gợi ý này không tính là lỗi."
            opts={[{ v: 0, label: "Tắt" }, { v: 5, label: "5 giây" }, { v: 7, label: "7 giây" }, { v: 10, label: "10 giây" }, { v: 15, label: "15 giây" }]}
          />
          <Seg
            k="sessionMin"
            title="Thời lượng mỗi lượt học"
            note="Không có đồng hồ đếm ngược trên màn hình. Hết giờ, bé làm xong câu đang làm rồi mới dừng. Tiến độ được lưu."
            opts={[{ v: 0, label: "Không giới hạn" }, { v: 5, label: "5 phút" }, { v: 10, label: "10 phút" }, { v: 15, label: "15 phút" }, { v: 20, label: "20 phút" }]}
          />
        </Section>

        <Section title="❤️ Bé thích đếm gì?">
          <p className="-mt-2 text-sm font-semibold text-amber-900/70">
            Cho bé tự chạm chọn. Áp dụng cho các câu đếm và so sánh môn Toán. Khi bé chưa thuộc một dạng câu, Gấu luôn dùng cùng một hình. Khi bé đã thuộc, hình sẽ đổi để bé
            hiểu bài với nhiều đồ vật khác nhau.
          </p>
          <div className="flex flex-wrap gap-3">
            {THEMES.map((t) => (
              <button
                key={t.v}
                onClick={() => {
                  set({ theme: t.v });
                  void speak(t.label);
                }}
                aria-pressed={theme === t.v}
                className={`flex min-w-32 flex-col items-center rounded-3xl p-3 shadow-md ${theme === t.v ? "bg-orange-400 text-white ring-4 ring-yellow-300" : "bg-white"}`}
              >
                <span className="text-6xl">{t.icon}</span>
                <span className="text-lg font-extrabold">{t.label}</span>
              </button>
            ))}
          </div>
        </Section>

        <Section title="📅 Xem trước bài ở trường">
          <p className="-mt-2 text-sm font-semibold text-amber-900/70">
            Mở bài của tuần sắp học ở trường cho bé xem trước một ngày. Khi gặp phiếu thật ở lớp, bé đã biết các dạng câu.
          </p>
          <Seg k="unlockAll" title="Mở khoá tất cả bài" opts={[{ v: false, label: "Mở lần lượt" }, { v: true, label: "Mở tất cả" }]} />
          <ul className="flex flex-col gap-1">
            {SUBJECTS.flatMap((sub) =>
              sub.weeks.map((w) => {
                const st = weekStatuses(w, stars, review);
                const doneN = st.filter((x) => x.done).length;
                return (
                  <li key={`${sub.id}-${w.id}`} className="flex flex-wrap items-center gap-2 rounded-xl bg-white px-3 py-1.5 text-base font-semibold">
                    <span>{sub.icon}</span>
                    <span className="font-extrabold">{w.title}</span>
                    <span className="text-amber-900/70">{w.dates}</span>
                    <span className="truncate">{w.topic}</span>
                    <span className="ml-auto">
                      {doneN}/{st.length} bài
                    </span>
                  </li>
                );
              }),
            )}
          </ul>
        </Section>

        <Section title="📈 Bé đã thuộc dạng câu nào?">
          <p className="-mt-2 text-sm font-semibold text-amber-900/70">
            “Đã thuộc” = {MASTERY_RUN} câu gần nhất bé làm đúng ngay, không cần gợi ý. Mỗi ô là một câu gần đây: 🟢 tự làm đúng · 🟡 đúng nhờ gợi ý (không có lỗi) · 🟠 sai rồi sửa.
          </p>
          {rows.length === 0 && <p className="font-semibold">Chưa có dữ liệu. Bé làm bài xong sẽ hiện ở đây.</p>}
          <ul className="flex flex-col gap-1.5">
            {rows.map((r) => (
              <li key={r.kind} className="flex flex-wrap items-center gap-2 rounded-xl bg-white px-3 py-2">
                <span className="min-w-48 font-extrabold">{kindLabel(r.kind)}</span>
                <span className="flex gap-1" aria-label="5 câu gần nhất">
                  {r.recent.map((a, i) => (
                    <span key={i}>{a.wrongs > 0 ? "🟠" : a.help > 0 ? "🟡" : "🟢"}</span>
                  ))}
                </span>
                <span className="text-sm text-amber-900/70">{r.total} câu</span>
                <span className={`ml-auto rounded-full px-3 py-0.5 text-sm font-extrabold ${r.mastered ? "bg-green-500 text-white" : "bg-amber-200"}`}>
                  {r.mastered ? "Đã thuộc" : "Đang học"}
                </span>
              </li>
            ))}
          </ul>
        </Section>

        <div>
          <button className="btn btn-white !min-h-12 !text-base" onClick={reset}>
            ↺ Đặt lại cài đặt mặc định
          </button>
        </div>
      </div>
    </div>
  );
}
