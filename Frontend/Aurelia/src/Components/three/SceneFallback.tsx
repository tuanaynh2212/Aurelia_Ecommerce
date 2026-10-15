import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export interface SceneFallbackProps {
  className?: string;
  label?: string;
  imageSrc?: string;
}

export function SceneFallback({
  className = "",
  label = "Aurelia Atelier",
  imageSrc,
}: SceneFallbackProps) {
  return (
    <div
      className={`relative w-full h-full min-h-[300px] rounded-[var(--radius-2xl)] overflow-hidden flex items-center justify-center bg-gradient-to-tr from-[var(--color-peach-100)] via-[var(--color-cream-100)] to-[var(--color-sage-light)]/40 ${className}`}
    >
      {imageSrc ? (
        <img
          src={imageSrc}
          alt={label}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="relative flex flex-col items-center justify-center p-8 text-center">
          {/* Animated floating soft rings */}
          <motion.div
            animate={{ scale: [1, 1.08, 1], rotate: [0, 90, 180, 270, 360] }}
            transition={{ repeat: Infinity, duration: 16, ease: "linear" }}
            className="w-48 h-48 rounded-full border-2 border-dashed border-[var(--color-accent)]/30 absolute"
          />
          <motion.div
            animate={{ scale: [1.05, 0.95, 1.05] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="w-36 h-36 rounded-full bg-white/70 backdrop-blur-md shadow-[var(--shadow-card)] flex items-center justify-center border border-[var(--color-cream-300)]"
          >
            <Sparkles size={36} className="text-[var(--color-accent)]" />
          </motion.div>

          <span className="mt-6 text-xs font-bold uppercase tracking-widest text-[var(--color-ink)] bg-white/80 px-3.5 py-1.5 rounded-[var(--radius-pill)] shadow-xs">
            {label}
          </span>
        </div>
      )}
    </div>
  );
}

export default SceneFallback;
