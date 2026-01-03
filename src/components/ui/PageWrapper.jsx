"use client";
import { easeOut, motion } from "framer-motion";

export default function PageWrapper({ children }) {
  return (
    <motion.div
      initial={{ scale: 0.98, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ x: 0.98, opacity: 0 }}
      transition={{ duration: 0.3, ease: easeOut }}
      className="h-full overflow-hidden"
    >
      {children}
    </motion.div>
  );
}
