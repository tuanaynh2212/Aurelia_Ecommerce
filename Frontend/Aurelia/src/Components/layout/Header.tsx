import { useState, useEffect, useContext, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  Menu,
  X,
  Search,
  ShoppingBag,
  User,
  ChevronRight,
} from "lucide-react";
import { CartContext } from "../../contexts/CartContext";
import { cn } from "../../utils/cn";
import logo from "../../assets/aurelia_logo_svg.svg";

const NAV_LINKS = [
  { label: "Home",        path: "/" },
  { label: "Collections", path: "/Collection" },
  { label: "Products",    path: "/Fashion/Products" },
  { label: "About",       path: "/about" },
] as const;

/* ============================================================
   Announcement Strip — 1px top bar, monospace feel
   ============================================================ */
function AnnouncementBar() {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;
  return (
    <div
      className="relative bg-[var(--color-ink)] text-[var(--color-bg)] text-center py-2 px-8 text-xs tracking-wider font-body font-medium"
      role="banner"
    >
      FREE SHIPPING ON ORDERS OVER 500.000 ₫
      <button
        aria-label="Dismiss announcement"
        onClick={() => setVisible(false)}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[var(--color-bg)] hover:opacity-70 transition-opacity cursor-pointer"
      >
        <X size={12} aria-hidden="true" />
      </button>
    </div>
  );
}

/* ============================================================
   Mobile Navigation Drawer
   ============================================================ */
interface MobileNavProps {
  open: boolean;
  onClose: () => void;
  cartCount: number;
}

function MobileNav({ open, onClose, cartCount }: MobileNavProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
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
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-[var(--color-ink)]/30 z-[1099]"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Drawer panel */}
          <motion.div
            key="drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 350 }}
            className="fixed top-0 right-0 h-full w-[min(340px,88vw)] z-[1100] bg-[var(--color-bg)] flex flex-col border-l border-[var(--color-rule)]"
          >
            {/* Drawer header */}
            <div className="flex items-center justify-between px-5 h-14 border-b border-[var(--color-rule)]">
              <span className="font-heading font-bold text-sm tracking-tight">MENU</span>
              <button
                onClick={onClose}
                aria-label="Close menu"
                className="p-2 -mr-2 text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] transition-colors cursor-pointer"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>

            {/* Search */}
            <form onSubmit={handleSearch} className="px-5 pt-4">
              <label htmlFor="mobile-search" className="sr-only">Search products</label>
              <div className="relative">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-ink-muted)]"
                  aria-hidden="true"
                />
                <input
                  id="mobile-search"
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm sản phẩm..."
                  className="input pl-8 text-xs"
                />
              </div>
            </form>

            {/* Nav links */}
            <nav aria-label="Mobile navigation" className="flex-1 px-5 pt-5 overflow-y-auto">
              <ul className="flex flex-col">
                {NAV_LINKS.map((link) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <li key={link.path} className="border-b border-[var(--color-rule)]">
                      <button
                        onClick={() => handleNav(link.path)}
                        className={cn(
                          "w-full text-left px-0 py-3.5 flex items-center justify-between",
                          "font-body text-sm font-medium",
                          "transition-colors cursor-pointer",
                          isActive
                            ? "text-[var(--color-accent)]"
                            : "text-[var(--color-ink)] hover:text-[var(--color-accent)]"
                        )}
                      >
                        {link.label}
                        <ChevronRight size={14} className="text-[var(--color-ink-muted)]" />
                      </button>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-5 flex flex-col gap-1">
                <button
                  onClick={() => handleNav("/account")}
                  className="w-full text-left py-3 font-body text-sm text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] transition-colors flex items-center gap-2.5 cursor-pointer"
                >
                  <User size={16} aria-hidden="true" />
                  Account
                </button>
                <button
                  onClick={() => handleNav("/cart")}
                  className="w-full text-left py-3 font-body text-sm text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] transition-colors flex items-center gap-2.5 cursor-pointer"
                >
                  <ShoppingBag size={16} aria-hidden="true" />
                  Cart
                  {cartCount > 0 && (
                    <span className="ml-auto text-[10px] font-semibold text-[var(--color-accent)]">
                      ({cartCount})
                    </span>
                  )}
                </button>
              </div>
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ============================================================
   Main Header — Trade Ledger Style
   Minimal, text-driven, 1px hairline, no rounded pills
   ============================================================ */
export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { CartDataAdd } = useContext(CartContext);
  const cartCount = CartDataAdd?.length ?? 0;

  const [mobileOpen, setMobileOpen]   = useState(false);
  const [scrolled, setScrolled]       = useState(false);
  const [searchOpen, setSearchOpen]   = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [searchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <>
      {/* Skip to main content — accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only fixed top-4 left-4 z-[2000] px-3 py-1.5 bg-[var(--color-accent)] text-white text-xs font-semibold"
      >
        Skip to content
      </a>

      <AnnouncementBar />

      <header
        className={cn(
          "sticky top-0 z-[100] w-full transition-all duration-200",
          "border-b border-[var(--color-rule)]",
          scrolled ? "glass-warm" : "bg-[var(--color-bg)]"
        )}
      >
        <div className="container-page">
          <div className="h-14 flex items-center justify-between gap-4">

            {/* Logo */}
            <button
              onClick={() => navigate("/")}
              aria-label="Aurelia — Home"
              className="flex-shrink-0 cursor-pointer"
            >
              <img src={logo} alt="Aurelia" className="h-8 w-auto" />
            </button>

            {/* Desktop Nav — text links, no pill backgrounds */}
            <nav aria-label="Main navigation" className="hidden md:flex items-center gap-0">
              {NAV_LINKS.map((link) => {
                const isActive = location.pathname === link.path ||
                  (link.path !== "/" && location.pathname.startsWith(link.path));
                return (
                  <button
                    key={link.path}
                    onClick={() => navigate(link.path)}
                    className={cn(
                      "px-4 py-2 font-body text-[13px] font-medium tracking-wide uppercase",
                      "transition-colors duration-150 cursor-pointer",
                      isActive
                        ? "text-[var(--color-ink)]"
                        : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
                    )}
                  >
                    {link.label}
                    {isActive && (
                      <span className="block h-[1px] w-full bg-[var(--color-ink)] mt-0.5" />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-0.5">
              {/* Search */}
              <AnimatePresence mode="wait">
                {searchOpen ? (
                  <motion.form
                    key="search-form"
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 200, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    onSubmit={handleSearch}
                    className="overflow-hidden"
                  >
                    <label htmlFor="desktop-search" className="sr-only">Search</label>
                    <input
                      ref={searchInputRef}
                      id="desktop-search"
                      type="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === "Escape" && setSearchOpen(false)}
                      placeholder="Search..."
                      className="input py-1.5 text-xs"
                    />
                  </motion.form>
                ) : null}
              </AnimatePresence>

              <button
                aria-label={searchOpen ? "Close search" : "Open search"}
                aria-expanded={searchOpen}
                onClick={() => setSearchOpen((v) => !v)}
                className="p-2 text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] transition-colors cursor-pointer"
              >
                {searchOpen ? <X size={18} /> : <Search size={18} />}
              </button>

              {/* Account — desktop only */}
              <button
                aria-label="My account"
                onClick={() => navigate("/account")}
                className="hidden sm:flex p-2 text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] transition-colors cursor-pointer"
              >
                <User size={18} aria-hidden="true" />
              </button>

              {/* Cart */}
              <button
                aria-label={`Cart, ${cartCount} item${cartCount !== 1 ? "s" : ""}`}
                onClick={() => navigate("/cart")}
                className="relative p-2 text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] transition-colors cursor-pointer"
              >
                <ShoppingBag size={18} aria-hidden="true" />
                {cartCount > 0 && (
                  <span
                    className="absolute -top-0.5 -right-0.5 w-4 h-4 flex items-center justify-center bg-[var(--color-accent)] text-white text-[9px] font-bold rounded-full leading-none"
                    aria-hidden="true"
                  >
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </button>

              {/* Mobile hamburger */}
              <button
                aria-label="Open menu"
                aria-expanded={mobileOpen}
                aria-controls="mobile-nav"
                onClick={() => setMobileOpen(true)}
                className="md:hidden p-2 text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] transition-colors cursor-pointer"
              >
                <Menu size={20} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <div id="mobile-nav">
        <MobileNav
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          cartCount={cartCount}
        />
      </div>
    </>
  );
}
