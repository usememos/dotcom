export function HeroAmbient() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(9,9,11,0.06)_1px,transparent_1px)] [background-size:18px_18px] [mask-image:radial-gradient(ellipse_at_top,black,transparent_75%)] [-webkit-mask-image:radial-gradient(ellipse_at_top,black,transparent_75%)] dark:bg-[radial-gradient(circle,rgba(255,255,255,0.05)_1px,transparent_1px)]" />
      <div className="absolute -top-24 left-1/2 h-72 w-[40rem] max-w-[90vw] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(13,148,136,0.16),rgba(99,102,241,0.08)_45%,transparent_72%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(45,212,191,0.14),rgba(99,102,241,0.07)_45%,transparent_72%)]" />
    </div>
  );
}
