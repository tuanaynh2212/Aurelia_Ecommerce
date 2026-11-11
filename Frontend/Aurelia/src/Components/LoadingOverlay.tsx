import { motion, AnimatePresence } from "framer-motion";
import { Equalizer } from "./UI/primitives/Meter";

interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
}

export const LoadingOverlay = ({
  isLoading,
  message = "Đang xử lý...",
}: LoadingOverlayProps) => {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[9998] flex items-center justify-center bg-ink/60 p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="flex min-w-[260px] flex-col items-center gap-4 border-[3px] border-ink bg-paper px-8 py-6 shadow-hard-lg rounded-[2px]"
          >
            <span className="mono-label text-[10px] font-bold text-ink-muted">
              [OPTICAL RIG // BUSY]
            </span>
            <div className="flex h-12 w-12 items-center justify-center border-2 border-ink bg-volt">
              <Equalizer bars={5} label={message} />
            </div>
            <p className="font-mono text-xs font-extrabold uppercase tracking-wider text-ink">
              {message}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
