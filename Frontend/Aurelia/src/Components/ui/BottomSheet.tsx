import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "../../utils/cn";

export interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function BottomSheet({
  open,
  onClose,
  title,
  children,
  className,
}: BottomSheetProps) {
  React.useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[1200] flex flex-col justify-end">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            aria-hidden="true"
            className="fixed inset-0 bg-[var(--color-ink)]/40 backdrop-blur-sm"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className={cn(
              "relative z-10 w-full max-h-[85vh] bg-[var(--color-cream-50)] rounded-t-[var(--radius-xl)]",
              "border-t border-[var(--color-cream-200)] shadow-[var(--shadow-lift)] flex flex-col",
              className
            )}
          >
            <div className="pt-3 pb-1 flex justify-center">
              <div className="w-10 h-1 rounded-full bg-[var(--color-cream-300)]" />
            </div>

            <div className="flex items-center justify-between px-6 py-3 border-b border-[var(--color-cream-200)]">
              {title ? (
                <h3 className="font-heading font-semibold text-lg text-[var(--color-ink)]">
                  {title}
                </h3>
              ) : <div />}
              <button
                onClick={onClose}
                aria-label="Close"
                className="p-1 rounded-full hover:bg-[var(--color-cream-200)] text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
