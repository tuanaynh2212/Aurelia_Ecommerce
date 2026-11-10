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
  "flex items-center gap-2.5 px-4 py-2.5 rounded-none border border-[var(--color-rule)] bg-[var(--color-bg)] text-[var(--color-ink)] font-mono text-xs uppercase tracking-wider";

export const ToasterObject = {
  success(msg: string) {
    toast.custom(
      (t) => (
        <motion.div
          {...motionBase}
          animate={t.visible ? motionBase.animate : motionBase.exit}
          className={`${baseClass} border-[var(--color-ink)]`}
        >
          <Check size={14} className="text-[var(--color-accent)]" />
          <span className="font-semibold flex-1">{msg}</span>
          <button onClick={() => toast.dismiss(t.id)} className="p-0.5 cursor-pointer hover:opacity-70">
            <X size={13} className="text-[var(--color-ink-muted)]" />
          </button>
        </motion.div>
      ),
      { position: "top-center", duration: 2800 }
    );
  },

  error(msg: string) {
    toast.custom(
      (t) => (
        <motion.div
          {...motionBase}
          animate={t.visible ? motionBase.animate : motionBase.exit}
          className={`${baseClass} border-[var(--color-accent)]`}
        >
          <X size={14} className="text-[var(--color-accent)]" />
          <span className="font-semibold flex-1 text-[var(--color-accent)]">{msg}</span>
          <button onClick={() => toast.dismiss(t.id)} className="p-0.5 cursor-pointer hover:opacity-70">
            <X size={13} className="text-[var(--color-ink-muted)]" />
          </button>
        </motion.div>
      ),
      { position: "top-center", duration: 3000 }
    );
  },

  info(msg: string) {
    toast.custom(
      (t) => (
        <motion.div
          {...motionBase}
          animate={t.visible ? motionBase.animate : motionBase.exit}
          className={`${baseClass}`}
        >
          <Info size={14} className="text-[var(--color-ink)]" />
          <span className="flex-1">{msg}</span>
          <button onClick={() => toast.dismiss(t.id)} className="p-0.5 cursor-pointer hover:opacity-70">
            <X size={13} className="text-[var(--color-ink-muted)]" />
          </button>
        </motion.div>
      ),
      { position: "top-center", duration: 2800 }
    );
  },

  loading(msg: string) {
    return toast.custom(
      () => (
        <motion.div {...motionBase} className={`${baseClass}`}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 0.9, ease: "linear" }}
          >
            <Loader2 size={14} className="text-[var(--color-ink)]" />
          </motion.div>
          <span className="font-medium">{msg}</span>
        </motion.div>
      ),
      { position: "top-right", duration: Infinity }
    );
  },
};

type ToasterFn = ((msg: string, type?: "success" | "error" | "info") => void) & typeof ToasterObject;

const toasterCallable = ((msg: string, type: "success" | "error" | "info" = "info") => {
  if (type === "success") ToasterObject.success(msg);
  else if (type === "error") ToasterObject.error(msg);
  else ToasterObject.info(msg);
}) as ToasterFn;

Object.assign(toasterCallable, ToasterObject);

export const Toaster = toasterCallable;
export default Toaster;
