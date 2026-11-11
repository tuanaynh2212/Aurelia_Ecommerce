import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X, Search, ShoppingBag, User, ArrowUpRight } from "lucide-react";
import { cn } from "../../utils/cn";
import { isNavLinkActive, NAV_LINKS } from "./navLinks";

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
  cartCount: number;
  favCount: number;
}

export function MobileNav({
  open,
  onClose,
  cartCount,
  favCount,
}: MobileNavProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const handleNav = (path: string) => {
    navigate(path);
    onClose();
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="mobile-sheet"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
          initial={{ y: "-100%" }}
          animate={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="studio-grid-bg fixed inset-0 z-[1300] flex flex-col bg-bone safe-bottom"
        >
          <div className="flex h-16 items-center justify-between border-b-2 border-ink bg-paper px-4">
            <span className="mono-label text-xs font-extrabold text-ink">
              [ATELIER // SETLIST MENU]
            </span>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close menu"
              className="press-collapse flex h-11 w-11 items-center justify-center border-2 border-ink bg-paper text-ink shadow-hard-sm hover:bg-volt cursor-pointer rounded-[2px]"
            >
              <X size={20} strokeWidth={2.5} aria-hidden="true" />
            </button>
          </div>

          <form
            onSubmit={handleSearch}
            className="border-b-2 border-ink bg-paper p-4"
          >
            <label htmlFor="mobile-search" className="sr-only">
              Search products
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search
                  size={16}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted"
                  aria-hidden="true"
                />
                <input
                  id="mobile-search"
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm sản phẩm..."
                  className="block min-h-[48px] w-full border-2 border-ink bg-paper pl-10 pr-3 text-base text-ink rounded-[2px]"
                />
              </div>
              <button
                type="submit"
                className="press-collapse min-h-[48px] border-2 border-ink bg-volt px-4 mono-label text-xs font-extrabold text-ink shadow-hard-sm cursor-pointer rounded-[2px]"
              >
                TÌM
              </button>
            </div>
          </form>

          <nav
            aria-label="Mobile navigation"
            className="flex-1 overflow-y-auto p-4"
          >
            <ul className="flex flex-col gap-2.5">
              {NAV_LINKS.map((link, idx) => {
                const isActive = isNavLinkActive(location.pathname, link.path);
                return (
                  <li key={link.path}>
                    <button
                      type="button"
                      onClick={() => handleNav(link.path)}
                      className={cn(
                        "press-collapse flex min-h-[56px] w-full items-center justify-between border-2 border-ink px-4 py-3 text-left shadow-hard cursor-pointer rounded-[2px]",
                        isActive
                          ? "bg-volt text-ink"
                          : "bg-paper text-ink hover:bg-bone"
                      )}
                    >
                      <span className="flex items-center gap-3">
                        <span className="inline-flex h-7 w-7 items-center justify-center border-2 border-ink bg-ink font-mono text-xs font-extrabold text-paper">
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                        <span className="font-display text-xl font-black uppercase tracking-tight diacritic-safe">
                          {link.label}
                        </span>
                      </span>
                      <ArrowUpRight
                        size={20}
                        strokeWidth={2.5}
                        aria-hidden="true"
                      />
                    </button>
                  </li>
                );
              })}
            </ul>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleNav("/account")}
                className="press-collapse flex min-h-[52px] items-center justify-center gap-2 border-2 border-ink bg-paper px-3 mono-label text-xs font-extrabold text-ink shadow-hard cursor-pointer rounded-[2px]"
              >
                <User size={16} aria-hidden="true" />
                ACCOUNT
                {favCount > 0 && (
                  <span className="border border-ink bg-volt px-1.5 py-0.5 text-[10px]">
                    ♥ {favCount}
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => handleNav("/cart")}
                className="press-collapse flex min-h-[52px] items-center justify-center gap-2 border-2 border-ink bg-ink px-3 mono-label text-xs font-extrabold text-paper shadow-hard-flash cursor-pointer rounded-[2px]"
              >
                <ShoppingBag size={16} aria-hidden="true" />
                CART ({cartCount})
              </button>
            </div>
          </nav>

          <div className="border-t-2 border-ink bg-paper px-4 py-3">
            <div className="barcode w-full" aria-hidden="true" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

