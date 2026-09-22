import { AnimatePresence, motion } from "framer-motion";
import { CONTENT } from "../../data/portfolio";

export default function ProjectPanel({ sectionId, onClose }) {
  return (
    <AnimatePresence>
      {sectionId && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="fixed inset-0 z-50 est-scroll overflow-y-auto"
          style={{
            background: "rgba(4, 27, 29, 0.92)",
            backdropFilter: "blur(18px)",
          }}
          data-testid="project-showcase-panel"
        >
          <div className="max-w-5xl mx-auto px-5 md:px-10 py-16">
            <motion.button
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.15 }}
              onClick={onClose}
              data-testid="back-to-world-btn"
              className="est-mono-track text-xs font-bold px-5 py-2.5 rounded-full mb-10 inline-flex items-center gap-2 cursor-pointer transition-all"
              style={{
                background: "#20B9AE",
                color: "#063F43",
                border: "1px solid #8CE4D5",
                boxShadow: "0 6px 22px rgba(32,185,174,0.4)",
              }}
            >
              ← BACK TO WORLD
            </motion.button>

            <SectionBody sectionId={sectionId} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function SectionBody({ sectionId }) {
  const c = CONTENT[sectionId];
  if (!c) return null;

  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.1, duration: 0.5 }}
    >
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10 border-b border-[#8CE4D5]/25 pb-8">
        <div>
          <div className="est-mono-track text-[11px] text-[#8CE4D5] mb-3">
            EST · SECTION
          </div>
          <h1
            className="est-heading text-[#F4F5ED]"
            style={{ fontSize: "clamp(2.5rem, 7vw, 5rem)", lineHeight: 0.95 }}
          >
            {c.title}
          </h1>
          <p className="mt-3 text-[#8CE4D5] text-base md:text-lg max-w-2xl">
            {c.subtitle}
          </p>
        </div>
        <div className="est-mono-track text-xs text-[#F4F5ED]/70">{c.year}</div>
      </div>

      {sectionId === "contact" ? (
        <ContactCard c={c} />
      ) : (
        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {c.projects.map((p, i) => (
            <ProjectCard key={i} p={p} />
          ))}
        </div>
      )}
    </motion.div>
  );
}

function ProjectCard({ p }) {
  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className="rounded-3xl overflow-hidden group"
      style={{
        background: "rgba(7, 91, 96, 0.55)",
        border: "1px solid rgba(140, 228, 213, 0.28)",
        boxShadow: "0 24px 60px rgba(4, 27, 29, 0.55)",
        backdropFilter: "blur(12px)",
      }}
      data-testid="project-card"
    >
      <div className="aspect-[4/3] overflow-hidden">
        <img
          src={p.image}
          alt={p.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>
      <div className="p-5 md:p-6">
        <div className="flex items-center justify-between est-mono-track text-[10px] text-[#8CE4D5] mb-3">
          <span>{p.category}</span>
          <span>{p.year}</span>
        </div>
        <h3 className="est-heading text-2xl text-[#F4F5ED] mb-2">{p.title}</h3>
        <p className="text-sm text-[#F4F5ED]/80 leading-relaxed">
          {p.description}
        </p>
      </div>
    </motion.article>
  );
}

function ContactCard({ c }) {
  return (
    <div className="grid md:grid-cols-2 gap-8 md:gap-12">
      <div
        className="rounded-3xl p-8 md:p-10"
        style={{
          background: "rgba(7, 91, 96, 0.55)",
          border: "1px solid rgba(140, 228, 213, 0.28)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div className="est-mono-track text-[11px] text-[#8CE4D5] mb-3">EMAIL</div>
        <a
          href={`mailto:${c.email}`}
          data-testid="contact-email-link"
          className="est-heading text-2xl md:text-3xl text-[#F4F5ED] hover:text-[#20B9AE] transition-colors break-all"
        >
          {c.email}
        </a>
        <div className="mt-8 est-mono-track text-[11px] text-[#8CE4D5] mb-3">LOCATION</div>
        <div className="text-lg text-[#F4F5ED]/90">{c.location}</div>
      </div>

      <div className="flex flex-col gap-4">
        {c.socials.map((s) => (
          <a
            key={s.platform}
            href={s.url}
            target="_blank"
            rel="noreferrer"
            data-testid={`contact-social-${s.platform.toLowerCase()}`}
            className="group rounded-2xl p-5 md:p-6 flex items-center justify-between transition-all hover:translate-x-1"
            style={{
              background: "rgba(11, 133, 132, 0.35)",
              border: "1px solid rgba(140, 228, 213, 0.25)",
            }}
          >
            <div>
              <div className="est-mono-track text-[10px] text-[#8CE4D5] mb-1">
                {s.platform.toUpperCase()}
              </div>
              <div className="est-heading text-xl text-[#F4F5ED]">{s.handle}</div>
            </div>
            <span className="est-mono-track text-[#20B9AE] text-xl">→</span>
          </a>
        ))}
      </div>
    </div>
  );
}
