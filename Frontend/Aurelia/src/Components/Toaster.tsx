/* eslint-disable react-refresh/only-export-components */
import toast from "react-hot-toast";
import { Check, X, Info, Loader2 } from "lucide-react";
import { motion, easeOut } from "framer-motion";

const motionBase = {
  initial: { y: -8, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: -8, opacity: 0 },
  transition: { duration: 0.15, ease: easeOut },
};

const baseClass =
  "flex items-center gap-3 px-4 py-3 border-2 border-[var(--color-ink)] bg-[var(--color-paper)] text-[var(--color-ink)] shadow-[var(--shadow-hard)] font-mono text-xs uppercase tracking-wider";

export const ToasterObject = {
  success(msg: string) {
    toast.custom(
      (t) => (
        <motion.div
          {...motionBase}
          animate={t.visible ? motionBase.animate : motionBase.exit}
          className={baseClass}
        >
          <span className="inline-block w-2 h-2 rounded-full bg-[var(--color-success)]" />
          <Check size={14} className="text-[var(--color-success)] shrink-0" />
          <span className="font-bold flex-1">{msg}</span>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="min-w-[28px] min-h-[28px] inline-flex items-center justify-center cursor-pointer hover:bg-[var(--color-bone)]"
            aria-label="Đóng thông báo"
          >
            <X size={13} className="text-[var(--color-ink-muted)]" />
          </button>
        </motion.div>
      ),
      { position: "top-center", duration: 2800 },
    );
  },

  error(msg: string) {
    toast.custom(
      (t) => (
        <motion.div
          {...motionBase}
          animate={t.visible ? motionBase.animate : motionBase.exit}
          className={`${baseClass} border-[var(--color-danger)] shadow-[var(--shadow-hard-flash)]`}
        >
          <span className="inline-block w-2 h-2 rounded-full bg-[var(--color-danger)]" />
          <X size={14} className="text-[var(--color-danger)] shrink-0" />
          <span className="font-bold flex-1 text-[var(--color-danger)]">{msg}</span>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="min-w-[28px] min-h-[28px] inline-flex items-center justify-center cursor-pointer hover:bg-[var(--color-bone)]"
            aria-label="Đóng thông báo"
          >
            <X size={13} className="text-[var(--color-ink-muted)]" />
          </button>
        </motion.div>
      ),
      { position: "top-center", duration: 3000 },
    );
  },

  info(msg: string) {
    toast.custom(
      (t) => (
        <motion.div
          {...motionBase}
          animate={t.visible ? motionBase.animate : motionBase.exit}
          className={baseClass}
        >
          <span className="inline-block w-2 h-2 rounded-full bg-[var(--color-info)]" />
          <Info size={14} className="text-[var(--color-info)] shrink-0" />
          <span className="font-bold flex-1">{msg}</span>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="min-w-[28px] min-h-[28px] inline-flex items-center justify-center cursor-pointer hover:bg-[var(--color-bone)]"
            aria-label="Đóng thông báo"
          >
            <X size={13} className="text-[var(--color-ink-muted)]" />
          </button>
        </motion.div>
      ),
      { position: "top-center", duration: 2800 },
    );
  },

  loading(msg: string) {
    return toast.custom(
      () => (
        <motion.div {...motionBase} className={baseClass}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 0.9, ease: "linear" }}
          >
            <Loader2 size={14} className="text-[var(--color-flash)]" />
          </motion.div>
          <span className="font-bold">{msg}</span>
        </motion.div>
      ),
      { position: "top-right", duration: Infinity },
    );
  },
};

type ToasterFn = ((msg: string, type?: "success" | "error" | "info") => void) &
  typeof ToasterObject;

const toasterCallable = ((
  msg: string,
  type: "success" | "error" | "info" = "info",
) => {
  if (type === "success") ToasterObject.success(msg);
  else if (type === "error") ToasterObject.error(msg);
  else ToasterObject.info(msg);
}) as ToasterFn;

Object.assign(toasterCallable, ToasterObject);

export const Toaster = toasterCallable;
export default Toaster;
