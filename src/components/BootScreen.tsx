import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

export function BootScreen() {
  const [show, setShow] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setShow(false), 1600);
    return () => clearTimeout(t);
  }, []);
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}
          className="fixed inset-0 z-[100] aurora-bg flex items-center justify-center"
        >
          <div className="absolute inset-0 grid-bg opacity-50" />
          <div className="relative text-center">
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-5xl md:text-7xl font-display font-bold text-gradient tracking-tight"
            >
              FOCUSFLOW <span className="text-foreground">X</span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
              className="text-xs uppercase tracking-[0.4em] text-muted-foreground mt-4"
            >
              Deep Work Companion
            </motion.div>
            <div className="w-48 h-[2px] mx-auto mt-8 rounded-full bg-white/10 overflow-hidden">
              <motion.div
                initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 1.4, ease: "easeInOut" }}
                className="h-full"
                style={{ background: "var(--gradient-hero)" }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
