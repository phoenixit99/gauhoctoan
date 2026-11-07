"use client";
import { useRef, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { DoubleSide, Euler, Matrix4, Vector3, type Group } from "three";
import { useKid } from "@/lib/kid";

const SKIN = "#f1c7a2";
const HAIR = "#1d1a18";
const SHIRT = "#1f2f5e"; // navy polo
const TRIM = "#ffffff"; // white collar trim + placket
const SHORTS = "#eee6d3"; // cream shorts

const BAG = "#ff8f3a";

// girl outfit
const GIRL_SHIRT = "#f06292"; // pink polo
const SKIRT = "#24345f"; // navy skirt
const BOW = "#ff4f8b";

type Tuft = { p: [number, number, number]; s: [number, number, number]; r: [number, number, number] };

/**
 * Short straight haircut: flat strands laid along the scalp (Fibonacci sphere), each pointing
 * "downhill" so the hair flows down and back; the fringe falls onto the forehead.
 * Hairline is high at the forehead, above the ears at the sides and low at the back.
 */
const HAIR_TUFTS: Tuft[] = (() => {
  const out: Tuft[] = [];
  const N = 260;
  const R = 0.415;
  const n = new Vector3();
  const t = new Vector3();
  const xAxis = new Vector3();
  const m = new Matrix4();
  const e = new Euler();
  for (let i = 0; i < N; i++) {
    const y = 1 - (i / (N - 1)) * 2;
    const rad = Math.sqrt(1 - y * y);
    const th = i * 2.399963;
    const x = Math.cos(th) * rad;
    const z = Math.sin(th) * rad;
    const front = Math.max(0, z);
    const minY = -0.35 + front * 0.86 + (1 - Math.abs(z)) * Math.abs(x) * 0.25;
    if (y < minY) continue;
    n.set(x, y, z).normalize();
    // strand direction: down the scalp; near the crown, sweep backwards (or forwards for the fringe)
    const isFringe = z > 0.5;
    t.set(0, -1, 0).addScaledVector(n, n.y);
    if (t.lengthSq() < 0.05) t.set(0, 0, isFringe ? 1 : -1).addScaledVector(n, -n.z);
    t.normalize();
    xAxis.crossVectors(t, n).normalize();
    m.makeBasis(xAxis, t, n);
    e.setFromRotationMatrix(m);
    const j = ((i * 7919) % 100) / 100;
    out.push({
      p: [n.x * R * 0.95, n.y * R * 1.02 + 0.02, n.z * R * 0.97 - 0.02],
      s: [0.7, 1.5 + j * 0.5, 0.3],
      r: [e.x, e.y, e.z],
    });
  }
  return out;
})();
const BAG_DARK = "#e0661b";

type Props = {
  /** true while walking: arms and legs swing. */
  walking?: RefObject<boolean>;
  /** true while sitting at a desk. */
  sitting?: boolean;
  /** waves one hand (at the gate). */
  waving?: boolean;
  scale?: number;
  /** polo colour; defaults to the navy shirt. */
  shirt?: string;
  /** wears the orange backpack (off inside the canteen). */
  bag?: boolean;
  /** holds both arms forward, e.g. carrying a tray. */
  carrying?: boolean;
  /** girl look: hair to the shoulders with two bunches and bows, skirt instead of shorts. */
  girl?: boolean;
};

/** The main character: a boy or a girl, as set on the setup screen. */
export function Hero(props: Omit<Props, "girl">) {
  const girl = useKid((s) => s.gender === "girl");
  return <Boy {...props} girl={girl} />;
}

/**
 * A cute Grade 1 schoolboy (chibi proportions) built from primitives.
 * Faces +z. Outfit: navy polo with white trim, cream shorts, orange backpack. Short black hair with a fringe.
 */
export function Boy({ walking, sitting = false, waving = false, scale = 1, shirt, bag = true, carrying = false, girl = false }: Props) {
  shirt ??= girl ? GIRL_SHIRT : SHIRT;
  const body = useRef<Group>(null);
  const armL = useRef<Group>(null);
  const armR = useRef<Group>(null);
  const legL = useRef<Group>(null);
  const legR = useRef<Group>(null);
  const head = useRef<Group>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const w = walking?.current ?? false;
    const swing = w ? Math.sin(t * 9) * 0.7 : 0;
    if (legL.current) legL.current.rotation.x = sitting ? -1.45 : swing;
    if (legR.current) legR.current.rotation.x = sitting ? -1.45 : -swing;
    if (armL.current) armL.current.rotation.x = sitting ? -0.9 : -swing * 0.8;
    if (armR.current) {
      if (waving && !w) {
        armR.current.rotation.x = 0;
        armR.current.rotation.z = 2.6 + Math.sin(t * 8) * 0.35;
      } else {
        armR.current.rotation.z = 0;
        armR.current.rotation.x = sitting ? -0.9 : swing * 0.8;
      }
    }
    if (carrying && !sitting) {
      if (armL.current) {
        armL.current.rotation.x = -1.1;
        armL.current.rotation.z = 0;
      }
      if (armR.current) {
        armR.current.rotation.x = -1.1;
        armR.current.rotation.z = 0;
      }
    }
    if (body.current) body.current.position.y = w ? Math.abs(Math.sin(t * 9)) * 0.06 : Math.sin(t * 2) * 0.015;
    if (head.current) head.current.rotation.z = w ? 0 : Math.sin(t * 1.5) * 0.05;
  });

  return (
    <group scale={scale}>
      <group ref={body} position={[0, sitting ? -0.42 : 0, 0]}>
        {/* legs (pivot at hip) */}
        {([
          [-0.15, legL],
          [0.15, legR],
        ] as const).map(([x, ref]) => (
          <group key={x} ref={ref} position={[x, 0.62, 0]}>
            <mesh position={[0, -0.12, 0]} castShadow>
              <cylinderGeometry args={[0.13, 0.12, 0.2, 16]} />
              <meshStandardMaterial color={girl ? SKIN : SHORTS} />
            </mesh>
            <mesh position={[0, -0.33, 0]}>
              <cylinderGeometry args={[0.075, 0.07, 0.3, 12]} />
              <meshStandardMaterial color={SKIN} />
            </mesh>
            <mesh position={[0, -0.47, 0.02]}>
              <cylinderGeometry args={[0.085, 0.085, 0.06, 12]} />
              <meshStandardMaterial color="#f5f5f5" />
            </mesh>
            <mesh position={[0, -0.55, 0.06]} scale={[1, 0.6, 1.5]} castShadow>
              <sphereGeometry args={[0.11, 16, 12]} />
              <meshStandardMaterial color="#2b2b2b" />
            </mesh>
          </group>
        ))}

        {/* shorts (boy) or a flared skirt (girl) + shirt */}
        {girl ? (
          <mesh position={[0, 0.6, 0]} castShadow>
            <cylinderGeometry args={[0.27, 0.4, 0.3, 24]} />
            <meshStandardMaterial color={SKIRT} />
          </mesh>
        ) : (
          <mesh position={[0, 0.66, 0]} castShadow>
            <cylinderGeometry args={[0.27, 0.29, 0.18, 20]} />
            <meshStandardMaterial color={SHORTS} />
          </mesh>
        )}
        <mesh position={[0, 0.93, 0]} castShadow>
          <capsuleGeometry args={[0.26, 0.28, 8, 20]} />
          <meshStandardMaterial color={shirt} roughness={0.7} />
        </mesh>
        {/* polo collar (navy with white trim) + white placket */}
        {[-1, 1].map((d) => (
          <group key={d} position={[d * 0.1, 1.2, 0.17]} rotation={[0.55, 0, d * 0.5]}>
            <mesh>
              <boxGeometry args={[0.16, 0.05, 0.12]} />
              <meshStandardMaterial color={shirt} />
            </mesh>
            <mesh position={[0, 0.005, 0.062]}>
              <boxGeometry args={[0.16, 0.055, 0.012]} />
              <meshStandardMaterial color={TRIM} />
            </mesh>
          </group>
        ))}
        <mesh position={[0, 1.04, 0.258]}>
          <boxGeometry args={[0.07, 0.22, 0.012]} />
          <meshStandardMaterial color={TRIM} />
        </mesh>
        {[1.1, 1.0].map((y) => (
          <mesh key={y} position={[0, y, 0.266]}>
            <sphereGeometry args={[0.018, 8, 8]} />
            <meshStandardMaterial color="#d9dee8" />
          </mesh>
        ))}

        {/* arms (pivot at shoulder) */}
        {([
          [-0.33, armL],
          [0.33, armR],
        ] as const).map(([x, ref]) => (
          <group key={x} ref={ref} position={[x, 1.12, 0]}>
            <mesh position={[0, -0.07, 0]}>
              <sphereGeometry args={[0.11, 14, 12]} />
              <meshStandardMaterial color={shirt} />
            </mesh>
            <mesh position={[0, -0.15, 0]}>
              <cylinderGeometry args={[0.1, 0.1, 0.035, 14]} />
              <meshStandardMaterial color={shirt} />
            </mesh>
            <mesh position={[0, -0.24, 0]}>
              <capsuleGeometry args={[0.065, 0.2, 6, 12]} />
              <meshStandardMaterial color={SKIN} />
            </mesh>
            <mesh position={[0, -0.4, 0]}>
              <sphereGeometry args={[0.075, 12, 12]} />
              <meshStandardMaterial color={SKIN} />
            </mesh>
          </group>
        ))}

        {/* backpack */}
        {bag && (
        <group position={[0, 0.98, -0.3]}>
            <mesh castShadow>
              <boxGeometry args={[0.46, 0.5, 0.2]} />
              <meshStandardMaterial color={BAG} roughness={0.6} />
            </mesh>
            <mesh position={[0, -0.1, -0.11]}>
              <boxGeometry args={[0.34, 0.2, 0.06]} />
              <meshStandardMaterial color={BAG_DARK} />
            </mesh>
            <mesh position={[0, 0.27, 0]} rotation={[0, 0, Math.PI / 2]}>
              <torusGeometry args={[0.08, 0.025, 8, 16, Math.PI]} />
              <meshStandardMaterial color={BAG_DARK} />
            </mesh>
            {[-0.16, 0.16].map((x) => (
              <mesh key={x} position={[x, 0.02, 0.2]}>
                <boxGeometry args={[0.05, 0.42, 0.04]} />
                <meshStandardMaterial color={BAG_DARK} />
              </mesh>
            ))}
          </group>
        )}

        {/* head: oval face, short black hair with a fringe, almond eyes (no cap) */}
        <group ref={head} position={[0, 1.6, 0]}>
          <mesh castShadow scale={[0.93, 1.04, 0.95]}>
            <sphereGeometry args={[0.42, 40, 32]} />
            <meshStandardMaterial color={SKIN} roughness={0.75} />
          </mesh>
          {/* jaw / chin softening */}
          <mesh position={[0, -0.2, 0.1]} scale={[0.8, 0.6, 0.75]}>
            <sphereGeometry args={[0.3, 24, 20]} />
            <meshStandardMaterial color={SKIN} roughness={0.75} />
          </mesh>

          {/* hair: many small tufts (not a smooth helmet) over a thin dark base */}
          <mesh position={[0, 0.02, -0.02]} scale={[0.95, 1.0, 0.97]}>
            <sphereGeometry args={[0.41, 32, 20, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
            <meshStandardMaterial color={HAIR} roughness={1} />
          </mesh>
          {HAIR_TUFTS.map((t, i) => (
            <mesh key={i} position={t.p} scale={t.s} rotation={t.r}>
              <sphereGeometry args={[0.075, 8, 6]} />
              <meshStandardMaterial color={i % 4 ? HAIR : "#2a2420"} roughness={0.9} />
            </mesh>
          ))}

          {girl && (
            <>
              {/* longer hair at the back, down to the neck */}
              <mesh position={[0, 0, -0.02]} scale={[1, 1.06, 1]}>
                <sphereGeometry args={[0.44, 32, 24, Math.PI, Math.PI, 0, Math.PI * 0.74]} />
                <meshStandardMaterial color={HAIR} roughness={1} side={DoubleSide} />
              </mesh>
              {/* two bunches with bows */}
              {[-1, 1].map((d) => (
                <group key={d} position={[d * 0.4, 0.08, -0.12]}>
                  <mesh position={[0, 0, 0]}>
                    <sphereGeometry args={[0.07, 14, 12]} />
                    <meshStandardMaterial color={BOW} />
                  </mesh>
                  {[-1, 1].map((w) => (
                    <mesh key={w} position={[d * 0.02, w * 0.06, 0.03]} rotation={[0, 0, w * 0.6]} scale={[0.6, 1, 0.5]}>
                      <sphereGeometry args={[0.07, 12, 10]} />
                      <meshStandardMaterial color={BOW} />
                    </mesh>
                  ))}
                  <mesh position={[d * 0.1, -0.13, -0.02]} rotation={[0, 0, d * 0.35]} scale={[0.75, 1.5, 0.75]}>
                    <sphereGeometry args={[0.1, 16, 14]} />
                    <meshStandardMaterial color={HAIR} roughness={1} />
                  </mesh>
                </group>
              ))}
            </>
          )}

          {/* ears (stick out a little) */}
          {[-1, 1].map((d) => (
            <group key={d} position={[d * 0.4, -0.04, 0.02]} rotation={[0, d * 0.5, 0]}>
              <mesh scale={[0.45, 1, 0.75]}>
                <sphereGeometry args={[0.1, 14, 14]} />
                <meshStandardMaterial color={SKIN} />
              </mesh>
              <mesh position={[0, 0, 0.03]} scale={[0.25, 0.65, 0.4]}>
                <sphereGeometry args={[0.1, 10, 10]} />
                <meshStandardMaterial color="#e2a985" />
              </mesh>
            </group>
          ))}

          {/* eyebrows */}
          {[-1, 1].map((d) => (
            <mesh key={d} position={[d * 0.14, 0.12, 0.372]} rotation={[0, d * 0.3, d * -0.06]}>
              <boxGeometry args={[0.12, 0.022, 0.02]} />
              <meshStandardMaterial color={HAIR} />
            </mesh>
          ))}
          {/* almond eyes: white, dark iris, sparkle, upper lid */}
          {[-1, 1].map((d) => (
            <group key={d} position={[d * 0.14, 0.01, 0.37]} rotation={[0, d * 0.32, 0]}>
              <mesh scale={[1.3, 0.9, 0.35]}>
                <sphereGeometry args={[0.062, 20, 16]} />
                <meshStandardMaterial color="#ffffff" roughness={0.3} />
              </mesh>
              <mesh position={[0, -0.004, 0.016]} scale={[1, 1.05, 0.45]}>
                <sphereGeometry args={[0.05, 18, 16]} />
                <meshStandardMaterial color="#2a1a12" roughness={0.15} />
              </mesh>
              <mesh position={[0.014, 0.016, 0.042]}>
                <sphereGeometry args={[0.012, 8, 8]} />
                <meshBasicMaterial color="white" />
              </mesh>
              <mesh position={[0, 0.046, 0.012]} scale={[1.45, 0.3, 0.4]}>
                <sphereGeometry args={[0.062, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2]} />
                <meshStandardMaterial color="#3a2418" />
              </mesh>
            </group>
          ))}
          {/* nose */}
          <mesh position={[0, -0.09, 0.4]} scale={[1, 0.8, 0.8]}>
            <sphereGeometry args={[0.04, 14, 12]} />
            <meshStandardMaterial color="#eab894" roughness={0.7} />
          </mesh>
          {/* soft cheeks */}
          {[-0.22, 0.22].map((x) => (
            <mesh key={x} position={[x, -0.13, 0.31]} scale={[1, 0.6, 0.35]}>
              <sphereGeometry args={[0.07, 12, 12]} />
              <meshStandardMaterial color="#f7a8a0" transparent opacity={0.55} />
            </mesh>
          ))}
          {/* small closed mouth, gentle smile */}
          <mesh position={[0, -0.19, 0.362]} rotation={[0.2, 0, Math.PI * 1.1]}>
            <torusGeometry args={[0.04, 0.01, 8, 16, Math.PI * 0.8]} />
            <meshStandardMaterial color="#b0533f" />
          </mesh>
        </group>
      </group>
    </group>
  );
}
