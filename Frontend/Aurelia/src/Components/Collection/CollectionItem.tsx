import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface CollectionItemProps {
  title: string;
  subtitle: string;
  image: string;
  aspectRatio?: string;
  className?: string;
  showButton?: boolean;
  id: string;
}

const CollectionItem: React.FC<CollectionItemProps> = ({
  title,
  subtitle,
  image,
  aspectRatio = "aspect-[3/4]",
  className = "",
  showButton = false,
  id,
}) => {
  const navigate = useNavigate();

  return (
    <article
      className={`group flex flex-col gap-3 border-2 border-ink bg-paper p-4 shadow-hard hover:bg-bone cursor-pointer rounded-[2px] ${className}`}
      onClick={() => navigate(`/Collection/${id}`)}
    >
      <div className="flex items-center justify-between border-b-2 border-dashed border-ink pb-2 mono-label text-[10px] font-bold text-ink-muted">
        <span>[ARCHIVE SLAB]</span>
        <span>ADMIT ONE</span>
      </div>

      <div
        className={`relative overflow-hidden border-2 border-ink bg-bone ${aspectRatio}`}
      >
        <div
          className="h-full w-full bg-cover bg-center transition-transform duration-500 ease-out group-hover:scale-105"
          style={{ backgroundImage: `url('${image}')` }}
        />
      </div>

      <div className="flex items-end justify-between gap-3 pt-1">
        <div className="min-w-0">
          <h3 className="font-display text-lg sm:text-xl font-extrabold uppercase text-ink diacritic-safe">
            {title}
          </h3>
          <span className="mono-label mt-1 block text-xs text-ink-muted">
            {subtitle}
          </span>
        </div>

        {showButton && (
          <span className="press-collapse inline-flex min-h-[40px] shrink-0 items-center gap-1.5 border-2 border-ink bg-volt px-3 mono-label text-[11px] font-extrabold text-ink shadow-hard-sm">
            <span>XEM BST</span>
            <ArrowRight size={13} strokeWidth={2.5} />
          </span>
        )}
      </div>
    </article>
  );
};

export default CollectionItem;
