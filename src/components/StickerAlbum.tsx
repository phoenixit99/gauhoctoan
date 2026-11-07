"use client";
import { useState } from "react";
import { useProgress } from "@/lib/store";
import { stickerName } from "@/content/stickers";
import { speak } from "@/lib/speech";
import { sfx } from "@/lib/sfx";

/** The child's sticker collection: a button in the classroom, always in the same place. */
export function StickerAlbum() {
  const stickers = useProgress((s) => s.stickers);
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        className="btn btn-white !min-h-14 !text-xl"
        onClick={() => {
          sfx.tap();
          setOpen(true);
          void speak(stickers.length ? `Con có ${stickers.length} sticker.` : "Con chưa có sticker. Học xong một bài, con được chọn sticker.");
        }}
      >
        🎁 {stickers.length}
      </button>
      {open && (
        <div className="fixed inset-0 z-30 flex flex-col items-center gap-4 overflow-y-auto bg-amber-50/95 p-6">
          <h2 className="text-4xl font-extrabold text-amber-800">🎁 Bộ sưu tập sticker</h2>
          {stickers.length === 0 && <p className="text-2xl font-bold">Học xong một bài, con được chọn một sticker.</p>}
          <div className="flex max-w-4xl flex-wrap justify-center gap-3">
            {stickers.map((s, i) => (
              <button
                key={i}
                onClick={() => void speak(`Sticker ${stickerName(s)}.`)}
                className="grid h-24 w-24 place-items-center rounded-3xl bg-white text-6xl shadow-md"
              >
                {s}
              </button>
            ))}
          </div>
          <button className="btn btn-green" onClick={() => setOpen(false)}>
            ✔ Đóng
          </button>
        </div>
      )}
    </>
  );
}
