// A bear face drawn with plain shapes, for the app icons (next/og ImageResponse).
// Shapes only, no emoji font, so building the icons needs no network access.

export function BearIcon({ size }: { size: number }) {
  const s = (f: number) => Math.round(size * f);
  const dot = (x: number, y: number, d: number, bg: string) => (
    <div
      style={{
        position: "absolute",
        left: s(x - d / 2),
        top: s(y - d / 2),
        width: s(d),
        height: s(d),
        borderRadius: "50%",
        background: bg,
      }}
    />
  );
  return (
    <div
      style={{
        width: size,
        height: size,
        display: "flex",
        position: "relative",
        background: "linear-gradient(180deg, #bfe9ff 0%, #fff4d6 100%)",
      }}
    >
      {/* ears */}
      {dot(0.27, 0.3, 0.24, "#a0652e")}
      {dot(0.73, 0.3, 0.24, "#a0652e")}
      {dot(0.27, 0.3, 0.12, "#e8b98a")}
      {dot(0.73, 0.3, 0.12, "#e8b98a")}
      {/* head */}
      {dot(0.5, 0.56, 0.62, "#b8763a")}
      {/* muzzle */}
      {dot(0.5, 0.68, 0.28, "#f1d2ac")}
      {/* eyes */}
      {dot(0.38, 0.5, 0.08, "#3b2a1a")}
      {dot(0.62, 0.5, 0.08, "#3b2a1a")}
      {dot(0.395, 0.485, 0.025, "#ffffff")}
      {dot(0.635, 0.485, 0.025, "#ffffff")}
      {/* nose */}
      {dot(0.5, 0.63, 0.1, "#3b2a1a")}
      {/* cheeks */}
      {dot(0.3, 0.64, 0.08, "#f48fb1")}
      {dot(0.7, 0.64, 0.08, "#f48fb1")}
    </div>
  );
}
