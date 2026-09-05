/**
 * Lightweight, CSS-only animated background for the landing page hero.
 * Floating gradient orbs + a faint dot grid — evokes a futuristic AI
 * product without any JS animation library or heavy runtime cost.
 */
export default function HeroBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* faint dot grid */}
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #C7CCD3 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          maskImage:
            "radial-gradient(ellipse 60% 50% at 50% 30%, black 40%, transparent 90%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 60% 50% at 50% 30%, black 40%, transparent 90%)",
        }}
      />

      {/* floating gradient orbs — teal + indigo duotone */}
      <div className="absolute left-1/2 top-[-140px] h-[440px] w-[860px] -translate-x-1/2 animate-float rounded-full bg-signal-100/70 blur-3xl" />
      <div className="absolute -left-24 top-32 h-64 w-64 animate-float-slow rounded-full bg-accent-100/50 blur-3xl" />
      <div className="absolute -right-16 top-8 h-72 w-72 animate-float rounded-full bg-signal-200/50 blur-3xl [animation-delay:1.5s]" />
    </div>
  );
}
