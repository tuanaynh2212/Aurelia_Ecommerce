import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export const BrandMarquee = () => {
  const brands = [
    "Aurelia Atelier",
    "Pristine Studio",
    "Valente Maison",
    "Étoile Paris",
    "Opaline Living",
    "Seraphine Bloom",
    "Maison Minimal",
    "Modern Tailor",
  ];

  const items = [...brands, ...brands, ...brands];

  return (
    <section className="w-full bg-[var(--color-cream-100)]/70 py-6 border-y border-[var(--color-cream-300)]/70 overflow-hidden select-none">
      <motion.div
        className="flex items-center gap-8 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ repeat: Infinity, ease: "linear", duration: 32 }}
      >
        {items.map((brand, i) => (
          <div key={i} className="flex items-center gap-8 flex-shrink-0">
            <span className="font-heading font-medium text-sm sm:text-base tracking-wider uppercase text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] transition-colors">
              {brand}
            </span>
            <Sparkles size={14} className="text-[var(--color-accent)] opacity-60" />
          </div>
        ))}
      </motion.div>
    </section>
  );
};

export default BrandMarquee;
