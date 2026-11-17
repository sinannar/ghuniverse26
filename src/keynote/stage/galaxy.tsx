import { useEffect, useRef } from "react";
import * as THREE from "three";

// Procedural spiral galaxy for the opening, the recap and the Highlights moments. Seeded so it
// renders identically every time; paused when hidden or under reduced motion.

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const PALETTE = ["#a78bfa", "#22d3ee", "#34d399", "#fb923c", "#38bdf8", "#f0abfc"];

export default function Galaxy({ intensity = 1 }: { intensity?: number }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true, powerPreference: "high-performance" });
    } catch {
      return; // No WebGL: the CSS glows behind still carry the moment.
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, 16 / 9, 0.1, 100);
    // Low "horizon" framing: the galaxy core sits near the bottom of the frame,
    // leaving the upper two thirds calm for the headline.
    camera.position.set(0, 3.2, 9.0);
    camera.lookAt(0, 3.5, 0);

    const rand = mulberry32(2026);
    const count = 11000;
    const radius = 7;
    const branches = 5;
    const spin = 1.15;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const core = new THREE.Color("#ede9fe");
    const tmp = new THREE.Color();
    for (let i = 0; i < count; i++) {
      const r = Math.pow(rand(), 1.35) * radius;
      const branch = i % branches;
      const angle = (branch / branches) * Math.PI * 2 + r * spin;
      const spread = 0.42 * r;
      const rx = Math.pow(rand(), 2.6) * (rand() < 0.5 ? 1 : -1) * spread;
      const ry = Math.pow(rand(), 2.6) * (rand() < 0.5 ? 1 : -1) * spread * 0.35;
      const rz = Math.pow(rand(), 2.6) * (rand() < 0.5 ? 1 : -1) * spread;
      positions[i * 3] = Math.cos(angle) * r + rx;
      positions[i * 3 + 1] = ry;
      positions[i * 3 + 2] = Math.sin(angle) * r + rz;
      tmp.set(PALETTE[branch]);
      const mixed = core.clone().lerp(tmp, Math.min(1, r / (radius * 0.55)));
      colors[i * 3] = mixed.r;
      colors[i * 3 + 1] = mixed.g;
      colors[i * 3 + 2] = mixed.b;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const material = new THREE.PointsMaterial({
      size: 0.038,
      sizeAttenuation: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
      transparent: true,
      opacity: 0.78 * intensity,
    });
    const points = new THREE.Points(geometry, material);
    points.rotation.x = 0.18;
    scene.add(points);

    const resize = () => {
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(64, now - last);
      last = now;
      points.rotation.y += dt * 0.00006;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    const start = () => {
      if (reduced) {
        renderer.render(scene, camera);
        return;
      }
      cancelAnimationFrame(raf);
      last = performance.now();
      raf = requestAnimationFrame(tick);
    };
    const onVisibility = () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else start();
    };
    start();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVisibility);
      ro.disconnect();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [intensity]);

  return (
    <div ref={wrapRef} className="absolute inset-0" aria-hidden="true">
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
