import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useContext } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { CollectionContext } from "../../contexts/SeasonContext";
import { Section } from "../layout/Section";

export const Collection = () => {
  const navigate = useNavigate();
  const { collectionData } = useContext(CollectionContext);

  if (!collectionData || collectionData.length === 0) return null;

  return (
    <Section
      badge="Xu hướng mùa mới"
      title="Các Bộ Sưu Tập Nổi Bật"
      subtitle="Được giám tuyển kỹ lưỡng theo từng mùa và cảm hứng thời trang hiện đại"
    >
      <div className="space-y-16">
        {collectionData.map((item, index) => {
          const isReversed = index % 2 === 1;

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5 }}
              className={`flex flex-col md:flex-row items-center gap-8 lg:gap-12 ${
                isReversed ? "md:flex-row-reverse" : ""
              }`}
            >
              {/* Banner Image Card */}
              <div className="w-full md:w-1/2 relative rounded-[var(--radius-2xl)] overflow-hidden shadow-[var(--shadow-card)] border border-[var(--color-cream-300)] group aspect-[4/3] bg-[var(--color-cream-200)]">
                <img
                  src={item.banner}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-ink)]/40 via-transparent to-transparent pointer-events-none" />
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[var(--radius-pill)] bg-white/90 backdrop-blur-xs text-xs font-semibold text-[var(--color-ink)] shadow-xs">
                    <Sparkles size={12} className="text-[var(--color-accent)]" />
                    <span>Bộ sưu tập 2026</span>
                  </span>
                </div>
              </div>

              {/* Text Info */}
              <div className="w-full md:w-1/2 flex flex-col justify-center p-2 sm:p-6">
                <span className="text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)] mb-2">
                  {item.slug || "Collection"}
                </span>

                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold text-[var(--color-ink)] mb-3">
                  {item.name}
                </h3>

                {item.slogan && (
                  <p className="text-base sm:text-lg font-heading italic text-[var(--color-ink-soft)] mb-4">
                    "{item.slogan}"
                  </p>
                )}

                <p className="text-sm sm:text-base text-[var(--color-ink-soft)] mb-8 leading-relaxed font-body">
                  {item.description}
                </p>

                <div>
                  <button
                    onClick={() => navigate(`/Collection/${item.id}`)}
                    className="btn btn-primary group inline-flex items-center gap-2"
                  >
                    <span>Xem chi tiết BST</span>
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </Section>
  );
};

export default Collection;
