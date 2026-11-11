import type { CSSProperties, ReactNode } from "react";
import { cn } from "../../../utils/cn";

export type StampTone = "flash" | "success" | "ink" | "volt" | "danger";

const STAMP_TONE: Record<StampTone, string> = {
  flash: "border-flash text-flash",
  success: "border-success text-success",
  ink: "border-ink text-ink",
  volt: "border-ink text-ink bg-volt",
  danger: "border-danger text-danger",
};

export interface StampProps {
  children: ReactNode;
  tone?: StampTone;
  animate?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}

/** Rubber stamp badge — rotated −6°, double rule, optional THUD entrance. */
export function Stamp({ children, tone = "flash", animate = false, className, size = "md" }: StampProps) {
  return (
    <span
      className={cn(
        "inline-flex select-none items-center justify-center border-[3px] px-3 py-1 font-mono font-extrabold uppercase tracking-[0.12em]",
        "outline outline-2 outline-offset-2 outline-current rotate-[-6deg] bg-paper/80",
        size === "sm" && "text-[10px] px-2",
        size === "md" && "text-xs",
        size === "lg" && "text-xl px-4 py-2",
        STAMP_TONE[tone],
        animate && "animate-stamp",
        className
      )}
    >
      {children}
    </span>
  );
}

export interface TicketProps {
  children: ReactNode;
  /** Optional stub separated by a perforated tear line. */
  stub?: ReactNode;
  stubPosition?: "right" | "bottom";
  /** Background colour class used to "cut" the notches (match the surface behind the ticket). */
  notchClassName?: string;
  selected?: boolean;
  disabled?: boolean;
  active?: boolean;
  stamp?: ReactNode;
  className?: string;
  bodyClassName?: string;
  style?: CSSProperties;
  as?: "div" | "article" | "li" | "section";
}

/**
 * Perforated admission ticket with semicircular side notches and a dashed tear line.
 * Selected state = volt fill; disabled = struck + fog.
 */
export function Ticket({
  children,
  stub,
  stubPosition = "right",
  notchClassName = "bg-bone",
  selected = false,
  disabled = false,
  active = false,
  stamp,
  className,
  bodyClassName,
  style,
  as: Tag = "div",
}: TicketProps) {
  const horizontal = stubPosition === "right";
  return (
    <Tag
      style={style}
      className={cn(
        "relative flex rounded-[2px] text-ink",
        horizontal ? "flex-row" : "flex-col",
        active || selected ? "border-[3px] border-ink shadow-hard-lg" : "border-2 border-ink shadow-hard",
        selected ? "bg-volt" : disabled ? "bg-fog text-ink-muted" : "bg-paper",
        className
      )}
    >
      <div className={cn("relative min-w-0 flex-1 p-4 md:p-5", disabled && "line-through decoration-2", bodyClassName)}>
        {children}
      </div>

      {stub && (
        <div
          className={cn(
            "relative shrink-0 p-4",
            horizontal ? "border-l-2 border-dashed border-ink" : "border-t-2 border-dashed border-ink"
          )}
        >
          {horizontal ? (
            <>
              <span aria-hidden="true" className={cn("ticket-notch notch-t -left-[12px] -top-[13px]", notchClassName)} />
              <span aria-hidden="true" className={cn("ticket-notch notch-b -left-[12px] -bottom-[13px]", notchClassName)} />
            </>
          ) : (
            <>
              <span aria-hidden="true" className={cn("ticket-notch notch-l -left-[13px] -top-[12px]", notchClassName)} />
              <span aria-hidden="true" className={cn("ticket-notch notch-r -right-[13px] -top-[12px]", notchClassName)} />
            </>
          )}
          {stub}
        </div>
      )}

      {!stub &&
        (horizontal ? (
          <>
            <span aria-hidden="true" className={cn("ticket-notch notch-l -left-[13px] top-[calc(50%-11px)]", notchClassName)} />
            <span aria-hidden="true" className={cn("ticket-notch notch-r -right-[13px] top-[calc(50%-11px)]", notchClassName)} />
          </>
        ) : (
          <>
            <span aria-hidden="true" className={cn("ticket-notch notch-l -left-[13px] top-[calc(50%-11px)]", notchClassName)} />
            <span aria-hidden="true" className={cn("ticket-notch notch-r -right-[13px] top-[calc(50%-11px)]", notchClassName)} />
          </>
        ))}

      {stamp && <div className="pointer-events-none absolute right-4 top-4 z-[3]">{stamp}</div>}
    </Tag>
  );
}

export interface FlipCardProps {
  flipped: boolean;
  front: ReactNode;
  back: ReactNode;
  className?: string;
}

/** CSS-3D rotateY confirmation flip (600ms). Back face is aria-hidden until flipped. */
export function FlipCard({ flipped, front, back, className }: FlipCardProps) {
  return (
    <div className={cn("flip-scene", className)}>
      <div className={cn("flip-card", flipped && "is-flipped")}>
        <div className="flip-face" aria-hidden={flipped}>
          {front}
        </div>
        <div className="flip-face flip-face-back" aria-hidden={!flipped}>
          {back}
        </div>
      </div>
    </div>
  );
}
