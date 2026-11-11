import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

interface SeasonPreview {
  id?: string;
  name?: string;
  banner?: string;
}

interface CollectionMegaMenuProps {
  previewSeasons: SeasonPreview[];
  featuredSeason?: SeasonPreview;
}

export function CollectionMegaMenu({
  previewSeasons,
  featuredSeason,
}: CollectionMegaMenuProps) {
  return (
    <div className="grid grid-cols-12 gap-5">
      <div className="col-span-4 border-r-2 border-dashed border-ink pr-4">
        <p className="mono-label text-[10px] font-bold text-ink-muted">
          [01 // ARCHIVE INDEX]
        </p>
        <h4 className="mt-1 font-display text-lg font-black uppercase text-ink diacritic-safe">
          BỘ SƯU TẬP THEO MÙA
        </h4>
        <p className="mt-1 text-xs text-ink-muted">
          Chọn mùa để duyệt thiết kế và thông số chất liệu.
        </p>
        <Link
          to="/Collection"
          className="press-collapse mt-4 inline-flex min-h-[44px] items-center gap-1.5 border-2 border-ink bg-ink px-3 mono-label text-[11px] font-bold text-paper shadow-hard-sm hover:bg-volt hover:text-ink"
        >
          XEM TẤT CẢ MÙA
          <ArrowUpRight size={14} aria-hidden="true" />
        </Link>
      </div>

      <div className="col-span-4">
        <p className="mono-label mb-2 text-[10px] font-bold text-ink-muted">
          [02 // SETLIST]
        </p>
        <ul className="space-y-1.5">
          {previewSeasons.length > 0 ? (
            previewSeasons.map((s, idx) => (
              <li key={s.id ?? idx}>
                <Link
                  to={s.id ? `/Collection/${s.id}` : "/Collection"}
                  className="flex min-h-[40px] items-center justify-between border-2 border-ink bg-bone/50 px-2.5 py-1.5 text-xs font-bold text-ink hover:bg-volt"
                >
                  <span className="truncate">
                    {String(idx + 1).padStart(2, "0")}. {s.name ?? "Season"}
                  </span>
                  <ArrowUpRight size={13} aria-hidden="true" />
                </Link>
              </li>
            ))
          ) : (
            <li>
              <Link
                to="/Fashion/Products"
                className="flex min-h-[44px] items-center justify-between border-2 border-ink bg-bone px-3 py-2 text-xs font-bold text-ink hover:bg-volt"
              >
                <span>Danh mục sản phẩm</span>
                <ArrowUpRight size={14} aria-hidden="true" />
              </Link>
            </li>
          )}
        </ul>
      </div>

      <div className="col-span-4">
        <p className="mono-label mb-2 text-[10px] font-bold text-ink-muted">
          [03 // FEATURED SLAB]
        </p>
        <Link
          to={featuredSeason?.id ? `/Collection/${featuredSeason.id}` : "/Collection"}
          className="group block border-2 border-ink bg-bone p-2.5 shadow-hard-sm"
        >
          {featuredSeason?.banner ? (
            <div className="aspect-[4/3] w-full overflow-hidden border-2 border-ink bg-paper">
              <img
                src={featuredSeason.banner}
                alt={featuredSeason.name ?? "Featured season"}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          ) : (
            <div className="studio-grid-bg aspect-[4/3] w-full border-2 border-ink" />
          )}
          <p className="mt-2 truncate font-display text-xs font-extrabold uppercase text-ink diacritic-safe">
            {featuredSeason?.name ?? "AURELIA ARCHIVE"}
          </p>
        </Link>
      </div>
    </div>
  );
}

