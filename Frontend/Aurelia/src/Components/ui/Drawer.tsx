import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "../../lib/cn";

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  side?: "left" | "right";
  children: React.ReactNode;
  className?: string;
}

export function Drawer({
  open,
  onClose,
  title,
  side = "right",
  children,
  className,
}: DrawerProps) {
  React.useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  React.useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  const slideVariants = {
    initial: { x: side === "right" ? "100%" : "-100%" },
    animate: { x: 0 },
    exit: { x: side === "right" ? "100%" : "-100%" },
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[1200] overflow-hidden">
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
            variants={slideVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className={cn(
              "fixed top-0 bottom-0 z-10 w-[min(440px,92vw)] bg-[var(--color-cream-50)] shadow-[var(--shadow-lift)] flex flex-col",
              side === "right" ? "right-0 border-l" : "left-0 border-r",
              "border-[var(--color-cream-200)]",
              className
            )}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-cream-200)]">
              {title && (
                <h3 className="font-heading font-semibold text-lg text-[var(--color-ink)]">
                  {title}
                </h3>
              )}
              <button
                onClick={onClose}
                aria-label="Close drawer"
                className="p-1.5 rounded-full hover:bg-[var(--color-cream-200)] text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] ml-auto transition-colors"
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
