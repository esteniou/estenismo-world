import { useEffect, useRef } from "react";

// Simple virtual joystick that writes x/y into an input ref.
export default function MobileJoystick({ input }) {
  const baseRef = useRef();
  const knobRef = useRef();
  const active = useRef(false);
  const center = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const base = baseRef.current;
    const knob = knobRef.current;
    if (!base || !knob) return;

    const R = 44; // max distance

    const start = (e) => {
      active.current = true;
      input.current._joystickActive = true;
      const rect = base.getBoundingClientRect();
      center.current = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };
      move(e);
    };
    const move = (e) => {
      if (!active.current) return;
      const t = e.touches ? e.touches[0] : e;
      let dx = t.clientX - center.current.x;
      let dy = t.clientY - center.current.y;
      const mag = Math.hypot(dx, dy);
      const clamp = Math.min(mag, R);
      if (mag > 0) {
        dx = (dx / mag) * clamp;
        dy = (dy / mag) * clamp;
      }
      knob.style.transform = `translate(${dx}px, ${dy}px)`;
      input.current.x = dx / R;
      input.current.y = dy / R;
    };
    const end = () => {
      active.current = false;
      input.current._joystickActive = false;
      input.current.x = 0;
      input.current.y = 0;
      knob.style.transform = `translate(0px, 0px)`;
    };

    base.addEventListener("touchstart", start, { passive: true });
    window.addEventListener("touchmove", move, { passive: true });
    window.addEventListener("touchend", end);
    base.addEventListener("mousedown", start);
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", end);
    return () => {
      base.removeEventListener("touchstart", start);
      window.removeEventListener("touchmove", move);
      window.removeEventListener("touchend", end);
      base.removeEventListener("mousedown", start);
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", end);
    };
  }, [input]);

  return (
    <div
      ref={baseRef}
      data-testid="mobile-joystick"
      className="fixed bottom-6 left-6 z-30 md:hidden w-28 h-28 rounded-full flex items-center justify-center touch-none select-none"
      style={{
        background: "rgba(7, 91, 96, 0.45)",
        border: "1px solid rgba(140, 228, 213, 0.35)",
        backdropFilter: "blur(10px)",
      }}
    >
      <div
        ref={knobRef}
        className="w-12 h-12 rounded-full"
        style={{
          background: "#20B9AE",
          border: "2px solid #8CE4D5",
          boxShadow: "0 6px 22px rgba(32, 185, 174, 0.5)",
        }}
      />
    </div>
  );
}
