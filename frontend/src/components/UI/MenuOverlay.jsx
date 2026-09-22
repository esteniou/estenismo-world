import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { DESTINATIONS } from "../../data/portfolio";

export default function MenuOverlay({ onOpenSection }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        data-testid="menu-toggle-button"
        onClick={() => setOpen((v) => !v)}
        className="fixed top-5 right-5 md:top-7 md:right-8 z-50 est-mono-track text-xs md:text-sm font-bold px-5 py-2.5 rounded-full backdrop-blur-md transition-all"
        style={{
          background: open ? "#20B9AE" : "rgba(7, 91, 96, 0.7)",
          color: open ? "#063F43" : "#F4F5ED",
          border: "1px solid rgba(140,228,213,0.35)",
          boxShadow: "0 6px 24px rgba(6, 63, 67, 0.5)",
        }}
      >
        {open ? "CLOSE" : "MENU"}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center px-6"
            style={{
              background: "rgba(4, 27, 29, 0.94)",
              backdropFilter: "blur(24px)",
            }}
            data-testid="full-screen-menu"
          >
            <div className="text-[#8CE4D5] est-mono-track text-xs mb-10">
              CHOOSE A WORLD
            </div>
            <div className="flex flex-col items-center gap-4 md:gap-5">
              {DESTINATIONS.map((d, i) => (
                <motion.button
                  key={d.id}
                  data-testid={`menu-item-${d.id}`}
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.05 * i, duration: 0.4 }}
                  onClick={() => {
                    setOpen(false);
                    onOpenSection(d.id);
                  }}
                  className="est-heading uppercase tracking-tight text-[#F4F5ED] hover:text-[#20B9AE] transition-all"
                  style={{ fontSize: "clamp(1.75rem, 6vw, 4rem)", lineHeight: 1 }}
                >
                  {d.name}
                </motion.button>
              ))}
            </div>
            <div className="mt-14 text-[#8CE4D5]/70 est-mono-track text-[10px]">
              EST · CREATIVE STUDIO · WORLDWIDE
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
