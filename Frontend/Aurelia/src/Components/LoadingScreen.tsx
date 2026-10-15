import { motion } from "framer-motion";

export const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-[var(--color-bg)] z-[9999]">
      <div className="flex flex-col items-center gap-5">
        {/* Brand Mark */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="text-center"
        >
          <h1 className="text-2xl font-heading font-bold tracking-[0.15em] text-[var(--color-ink)]">
            AURELIA
          </h1>
          <p className="text-[10px] font-body text-[var(--color-ink-muted)] tracking-[0.25em] uppercase mt-1">
            Fashion & Lifestyle
          </p>
        </motion.div>

        {/* Minimal loading bar */}
        <div className="w-32 h-px bg-[var(--color-rule)] overflow-hidden">
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }}
            className="w-1/2 h-full bg-[var(--color-ink)]"
          />
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
