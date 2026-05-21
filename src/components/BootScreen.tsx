import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

export function BootScreen() {
  const [show, setShow] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setShow(false), 1100);
    return () => clearTimeout(t);
  }, []);
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45 }}
          className="fixed inset-0 z-[100] bg-background flex items-center justify-center"
        >
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex items-center justify-center gap-3"
            >
              <div className="w-8 h-8 rounded-lg bg-foreground flex items-center justify-center">
                <span className="text-background font-semibold text-sm">F</span>
              </div>
              <div className="text-xl font-semibold tracking-tight">FocusFlow X</div>
            </motion.div>
            <div className="w-32 h-[2px] mx-auto mt-6 rounded-full bg-white/5 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.9, ease: "easeInOut" }}
                className="h-full bg-foreground/60"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
