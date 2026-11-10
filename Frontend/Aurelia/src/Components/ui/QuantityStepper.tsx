import { Minus, Plus } from "lucide-react";
import { cn } from "../../utils/cn";

interface QuantityStepperProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (newValue: number) => void;
  className?: string;
  disabled?: boolean;
}

export function QuantityStepper({
  value,
  min = 1,
  max = 99,
  onChange,
  className,
  disabled = false,
}: QuantityStepperProps) {
  return (
    <div
      role="group"
      aria-label="Quantity"
      className={cn(
        "inline-flex items-center rounded-[var(--radius-md)]",
        "border border-[var(--color-cream-200)] bg-[var(--color-surface)]",
        "overflow-hidden",
        className
      )}
    >
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={() => onChange(Math.max(value - 1, min))}
        disabled={disabled || value <= min}
        className={cn(
          "w-11 h-11 flex items-center justify-center",
          "text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]",
          "hover:bg-[var(--color-cream-100)] transition-colors",
          "disabled:opacity-30 disabled:cursor-not-allowed"
        )}
      >
        <Minus size={16} aria-hidden="true" />
      </button>

      <span
        aria-live="polite"
        aria-atomic="true"
        className="min-w-[2.5rem] text-center font-medium text-[var(--color-ink)] text-sm select-none"
      >
        {value}
      </span>

      <button
        type="button"
        aria-label="Increase quantity"
        onClick={() => onChange(Math.min(value + 1, max))}
        disabled={disabled || value >= max}
        className={cn(
          "w-11 h-11 flex items-center justify-center",
          "text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]",
          "hover:bg-[var(--color-cream-100)] transition-colors",
          "disabled:opacity-30 disabled:cursor-not-allowed"
        )}
      >
        <Plus size={16} aria-hidden="true" />
      </button>
    </div>
  );
}
