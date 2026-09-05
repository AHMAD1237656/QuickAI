/**
 * Global ambient background used across the entire site.
 *
 * Pure CSS/SVG, fixed behind all content (-z-10), so it reads as a soft,
 * layered "3D-ish" depth effect without the cost or complexity of a
 * Three.js/WebGL scene. Layered blurred blobs in a teal + indigo duotone,
 * at different sizes, opacities and animation speeds, create a sense of
 * depth; a faint dot-grid adds texture. Kept subtle and low-opacity so it
 * never competes with foreground content (cards, text, forms).
 */
export default function AnimatedBackground() {
  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-paper-50"
      aria-hidden="true"
    >
      {/* faint dot grid for texture/depth */}
      <div
        className="absolute inset-0 opacity-[0.25]"
        style={{
          backgroundImage: "radial-gradient(circle, #C7CCD3 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* layered floating gradient orbs — teal + indigo duotone for depth */}
      <div className="absolute left-[8%] top-[-10%] h-[420px] w-[420px] animate-float rounded-full bg-signal-100/60 blur-3xl" />
      <div className="absolute right-[5%] top-[15%] h-[320px] w-[320px] animate-float-slow rounded-full bg-accent-100/50 blur-3xl [animation-delay:2s]" />
      <div className="absolute bottom-[-12%] left-[20%] h-[380px] w-[380px] animate-float rounded-full bg-accent-200/40 blur-3xl [animation-delay:4s]" />
      <div className="absolute bottom-[10%] right-[15%] h-[260px] w-[260px] animate-float-slow rounded-full bg-signal-200/40 blur-3xl [animation-delay:1s]" />
    </div>
  );
}
