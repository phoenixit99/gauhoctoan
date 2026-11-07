"use client";
import { useState } from "react";
import { NAME_MAX, useKid, type Gender } from "@/lib/kid";

/** Name box + boy/girl choice. Used on the first-launch screen and in the parent panel. */
export function KidFields({
  name,
  gender,
  onName,
  onGender,
}: {
  name: string;
  gender: Gender;
  onName: (v: string) => void;
  onGender: (g: Gender) => void;
}) {
  const choice = (g: Gender, emoji: string, label: string) => (
    <button
      type="button"
      onClick={() => onGender(g)}
      aria-pressed={gender === g}
      className={`flex w-36 flex-col items-center gap-1 rounded-3xl border-4 bg-white px-4 py-3 text-2xl font-extrabold shadow-md transition-transform ${
        gender === g ? "scale-105 border-orange-400" : "border-transparent opacity-70"
      }`}
    >
      <span className="text-6xl leading-none">{emoji}</span>
      {label}
    </button>
  );

  return (
    <>
      <label className="flex w-full flex-col gap-2 text-2xl font-extrabold">
        Bé tên gì?
        <input
          value={name}
          onChange={(e) => onName(e.target.value)}
          maxLength={NAME_MAX}
          placeholder="Ví dụ: Ben"
          autoComplete="off"
          autoCapitalize="words"
          enterKeyHint="done"
          className="w-full rounded-2xl border-4 border-amber-200 bg-white px-4 py-3 text-3xl font-bold outline-none focus:border-orange-400"
          style={{ userSelect: "text", WebkitUserSelect: "text" }}
        />
      </label>
      <div className="flex w-full flex-col gap-2">
        <div className="text-2xl font-extrabold">Bạn nhỏ trong truyện là</div>
        <div className="flex gap-4">
          {choice("boy", "👦", "Bé trai")}
          {choice("girl", "👧", "Bé gái")}
        </div>
      </div>
    </>
  );
}

/** First launch on this device: a parent types the child's name and picks boy/girl. */
export function KidSetup({ onDone }: { onDone: () => void }) {
  const setKid = useKid((s) => s.setKid);
  const [name, setName] = useState(useKid.getState().name);
  const [gender, setGender] = useState<Gender>(useKid.getState().gender);
  const ok = name.trim().length > 0;

  return (
    <div className="sky flex h-dvh flex-col items-center justify-center gap-6 overflow-y-auto p-4">
      <div className="text-center">
        <div className="text-5xl font-extrabold text-amber-800">🐻 Gấu Đi Học</div>
        <div className="mt-1 text-lg font-bold text-amber-800/80">Phụ huynh điền giúp bé nhé. Sau này đổi được trong ⚙️ Phụ huynh.</div>
      </div>
      <form
        className="flex w-full max-w-md flex-col items-center gap-5 rounded-[2rem] bg-white/85 p-6 shadow-xl"
        onSubmit={(e) => {
          e.preventDefault();
          if (!ok) return;
          setKid(name, gender);
          onDone();
        }}
      >
        <KidFields name={name} gender={gender} onName={setName} onGender={setGender} />
        <button type="submit" className="btn btn-green" disabled={!ok}>
          Xong ✓
        </button>
      </form>
    </div>
  );
}
