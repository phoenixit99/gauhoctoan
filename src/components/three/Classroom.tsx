"use client";
import { useRef, type ReactNode } from "react";
import { Boy, Hero } from "./Boy";
import { Overlay, RectTracker, Stage } from "./Stage";

// Room: x ∈ [-7, 7], z ∈ [-7, 8]; blackboard on the front wall (z = -7).
const BOARD_TL: [number, number, number] = [-5.7, 5.9, -6.9];
const BOARD_BR: [number, number, number] = [5.7, 1.75, -6.9];

const COLS = [-4.2, 0, 4.2]; // 3 columns of desks
const ROWS = [-2.2, 0.4, 3.0, 5.6]; // 4 rows each
const SEAT_X = [-0.6, 0.6]; // two seats per desk, offset from the desk centre
const SHIRTS = ["#c62828", "#2e7d32", "#6a1b9a", "#ef6c00", "#00838f", "#ad1457"]; // classmates' polo colours

function Box({ p, s, c, shadow = false }: { p: [number, number, number]; s: [number, number, number]; c: string; shadow?: boolean }) {
  return (
    <mesh position={p} castShadow={shadow} receiveShadow={shadow}>
      <boxGeometry args={s} />
      <meshStandardMaterial color={c} roughness={0.8} />
    </mesh>
  );
}

/** A two-seat primary-school desk with a bench. */
function Desk({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, 0, z]}>
      <Box p={[0, 0.78, 0]} s={[2.4, 0.1, 0.9]} c="#e6b673" shadow />
      <Box p={[0, 0.5, -0.38]} s={[2.3, 0.5, 0.06]} c="#c98f4e" />
      {[-1.1, 1.1].map((dx) => (
        <Box key={dx} p={[dx, 0.38, 0]} s={[0.08, 0.76, 0.8]} c="#8d6e63" />
      ))}
      {/* bench */}
      <Box p={[0, 0.46, 0.8]} s={[2.3, 0.08, 0.45]} c="#c98f4e" />
      <Box p={[0, 0.85, 1.02]} s={[2.3, 0.45, 0.06]} c="#c98f4e" />
      {[-1.05, 1.05].map((dx) => (
        <Box key={dx} p={[dx, 0.23, 0.8]} s={[0.08, 0.46, 0.4]} c="#8d6e63" />
      ))}
    </group>
  );
}

function Room() {
  return (
    <group>
      {/* floor tiles */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0.5]} receiveShadow>
        <planeGeometry args={[14, 15]} />
        <meshStandardMaterial color="#f1e3c8" roughness={0.9} />
      </mesh>
      {/* ceiling + walls */}
      <mesh position={[0, 6.45, 0.5]}>
        <boxGeometry args={[14.4, 0.1, 15]} />
        <meshBasicMaterial color="#f6efdf" />
      </mesh>
      <Box p={[0, 3.2, -7.1]} s={[14, 6.4, 0.2]} c="#fff4cf" />
      <Box p={[-7.1, 3.2, 0.5]} s={[0.2, 6.4, 15]} c="#fdf0c4" />
      <Box p={[7.1, 3.2, 0.5]} s={[0.2, 6.4, 15]} c="#fdf0c4" />
      {/* windows on the left wall, door on the right wall */}
      {[-3.5, 0.5, 4.5].map((z) => (
        <group key={z}>
          <Box p={[-6.98, 3.4, z]} s={[0.05, 1.8, 2.4]} c="#a7dcff" />
          <Box p={[-6.95, 3.4, z]} s={[0.05, 1.8, 0.08]} c="#ffffff" />
        </group>
      ))}
      <Box p={[6.98, 1.4, 5.5]} s={[0.05, 2.8, 1.4]} c="#1e88e5" />
      {/* blackboard */}
      <Box p={[0, 3.82, -6.98]} s={[11.8, 4.55, 0.08]} c="#8d6e63" />
      <Box p={[0, 3.82, -6.93]} s={[11.4, 4.15, 0.04]} c="#2f5d4e" />
      <Box p={[0, 1.6, -6.82]} s={[11.4, 0.08, 0.25]} c="#8d6e63" />
      {/* teacher's desk on a small platform */}
      <Box p={[0, 0.12, -5.6]} s={[12, 0.24, 2.4]} c="#d7b48a" />
      <Box p={[4.2, 0.74, -5.2]} s={[2.4, 1.0, 1.0]} c="#a1683a" shadow />
      <mesh position={[3.6, 1.38, -5.2]}>
        <cylinderGeometry args={[0.12, 0.1, 0.28, 12]} />
        <meshStandardMaterial color="#42a5f5" />
      </mesh>
      {/* posters */}
      <Box p={[-6.97, 3.6, -5.8]} s={[0.04, 1.4, 1]} c="#ffcc80" />
      <Box p={[6.97, 3.8, -2]} s={[0.04, 1.2, 1.6]} c="#c5e1a5" />
      <Box p={[6.97, 3.8, 1.2]} s={[0.04, 1.2, 1.6]} c="#f8bbd0" />
    </group>
  );
}

/**
 * Grade 1 classroom: 3 columns × 4 rows of desks, a blackboard and the teacher's desk.
 * `board` is DOM content laid exactly over the blackboard (lesson cards).
 */
export function ClassroomScene({ board }: { board: ReactNode }) {
  const boardEl = useRef<HTMLDivElement>(null);
  return (
    <div className="relative h-full w-full">
      <Stage camera={[0, 4.6, 10.5]} target={[0, 3.3, -5]} minAspect={1.25}>
        <Room />
        {COLS.map((x) => ROWS.map((z) => <Desk key={`${x}${z}`} x={x} z={z} />))}
        {/* two pupils per desk, each facing the board; the main boy is the left seat of the middle column, third row */}
        {COLS.flatMap((x, ci) =>
          ROWS.flatMap((z, ri) =>
            SEAT_X.map((dx, si) => {
              const hero = ci === 1 && ri === 2 && si === 0;
              return (
                <group key={`${x}-${z}-${si}`} position={[x + dx, 0.48, z + 0.75]} rotation={[0, Math.PI, 0]}>
                  {hero ? <Hero sitting scale={0.95} /> : <Boy sitting scale={0.95} shirt={SHIRTS[(ci * 4 + ri * 2 + si) % SHIRTS.length]} />}
                </group>
              );
            }),
          ),
        )}
        <RectTracker topLeft={BOARD_TL} bottomRight={BOARD_BR} el={boardEl} />
      </Stage>
      <Overlay>
        <div ref={boardEl} className="pointer-events-auto absolute overflow-hidden" style={{ visibility: "hidden", containerType: "size" }}>
          {board}
        </div>
      </Overlay>
    </div>
  );
}
