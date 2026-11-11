import type { ReactNode } from "react";
import { Check } from "lucide-react";
import { cn } from "../../../utils/cn";

export interface StepNode {
  id: string;
  label: ReactNode;
  sublabel?: ReactNode;
}

export interface StepperProps {
  steps: StepNode[];
  activeIndex: number;
  className?: string;
}

/**
 * 4-node ticket-stub checkout / booking stepper.
 */
export function Stepper({ steps, activeIndex, className }: StepperProps) {
  return (
    <ol
      aria-label="Tiến trình"
      className={cn(
        "grid grid-cols-2 gap-2 md:grid-cols-4",
        className
      )}
    >
      {steps.map((step, idx) => {
        const done = idx < activeIndex;
        const current = idx === activeIndex;
        return (
          <li
            key={step.id}
            aria-current={current ? "step" : undefined}
            className={cn(
              "relative flex items-center gap-3 border-2 border-ink px-3.5 py-2.5 rounded-[2px]",
              current && "bg-volt text-ink shadow-hard-sm font-bold",
              done && "bg-ink text-paper",
              !current && !done && "bg-paper text-ink-muted"
            )}
          >
            <span
              className={cn(
                "flex h-7 w-7 shrink-0 items-center justify-center border-2 border-current font-mono text-xs font-extrabold tabular",
                current && "bg-paper text-ink border-ink",
                done && "bg-volt text-ink border-ink"
              )}
            >
              {done ? <Check size={14} strokeWidth={3} aria-hidden="true" /> : String(idx + 1).padStart(2, "0")}
            </span>
            <div className="min-w-0">
              <p className="mono-label truncate text-xs font-extrabold">{step.label}</p>
              {step.sublabel && (
                <p className="truncate text-[11px] opacity-80">{step.sublabel}</p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
