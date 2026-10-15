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
    <div
      className={`flex flex-col gap-3 group cursor-pointer ${className}`}
      onClick={() => navigate(`/Collection/${id}`)}
    >
      <div className={`overflow-hidden rounded-none relative ${aspectRatio} bg-[var(--color-surface)] border border-[var(--color-rule)] group-hover:border-[var(--color-ink)] transition-colors`}>
        <div
          className="w-full h-full bg-cover bg-center transition-transform duration-500 ease-out group-hover:scale-102"
          style={{ backgroundImage: `url('${image}')` }}
        />
      </div>

      <div className="flex justify-between items-end pt-1 pb-1">
        <div className="flex flex-col items-start">
          <h3 className="text-lg sm:text-xl font-heading font-bold text-[var(--color-ink)] group-hover:text-[var(--color-accent)] transition-colors leading-tight">
            {title}
          </h3>
          <span className="text-xs font-mono text-[var(--color-ink-muted)] mt-1 uppercase tracking-wide">
            {subtitle}
          </span>
        </div>

        {showButton && (
          <span className="btn btn-outline btn-sm rounded-none font-mono text-[11px] uppercase tracking-wider inline-flex items-center gap-1.5 flex-shrink-0">
            <span>XEM BST</span>
            <ArrowRight size={13} />
          </span>
        )}
      </div>
    </div>
  );
};

export default CollectionItem;
