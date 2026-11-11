import { cn } from "../../../utils/cn";

/* ------------------------------------------------------------------
   Class recipes shared by primitives and by any rebuilt component that
   must keep a raw semantic element (e.g. an <input> carrying a ref,
   a react-router <Link> that should look like a button).
   ------------------------------------------------------------------ */

export type ButtonVariant = "primary" | "accent" | "volt" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg" | "icon";

const BUTTON_BASE =
  "press-collapse relative inline-flex items-center justify-center gap-2 select-none whitespace-nowrap " +
  "font-mono font-bold uppercase tracking-[0.06em] border-2 border-ink rounded-[2px] cursor-pointer " +
  "disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none aria-disabled:cursor-not-allowed aria-disabled:opacity-50";

const BUTTON_VARIANT: Record<ButtonVariant, string> = {
  primary: "bg-ink text-paper shadow-hard-flash hover:bg-ink-muted",
  accent: "bg-flash text-paper shadow-hard hover:brightness-95",
  volt: "bg-volt text-ink shadow-hard hover:brightness-95",
  secondary: "bg-paper text-ink shadow-hard hover:bg-bone",
  ghost: "bg-transparent border-transparent text-ink shadow-none hover:border-ink hover:bg-paper",
  danger: "bg-danger text-paper shadow-hard hover:brightness-95",
};

const BUTTON_SIZE: Record<ButtonSize, string> = {
  sm: "min-h-[44px] px-3 text-[11px]",
  md: "min-h-[44px] px-5 text-xs",
  lg: "min-h-[56px] px-7 text-sm",
  icon: "h-11 w-11 min-h-[44px] min-w-[44px] p-0 text-xs",
};

export function buttonClasses(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  block = false,
  className?: string
): string {
  return cn(BUTTON_BASE, BUTTON_VARIANT[variant], BUTTON_SIZE[size], block && "w-full", className);
}

export const labelClass =
  "mono-label block text-[11px] font-bold text-ink mb-1.5";

export const inputClass =
  "block w-full min-h-[48px] px-3.5 py-2.5 bg-paper text-ink text-base font-sans " +
  "border-2 border-ink rounded-[2px] placeholder:text-ink-muted " +
  "transition-shadow duration-75 focus:outline-none focus:shadow-[var(--focus-ring)] " +
  "disabled:bg-fog disabled:text-ink-muted disabled:cursor-not-allowed " +
  "aria-[invalid=true]:border-danger";

export const textareaClass = cn(inputClass, "min-h-[120px] resize-y leading-relaxed");

export const selectClass = cn(
  inputClass,
  "appearance-none pr-10 cursor-pointer bg-no-repeat"
);

export const cardClass =
  "bg-paper border-2 border-ink rounded-[2px] shadow-hard";

export const panelClass =
  "bg-paper border-2 border-ink rounded-[2px]";

export const chipClass =
  "inline-flex items-center gap-1.5 min-h-[32px] px-2.5 border-2 border-ink bg-paper " +
  "mono-label text-[11px] font-bold text-ink rounded-[2px]";

export const eyebrowClass =
  "mono-label text-[11px] font-bold text-ink-muted";

export const tableHeadCellClass =
  "sticky top-0 z-[1] bg-ink text-paper mono-label text-[11px] font-bold text-left px-3 py-3 whitespace-nowrap";

export const tableCellClass =
  "px-3 py-3 border-t-2 border-ink/15 align-middle text-sm text-ink";

export const linkClass =
  "underline decoration-2 underline-offset-4 decoration-ink hover:decoration-flash hover:text-ink";

export const sizeTileClass = (selected: boolean, unavailable: boolean) =>
  cn(
    "press-collapse relative inline-flex items-center justify-center min-w-12 min-h-[48px] px-3",
    "border-2 border-ink rounded-[2px] mono-label text-sm font-bold cursor-pointer",
    selected ? "bg-volt text-ink shadow-hard-sm" : "bg-paper text-ink hover:bg-bone",
    unavailable && "strike-diagonal bg-fog text-ink-muted cursor-not-allowed shadow-none"
  );

