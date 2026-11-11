import { useState, useEffect, useContext, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  Menu,
  X,
  Search,
  ShoppingBag,
  User,
  Heart,
  ChevronDown,
} from "lucide-react";
import { CartContext } from "../../contexts/CartContext";
import { FilterProductContext } from "../../contexts/FIlterProduct";
import { CollectionContext } from "../../contexts/SeasonContext";
import { cn } from "../../utils/cn";
import { Marquee } from "../UI/primitives/Marquee";
import { Dropdown } from "../UI/primitives/Overlays";
import { CollectionMegaMenu } from "./CollectionMegaMenu";
import { MobileNav } from "./MobileNav";
import { isNavLinkActive, NAV_LINKS } from "./navLinks";

const ANNOUNCEMENT_ITEMS = [
  "[ATELIER-01] FREE SHIPPING ON ORDERS OVER 500.000 ₫",
  "ADMIT ONE // SOUNDCHECK AI BODY MEASUREMENT",
  "SIDE A // KINETIC ATELIER MONOLITH",
  "CALIBRATED GARMENT TAGS",
];

function AnnouncementBar() {
  return <Marquee compact tone="ink" items={ANNOUNCEMENT_ITEMS} />;
}

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { CartDataAdd } = useContext(CartContext);
  const { dataFavouriteItemUser } = useContext(FilterProductContext);
  const { collectionData } = useContext(CollectionContext);

  const cartCount = CartDataAdd?.length ?? 0;
  const favCount = dataFavouriteItemUser?.length ?? 0;

  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [bumpKey, setBumpKey] = useState(0);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [searchOpen]);

  useEffect(() => {
    setBumpKey((k) => k + 1);
  }, [cartCount]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const previewSeasons = Array.isArray(collectionData)
    ? collectionData.slice(0, 6)
    : [];
  const featuredSeason = previewSeasons[0];

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only fixed left-4 top-4 z-[2000] border-2 border-ink bg-volt px-4 py-2 mono-label text-xs font-extrabold text-ink shadow-hard"
      >
        Skip to content
      </a>

      <AnnouncementBar />

      <header
        className={cn(
          "sticky top-0 z-[100] h-16 w-full border-b-2 border-ink bg-paper transition-transform duration-150",
          scrolled && "shadow-hard-sm"
        )}
      >
        <div className="container-atelier h-full">
          <div className="flex h-full items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => navigate("/")}
              aria-label="Aurelia — Home"
              className="hit-area-expand inline-flex min-h-[44px] min-w-[44px] shrink-0 items-center gap-2 cursor-pointer"
            >
              <span className="inline-flex h-8 items-center border-2 border-ink bg-ink px-3 font-display text-sm font-black uppercase tracking-[0.2em] text-paper shadow-hard-sm rounded-[2px]">
                AURELIA
              </span>
              <span className="hidden sm:inline-block border-2 border-ink bg-volt px-1.5 py-0.5 mono-label text-[10px] font-extrabold text-ink">
                LAB
              </span>
            </button>

            <nav
              aria-label="Main navigation"
              className="hidden lg:flex items-center gap-1"
            >
              {NAV_LINKS.map((link) => {
                const isActive = isNavLinkActive(location.pathname, link.path);
                const navButtonClass = cn(
                  "inline-flex min-h-[44px] items-center px-3.5 py-2 font-display text-xs font-extrabold uppercase tracking-wider cursor-pointer rounded-[2px] border-2",
                  isActive
                    ? "border-ink bg-volt text-ink shadow-hard-sm"
                    : "border-transparent text-ink hover:border-ink hover:bg-bone"
                );

                if (link.path === "/Collection") {
                  return (
                    <Dropdown
                      key={link.path}
                      align="center"
                      panelClassName="w-[min(760px,90vw)] p-5"
                      trigger={
                        <button
                          type="button"
                          onClick={() => navigate(link.path)}
                          className={cn(navButtonClass, "gap-1.5")}
                        >
                          <span>{link.label}</span>
                          <ChevronDown
                            size={14}
                            strokeWidth={2.5}
                            aria-hidden="true"
                          />
                        </button>
                      }
                    >
                      <CollectionMegaMenu
                        previewSeasons={previewSeasons}
                        featuredSeason={featuredSeason}
                      />
                    </Dropdown>
                  );
                }

                return (
                  <button
                    key={link.path}
                    type="button"
                    onClick={() => navigate(link.path)}
                    className={navButtonClass}
                  >
                    {link.label}
                  </button>
                );
              })}
            </nav>

            <div className="flex items-center gap-2">
              <AnimatePresence mode="wait">
                {searchOpen ? (
                  <motion.form
                    key="search-form"
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 220, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    onSubmit={handleSearch}
                    className="overflow-hidden"
                  >
                    <label htmlFor="desktop-search" className="sr-only">
                      Search
                    </label>
                    <input
                      ref={searchInputRef}
                      id="desktop-search"
                      type="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Escape" && setSearchOpen(false)
                      }
                      placeholder="Tìm sản phẩm..."
                      className="block h-11 w-full border-2 border-ink bg-paper px-3 text-xs font-medium text-ink rounded-[2px]"
                    />
                  </motion.form>
                ) : null}
              </AnimatePresence>

              <button
                type="button"
                aria-label={searchOpen ? "Close search" : "Open search"}
                aria-expanded={searchOpen}
                onClick={() => setSearchOpen((v) => !v)}
                className="press-collapse flex h-11 w-11 items-center justify-center border-2 border-ink bg-paper text-ink shadow-hard-sm hover:bg-volt cursor-pointer rounded-[2px]"
              >
                {searchOpen ? (
                  <X size={18} strokeWidth={2.5} />
                ) : (
                  <Search size={18} strokeWidth={2.5} />
                )}
              </button>

              <button
                type="button"
                aria-label={`Yêu thích (${favCount})`}
                onClick={() => navigate("/account?tab=favourite")}
                className="press-collapse hidden sm:inline-flex h-11 items-center gap-1.5 border-2 border-ink bg-paper px-2.5 mono-label text-xs font-extrabold text-ink shadow-hard-sm hover:bg-volt cursor-pointer rounded-[2px]"
              >
                <Heart size={16} strokeWidth={2.5} aria-hidden="true" />
                <span className="tabular">{favCount}</span>
              </button>

              <button
                type="button"
                aria-label="My account"
                onClick={() => navigate("/account")}
                className="press-collapse hidden sm:flex h-11 w-11 items-center justify-center border-2 border-ink bg-paper text-ink shadow-hard-sm hover:bg-volt cursor-pointer rounded-[2px]"
              >
                <User size={18} strokeWidth={2.5} aria-hidden="true" />
              </button>

              <button
                type="button"
                aria-label={`Cart, ${cartCount} item${cartCount !== 1 ? "s" : ""}`}
                onClick={() => navigate("/cart")}
                className="press-collapse relative inline-flex h-11 items-center gap-2 border-2 border-ink bg-ink px-3 text-paper shadow-hard-flash hover:bg-flash cursor-pointer rounded-[2px]"
              >
                <ShoppingBag size={17} strokeWidth={2.5} aria-hidden="true" />
                <span
                  key={bumpKey}
                  className="animate-bump inline-flex min-w-6 items-center justify-center border-l-2 border-dashed border-paper/50 pl-2 font-mono text-xs font-extrabold tabular text-volt"
                >
                  {cartCount}
                </span>
              </button>

              <button
                type="button"
                aria-label="Open menu"
                aria-expanded={mobileOpen}
                aria-controls="mobile-nav"
                onClick={() => setMobileOpen(true)}
                className="press-collapse flex lg:hidden h-11 w-11 items-center justify-center border-2 border-ink bg-paper text-ink shadow-hard-sm hover:bg-volt cursor-pointer rounded-[2px]"
              >
                <Menu size={20} strokeWidth={2.5} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div id="mobile-nav">
        <MobileNav
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          cartCount={cartCount}
          favCount={favCount}
        />
      </div>
    </>
  );
}
