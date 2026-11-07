"use client";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useLayoutEffect, type ReactNode, type RefObject } from "react";
import { Vector3, type Camera } from "three";

/**
 * Moves plain DOM labels (rendered outside the Canvas) to follow 3D points.
 * Used instead of drei <Html>, which can leave its first label empty with React 19.
 * `getWorld(i, out)` writes the world position of label i into `out` (return false to hide it).
 */
const tmp = new Vector3();

/** Projects label i to screen space and moves its DOM element (runs every frame, outside React). */
function placeLabels(
  count: number,
  getWorld: (i: number, out: Vector3) => boolean,
  els: (HTMLElement | null)[] | null,
  camera: Camera,
  width: number,
  height: number,
) {
  if (!els) return;
  for (let i = 0; i < count; i++) {
    const el = els[i];
    if (!el) continue;
    if (!getWorld(i, tmp)) {
      el.style.visibility = "hidden";
      continue;
    }
    tmp.project(camera);
    if (tmp.z > 1) {
      el.style.visibility = "hidden"; // behind the camera
      continue;
    }
    el.style.transform = `translate(${((tmp.x + 1) / 2) * width}px, ${((1 - tmp.y) / 2) * height}px) translate(-50%, -50%)`;
    el.style.visibility = "visible";
  }
}

export function Projector({
  count,
  getWorld,
  els,
}: {
  count: number;
  getWorld: (i: number, out: Vector3) => boolean;
  els: RefObject<(HTMLElement | null)[]>;
}) {
  const { camera, size } = useThree();
  useFrame(() => placeLabels(count, getWorld, els.current, camera, size.width, size.height));
  return null;
}

const tl = new Vector3();
const br = new Vector3();

/** Keeps a DOM element exactly over a 3D rectangle (e.g. lesson cards on the blackboard). */
export function RectTracker({
  topLeft,
  bottomRight,
  el,
}: {
  topLeft: [number, number, number];
  bottomRight: [number, number, number];
  el: RefObject<HTMLElement | null>;
}) {
  const { camera, size } = useThree();
  useFrame(() => fitRect(el.current, topLeft, bottomRight, camera, size.width, size.height));
  return null;
}

function fitRect(
  node: HTMLElement | null,
  a: [number, number, number],
  b: [number, number, number],
  camera: Camera,
  width: number,
  height: number,
) {
  if (!node) return;
  tl.set(...a).project(camera);
  br.set(...b).project(camera);
  const x1 = ((tl.x + 1) / 2) * width;
  const y1 = ((1 - tl.y) / 2) * height;
  const x2 = ((br.x + 1) / 2) * width;
  const y2 = ((1 - br.y) / 2) * height;
  node.style.left = `${x1}px`;
  node.style.top = `${y1}px`;
  node.style.width = `${x2 - x1}px`;
  node.style.height = `${y2 - y1}px`;
  node.style.visibility = "visible";
}

/** Full-size layer above the canvas for labels positioned by <Projector>. */
export function Overlay({ children }: { children: ReactNode }) {
  return <div className="pointer-events-none absolute inset-0 overflow-hidden">{children}</div>;
}

/** Keeps a fixed camera framing that also works on portrait screens. */
function CameraRig({
  position,
  target,
  minAspect,
}: {
  position: [number, number, number];
  target: [number, number, number];
  minAspect: number;
}) {
  const { camera, size } = useThree();
  useLayoutEffect(() => {
    const aspect = size.width / Math.max(1, size.height);
    const k = aspect < minAspect ? minAspect / aspect : 1;
    camera.position.set(
      target[0] + (position[0] - target[0]) * k,
      target[1] + (position[1] - target[1]) * k,
      target[2] + (position[2] - target[2]) * k,
    );
    camera.lookAt(...target);
    camera.updateProjectionMatrix();
  }, [camera, size, position, target, minAspect]);
  return null;
}

export function Stage({
  children,
  camera,
  target,
  minAspect = 1.3,
}: {
  children: ReactNode;
  camera: [number, number, number];
  target: [number, number, number];
  minAspect?: number;
}) {
  return (
    <Canvas shadows="percentage" dpr={[1, 2]} camera={{ fov: 45, position: camera }} gl={{ antialias: true, alpha: true }}>
      <CameraRig position={camera} target={target} minAspect={minAspect} />
      <hemisphereLight args={["#ffffff", "#9ccf7a", 1.1]} />
      <ambientLight intensity={0.35} />
      <directionalLight
        position={[5, 10, 6]}
        intensity={1.6}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-12}
        shadow-camera-right={12}
        shadow-camera-top={12}
        shadow-camera-bottom={-12}
      />
      {children}
    </Canvas>
  );
}
