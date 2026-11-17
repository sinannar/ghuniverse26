import { useId } from "react";
import { motion, useReducedMotion } from "motion/react";
import type { SectionId } from "@/deck/types";

// One decorative motif per section so each section intro has its own identity.
// Purely decorative: hidden from assistive tech.

function Orbits() {
  const rings = [
    { rx: 380, ry: 150, dur: 40, nodes: 3 },
    { rx: 290, ry: 112, dur: 28, nodes: 2 },
    { rx: 190, ry: 72, dur: 18, nodes: 2 },
  ];
  const reduced = useReducedMotion();
  const glowId = `core-glow-${useId().replace(/:/g, "")}`;
  return (
    <svg viewBox="-450 -380 900 760" className="h-full w-full">
      <defs>
        <radialGradient id={glowId}>
          <stop offset="0%" stopColor="#f5f3ff" />
          <stop offset="35%" stopColor="var(--accent-hex)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      <circle r="120" fill={`url(#${glowId})`} opacity="0.55" />
      <circle r="34" fill="#f5f3ff" opacity="0.95" />
      {rings.map((ring, i) => (
        <g key={i} transform={`rotate(${-18 + i * 14})`}>
          <ellipse rx={ring.rx} ry={ring.ry} fill="none" stroke="var(--accent-hex)" strokeOpacity={0.35} strokeWidth={2} />
          {Array.from({ length: ring.nodes }).map((_, n) => {
            const fill = n % 2 ? "var(--accent-2)" : "var(--accent-hex)";
            if (reduced) {
              // Static fallback: nodes rest at evenly spaced points on their ring.
              const angle = (n / ring.nodes) * Math.PI * 2 + i * 0.9;
              return <circle key={n} r={10 - i * 2} fill={fill} cx={ring.rx * Math.cos(angle)} cy={ring.ry * Math.sin(angle)} />;
            }
            return (
              <circle key={n} r={10 - i * 2} fill={fill}>
                <animateMotion
                  dur={`${ring.dur}s`}
                  repeatCount="indefinite"
                  begin={`${-(ring.dur / ring.nodes) * n}s`}
                  path={`M ${ring.rx} 0 A ${ring.rx} ${ring.ry} 0 1 1 ${-ring.rx} 0 A ${ring.rx} ${ring.ry} 0 1 1 ${ring.rx} 0`}
                />
              </circle>
            );
          })}
        </g>
      ))}
    </svg>
  );
}

function Circuit() {
  const paths = [
    "M -400 -220 H -160 V -60 H 120 V -240 H 400",
    "M -400 40 H -240 V 200 H 60 V 60 H 400",
    "M -400 260 H -60 V 120 H 220 V 300 H 400",
    "M -300 -340 V -120 H -20 V 340",
    "M 260 -340 V -60 H 160 V 340",
  ];
  const nodes = [
    [-160, -60],
    [120, -240],
    [-240, 200],
    [60, 60],
    [-60, 120],
    [220, 300],
    [-20, -120],
    [160, -60],
  ];
  return (
    <svg viewBox="-450 -380 900 760" className="h-full w-full">
      {paths.map((d, i) => (
        <g key={i}>
          <path d={d} fill="none" stroke="var(--accent-hex)" strokeOpacity={0.18} strokeWidth={6} />
          <path d={d} fill="none" stroke="var(--accent-hex)" strokeWidth={3} strokeOpacity={0.85} className="kn-dash-flow" />
        </g>
      ))}
      {nodes.map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y})`}>
          <rect x={-22} y={-22} width={44} height={44} rx={10} fill="#0b1a1f" stroke="var(--accent-2)" strokeWidth={2.5} />
          <circle r={7} fill={i % 3 === 0 ? "var(--accent-2)" : "var(--accent-hex)"} />
        </g>
      ))}
    </svg>
  );
}

function Branches() {
  return (
    <svg viewBox="-450 -380 900 760" className="h-full w-full">
      <path d="M -60 -360 V 360" stroke="var(--accent-hex)" strokeWidth={8} strokeLinecap="round" opacity={0.9} />
      <path d="M -60 -240 C 80 -220, 120 -160, 120 -80 V 40 C 120 120, 40 140, -60 160" fill="none" stroke="var(--accent-2)" strokeWidth={6} opacity={0.9} />
      <path d="M 120 -80 C 230 -60, 260 0, 260 60 V 100 C 260 160, 200 180, 120 190" fill="none" stroke="#a7f3d0" strokeWidth={5} opacity={0.75} />
      <path d="M -60 40 C -200 60, -240 120, -240 200 C -240 260, -160 290, -60 300" fill="none" stroke="var(--accent-hex)" strokeWidth={5} opacity={0.55} className="kn-dash-flow" />
      {[-300, -240, -120, 40, 160, 300].map((y) => (
        <circle key={y} cx={-60} cy={y} r={14} fill="#06110d" stroke="var(--accent-hex)" strokeWidth={5} />
      ))}
      {[-150, -20].map((y) => (
        <circle key={y} cx={120} cy={y} r={12} fill="#06110d" stroke="var(--accent-2)" strokeWidth={5} />
      ))}
      <circle cx={260} cy={60} r={11} fill="#06110d" stroke="#a7f3d0" strokeWidth={4} />
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${200 + i * 18} ${-300 + i * 22})`}>
          <rect width={190} height={64} rx={14} fill="#0c1512" stroke="var(--accent-hex)" strokeOpacity={0.5 + i * 0.2} strokeWidth={2} />
          <rect x={18} y={20} width={90} height={9} rx={4} fill="var(--accent-hex)" opacity={0.7} />
          <rect x={18} y={36} width={130} height={8} rx={4} fill="#ffffff" opacity={0.25} />
        </g>
      ))}
    </svg>
  );
}

function Shield() {
  return (
    <svg viewBox="-450 -380 900 760" className="h-full w-full">
      <defs>
        <clipPath id="shield-clip">
          <path d="M 0 -300 L 230 -210 V 20 C 230 170, 120 260, 0 320 C -120 260, -230 170, -230 20 V -210 Z" />
        </clipPath>
        <linearGradient id="sweep" x1="0" x2="1">
          <stop offset="0%" stopColor="var(--accent-hex)" stopOpacity="0" />
          <stop offset="100%" stopColor="var(--accent-hex)" stopOpacity="0.55" />
        </linearGradient>
      </defs>
      {[300, 230, 160, 90].map((r) => (
        <circle key={r} r={r} fill="none" stroke="var(--accent-hex)" strokeOpacity={0.14} strokeWidth={2} />
      ))}
      <path
        d="M 0 -300 L 230 -210 V 20 C 230 170, 120 260, 0 320 C -120 260, -230 170, -230 20 V -210 Z"
        fill="#140c07"
        stroke="var(--accent-hex)"
        strokeWidth={5}
      />
      <g clipPath="url(#shield-clip)">
        <g className="kn-spin-slow" style={{ transformOrigin: "0px 0px", animationDuration: "6s" }}>
          <path d="M 0 0 L 420 -60 A 420 420 0 0 1 420 60 Z" fill="url(#sweep)" />
        </g>
        {[
          [-80, -120],
          [90, -40],
          [-40, 140],
          [120, 120],
          [-140, 40],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={9} fill={i === 1 ? "#f87171" : "var(--accent-2)"} className="kn-float" />
        ))}
      </g>
      <path d="M -70 10 L -15 65 L 90 -55" fill="none" stroke="#fff7ed" strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" opacity={0.9} />
    </svg>
  );
}

function Globe() {
  return (
    <svg viewBox="-450 -380 900 760" className="h-full w-full">
      <circle r={290} fill="#06111a" stroke="var(--accent-hex)" strokeWidth={3} strokeOpacity={0.8} />
      {[0.25, 0.55, 0.85].map((k) => (
        <ellipse key={`m${k}`} rx={290 * k} ry={290} fill="none" stroke="var(--accent-hex)" strokeOpacity={0.3} strokeWidth={2} />
      ))}
      {[-200, -100, 0, 100, 200].map((y) => (
        <ellipse key={`p${y}`} cy={y} rx={Math.sqrt(290 * 290 - y * y)} ry={18} fill="none" stroke="var(--accent-hex)" strokeOpacity={0.25} strokeWidth={2} />
      ))}
      <g className="kn-spin-slow" style={{ transformOrigin: "0px 0px", animationDuration: "30s" }}>
        <ellipse rx={380} ry={120} fill="none" stroke="var(--accent-2)" strokeOpacity={0.6} strokeWidth={2.5} strokeDasharray="6 10" />
        <circle cx={380} cy={0} r={12} fill="var(--accent-2)" />
        <circle cx={-380} cy={0} r={9} fill="var(--accent-hex)" />
      </g>
      {[
        [-120, -140],
        [60, -60],
        [150, 90],
        [-60, 170],
        [-190, 40],
      ].map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={7} fill="#e0f2fe" />
          <circle cx={x} cy={y} r={7} fill="none" stroke="#7dd3fc" className="kn-pulse-ring" style={{ transformOrigin: `${x}px ${y}px` }} />
        </g>
      ))}
    </svg>
  );
}

export function SectionMotif({ section }: { section: SectionId }) {
  return (
    <motion.div
      aria-hidden="true"
      className="h-full w-full"
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {section === "copilot" ? <Orbits /> : null}
      {section === "automation" ? <Circuit /> : null}
      {section === "workflow" ? <Branches /> : null}
      {section === "security" ? <Shield /> : null}
      {section === "platform" ? <Globe /> : null}
    </motion.div>
  );
}
