import {
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { Link } from "react-router-dom";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { cn } from "../../../utils/cn";

/* ==========================================================================
   Modal
   ========================================================================== */

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  code?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const MODAL_SIZE: Record<NonNullable<ModalProps["size"]>, string> = {
  sm: "max-w-md",
  md: "max-w-xl",
  lg: "max-w-3xl",
  xl: "max-w-5xl",
};

export function Modal({
  open,
  onClose,
  title,
  code = "[MODAL]",
  children,
  footer,
  size = "md",
  className,
}: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={typeof title === "string" ? title : "Hộp thoại"}
      className="fixed inset-0 z-[1200] flex items-center justify-center p-4"
    >
      <div
        className="fixed inset-0 bg-ink/60"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={cn(
          "relative z-[1201] flex max-h-[90vh] w-full flex-col border-[3px] border-ink bg-paper shadow-hard-lg rounded-[2px]",
          MODAL_SIZE[size],
          className
        )}
      >
        <header className="flex items-center justify-between gap-3 border-b-2 border-ink bg-bone px-5 py-3.5">
          <div className="min-w-0">
            <span className="mono-label text-[10px] font-bold text-ink-muted">{code}</span>
            {title && (
              <h3 className="truncate font-display text-lg font-extrabold uppercase text-ink diacritic-safe">
                {title}
              </h3>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            className="press-collapse flex h-11 w-11 shrink-0 items-center justify-center border-2 border-ink bg-paper text-ink shadow-hard-sm hover:bg-volt cursor-pointer rounded-[2px]"
          >
            <X size={18} strokeWidth={2.5} aria-hidden="true" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-5">{children}</div>

        {footer && (
          <footer className="border-t-2 border-ink bg-bone px-5 py-3.5">
            {footer}
          </footer>
        )}
      </div>
    </div>
  );
}

/* ==========================================================================
   Drawer (side drawer on desktop, bottom sheet on mobile with safe-area padding)
   ========================================================================== */

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  code?: string;
  side?: "right" | "left" | "bottom";
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export function Drawer({
  open,
  onClose,
  title,
  code = "[DRAWER]",
  side = "right",
  children,
  footer,
  className,
}: DrawerProps) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={typeof title === "string" ? title : "Ngăn kéo"}
      className="fixed inset-0 z-[1200]"
    >
      <div
        className="fixed inset-0 bg-ink/60"
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className={cn(
          "fixed z-[1201] flex flex-col border-ink bg-paper shadow-hard-lg safe-bottom",
          side === "bottom" &&
            "inset-x-0 bottom-0 max-h-[88vh] border-t-[3px]",
          side === "right" &&
            "inset-x-0 bottom-0 max-h-[88vh] border-t-[3px] md:inset-y-0 md:right-0 md:left-auto md:max-h-none md:w-[min(440px,92vw)] md:border-t-0 md:border-l-[3px]",
          side === "left" &&
            "inset-x-0 bottom-0 max-h-[88vh] border-t-[3px] md:inset-y-0 md:left-0 md:right-auto md:max-h-none md:w-[min(440px,92vw)] md:border-t-0 md:border-r-[3px]",
          className
        )}
      >
        <header className="flex items-center justify-between gap-3 border-b-2 border-ink bg-bone px-5 py-3.5">
          <div>
            <span className="mono-label text-[10px] font-bold text-ink-muted">{code}</span>
            {title && (
              <h3 className="font-display text-lg font-extrabold uppercase text-ink diacritic-safe">
                {title}
              </h3>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            className="press-collapse flex h-11 w-11 items-center justify-center border-2 border-ink bg-paper text-ink shadow-hard-sm hover:bg-volt cursor-pointer rounded-[2px]"
          >
            <X size={18} strokeWidth={2.5} aria-hidden="true" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-5">{children}</div>

        {footer && (
          <footer className="sticky bottom-0 border-t-2 border-ink bg-bone px-5 py-3.5">
            {footer}
          </footer>
        )}
      </aside>
    </div>
  );
}

/* ==========================================================================
   Dropdown (with mandatory 16px invisible hover bridge)
   ========================================================================== */

export interface DropdownProps {
  trigger: ReactNode;
  children: ReactNode;
  align?: "left" | "right" | "center";
  panelClassName?: string;
  className?: string;
}

export function Dropdown({
  trigger,
  children,
  align = "left",
  panelClassName,
  className,
}: DropdownProps) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={cn("relative inline-block", className)}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <div
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="inline-flex items-center"
      >
        {trigger}
      </div>

      {open && (
        <div
          className={cn(
            "absolute top-full z-[1100] pt-4", // 16px invisible hover bridge so diagonal cursor movement never closes menu
            align === "left" && "left-0",
            align === "right" && "right-0",
            align === "center" && "left-1/2 -translate-x-1/2"
          )}
        >
          <div
            className={cn(
              "border-[3px] border-ink bg-paper p-4 shadow-hard-lg rounded-[2px]",
              panelClassName
            )}
          >
            {children}
          </div>
        </div>
      )}
    </div>
  );
}

/* ==========================================================================
   Tabs
   ========================================================================== */

export interface TabItem {
  id: string;
  label: ReactNode;
  count?: number | string;
}

export interface TabsProps {
  items: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
}

export function Tabs({ items, activeId, onChange, className }: TabsProps) {
  return (
    <div
      role="tablist"
      className={cn(
        "flex flex-wrap gap-2 border-b-2 border-ink pb-3",
        className
      )}
    >
      {items.map((tab, idx) => {
        const active = tab.id === activeId;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(tab.id)}
            className={cn(
              "press-collapse inline-flex min-h-[44px] items-center gap-2 border-2 border-ink px-4 py-2 mono-label text-xs font-extrabold cursor-pointer rounded-[2px]",
              active
                ? "bg-volt text-ink shadow-hard-sm"
                : "bg-paper text-ink hover:bg-bone"
            )}
          >
            <span className="text-[10px] text-ink-muted">
              {String(idx + 1).padStart(2, "0")}
            </span>
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span className="border border-ink bg-paper px-1.5 py-0.5 text-[10px] tabular">
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/* ==========================================================================
   Accordion (2px ink rule)
   ========================================================================== */

export interface AccordionItemProps {
  title: ReactNode;
  code?: string;
  defaultOpen?: boolean;
  children: ReactNode;
  className?: string;
}

export function AccordionItem({
  title,
  code,
  defaultOpen = false,
  children,
  className,
}: AccordionItemProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={cn("border-b-2 border-ink", className)}>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex min-h-[52px] w-full items-center justify-between gap-3 py-3 text-left cursor-pointer hover:bg-bone/60 px-2"
      >
        <div className="flex items-center gap-2.5">
          {code && (
            <span className="mono-label text-[11px] font-bold text-ink-muted">
              [{code}]
            </span>
          )}
          <span className="font-display text-sm md:text-base font-extrabold uppercase text-ink diacritic-safe">
            {title}
          </span>
        </div>
        <ChevronDown
          size={18}
          strokeWidth={2.5}
          aria-hidden="true"
          className={cn(
            "shrink-0 text-ink transition-transform duration-150",
            open && "rotate-180"
          )}
        />
      </button>
      {open && <div className="px-2 pb-4 pt-1 text-sm text-ink">{children}</div>}
    </div>
  );
}

/* ==========================================================================
   Breadcrumb
   ========================================================================== */

export interface BreadcrumbItem {
  label: ReactNode;
  to?: string;
}

export function Breadcrumb({
  items,
  className,
}: {
  items: BreadcrumbItem[];
  className?: string;
}) {
  return (
    <nav aria-label="Breadcrumb" className={cn("py-2", className)}>
      <ol className="flex flex-wrap items-center gap-2 mono-label text-[11px] font-bold">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={idx} className="inline-flex items-center gap-2">
              {item.to && !isLast ? (
                <Link
                  to={item.to}
                  className="text-ink-muted hover:text-ink underline decoration-2 underline-offset-4"
                >
                  {item.label}
                </Link>
              ) : (
                <span aria-current={isLast ? "page" : undefined} className="text-ink">
                  {item.label}
                </span>
              )}
              {!isLast && <span aria-hidden="true" className="text-ink-muted">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/* ==========================================================================
   Pagination (44×44 square controls)
   ========================================================================== */

export interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav
      aria-label="Phân trang"
      className={cn("flex flex-wrap items-center justify-center gap-2", className)}
    >
      <button
        type="button"
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page <= 1}
        aria-label="Trang trước"
        className="press-collapse flex h-11 w-11 items-center justify-center border-2 border-ink bg-paper text-ink shadow-hard-sm hover:bg-volt disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer rounded-[2px]"
      >
        <ChevronLeft size={16} strokeWidth={2.5} aria-hidden="true" />
      </button>

      {pages.map((p) => {
        const active = p === page;
        return (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            aria-current={active ? "page" : undefined}
            className={cn(
              "press-collapse flex h-11 w-11 items-center justify-center border-2 border-ink font-mono text-sm font-extrabold tabular cursor-pointer rounded-[2px]",
              active
                ? "bg-volt text-ink shadow-hard-sm"
                : "bg-paper text-ink hover:bg-bone"
            )}
          >
            {p}
          </button>
        );
      })}

      <button
        type="button"
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={page >= totalPages}
        aria-label="Trang tiếp"
        className="press-collapse flex h-11 w-11 items-center justify-center border-2 border-ink bg-paper text-ink shadow-hard-sm hover:bg-volt disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer rounded-[2px]"
      >
        <ChevronRight size={16} strokeWidth={2.5} aria-hidden="true" />
      </button>
    </nav>
  );
}
