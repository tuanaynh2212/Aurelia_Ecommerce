import type { ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "../../../utils/cn";

export interface StickerProps {
  children: ReactNode;
  tone?: "volt" | "flash" | "ink" | "paper" | "bone";
  angle?: "none" | "left" | "right";
  onRemove?: () => void;
  removeLabel?: string;
  className?: string;
}

const TONE_MAP: Record<NonNullable<StickerProps["tone"]>, string> = {
  volt: "bg-volt text-ink",
  flash: "bg-flash text-paper",
  ink: "bg-ink text-paper",
  paper: "bg-paper text-ink",
  bone: "bg-bone text-ink",
};

const ANGLE_MAP: Record<NonNullable<StickerProps["angle"]>, string> = {
  none: "rotate-0",
  left: "-rotate-2",
  right: "rotate-2",
};

/**
 * Angled brutalist sticker / removable active-filter tag.
 * When `onRemove` is provided, renders a 44×44px accessible hit target.
 */
export function Sticker({
  children,
  tone = "volt",
  angle = "none",
  onRemove,
  removeLabel = "Xoá bộ lọc",
  className,
}: StickerProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 border-2 border-ink px-2.5 py-1 mono-label text-[11px] font-bold shadow-hard-sm rounded-[2px]",
        TONE_MAP[tone],
        ANGLE_MAP[angle],
        className
      )}
    >
      <span>{children}</span>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={removeLabel}
          className="hit-area-expand ml-0.5 inline-flex h-5 w-5 items-center justify-center rounded-[2px] border border-current hover:bg-ink hover:text-paper cursor-pointer"
        >
          <X size={12} strokeWidth={3} aria-hidden="true" />
        </button>
      )}
    </span>
  );
}
