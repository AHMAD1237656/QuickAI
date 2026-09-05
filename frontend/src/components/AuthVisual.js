/**
 * Decorative "neural constellation" graphic used on the auth screens.
 * Pure SVG/CSS — the signature visual element tying the auth experience
 * together, evoking connected AI tools working as one system.
 */
export default function AuthVisual() {
  const nodes = [
    { x: 60, y: 90 }, { x: 200, y: 40 }, { x: 340, y: 110 },
    { x: 120, y: 210 }, { x: 300, y: 250 }, { x: 40, y: 330 },
    { x: 230, y: 360 }, { x: 380, y: 300 }, { x: 170, y: 130 },
  ];
  const edges = [
    [0, 1], [1, 2], [0, 3], [1, 8], [3, 8], [8, 2],
    [3, 4], [4, 2], [3, 5], [3, 6], [4, 6], [4, 7], [6, 5],
  ];

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -left-10 -top-10 h-72 w-72 rounded-full bg-signal-500/20 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-accent-500/15 blur-3xl" />

      <svg
        viewBox="0 0 420 420"
        className="absolute right-[-40px] top-1/2 h-[480px] w-[480px] -translate-y-1/2 opacity-90"
      >
        {edges.map(([a, b], i) => (
          <line
            key={i}
            x1={nodes[a].x}
            y1={nodes[a].y}
            x2={nodes[b].x}
            y2={nodes[b].y}
            stroke={i % 2 === 0 ? "#3BD09E" : "#8A7AFB"}
            strokeOpacity="0.25"
            strokeWidth="1"
          />
        ))}
        {nodes.map((n, i) => (
          <circle
            key={i}
            cx={n.x}
            cy={n.y}
            r={i % 3 === 0 ? 4 : 2.5}
            fill={i % 3 === 0 ? "#8A7AFB" : "#3BD09E"}
            className={i % 4 === 0 ? "animate-pulse" : ""}
          />
        ))}
      </svg>
    </div>
  );
}
