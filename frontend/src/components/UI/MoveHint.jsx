import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function MoveHint() {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 7000);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.5 }}
          className="fixed bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 z-30 pointer-events-none"
          data-testid="move-explore-hint"
        >
          <div
            className="est-mono-track text-[11px] md:text-xs px-6 py-3 rounded-full est-hint-pulse"
            style={{
              background: "rgba(7, 91, 96, 0.7)",
              color: "#8CE4D5",
              border: "1px solid rgba(140, 228, 213, 0.35)",
              backdropFilter: "blur(8px)",
              boxShadow: "0 6px 22px rgba(6, 63, 67, 0.5)",
            }}
          >
            <span className="hidden md:inline">MOVE TO EXPLORE · W A S D · APPROACH TO OPEN</span>
            <span className="md:hidden">DRAG JOYSTICK TO EXPLORE</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
