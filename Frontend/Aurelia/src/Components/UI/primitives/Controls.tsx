import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from "react";
import { Check, Minus, Plus } from "lucide-react";
import { cn } from "../../../utils/cn";

type NativeToggleProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size">;

export interface CheckboxProps extends NativeToggleProps {
  label?: ReactNode;
  description?: ReactNode;
}

/** Square 2px ink checkbox, volt fill on check, 44×44 expanded hit area. */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, description, className, id, ...rest },
  ref
) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  return (
    <label
      htmlFor={fieldId}
      className={cn("group inline-flex min-h-[44px] cursor-pointer items-center gap-3 select-none", className)}
    >
      <span className="hit-area-expand relative inline-flex h-6 w-6 shrink-0 items-center justify-center">
        <input ref={ref} id={fieldId} type="checkbox" className="peer sr-only" {...rest} />
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-[2px] border-2 border-ink bg-paper transition-colors peer-checked:bg-volt peer-focus-visible:shadow-[var(--focus-ring)] peer-disabled:bg-fog"
        />
        <Check
          size={16}
          strokeWidth={3.5}
          aria-hidden="true"
          className="relative text-ink opacity-0 peer-checked:opacity-100"
        />
      </span>
      {(label || description) && (
        <span className="flex flex-col">
          {label && <span className="text-sm font-semibold text-ink">{label}</span>}
          {description && <span className="text-xs text-ink-muted">{description}</span>}
        </span>
      )}
    </label>
  );
});

export interface RadioProps extends NativeToggleProps {
  label?: ReactNode;
  description?: ReactNode;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  { label, description, className, id, ...rest },
  ref
) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  return (
    <label
      htmlFor={fieldId}
      className={cn("inline-flex min-h-[44px] cursor-pointer items-center gap-3 select-none", className)}
    >
      <span className="hit-area-expand relative inline-flex h-6 w-6 shrink-0 items-center justify-center">
        <input ref={ref} id={fieldId} type="radio" className="peer sr-only" {...rest} />
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-full border-2 border-ink bg-paper peer-focus-visible:shadow-[var(--focus-ring)]"
        />
        <span
          aria-hidden="true"
          className="relative h-3 w-3 rounded-full bg-ink opacity-0 peer-checked:opacity-100"
        />
      </span>
      {(label || description) && (
        <span className="flex flex-col">
          {label && <span className="text-sm font-semibold text-ink">{label}</span>}
          {description && <span className="text-xs text-ink-muted">{description}</span>}
        </span>
      )}
    </label>
  );
});

export interface SwitchProps {
  checked: boolean;
  onChange: (next: boolean) => void;
  label?: ReactNode;
  disabled?: boolean;
  id?: string;
  className?: string;
}

/** Mechanical toggle: ink track, volt knob when on. */
export function Switch({ checked, onChange, label, disabled, id, className }: SwitchProps) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  return (
    <div className={cn("inline-flex min-h-[44px] items-center gap-3", className)}>
      <button
        id={fieldId}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          "hit-area-expand relative h-7 w-12 shrink-0 cursor-pointer rounded-[2px] border-2 border-ink transition-colors disabled:cursor-not-allowed disabled:opacity-50",
          checked ? "bg-ink" : "bg-fog"
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            "absolute top-0.5 h-[18px] w-[18px] rounded-[2px] border-2 border-ink transition-transform duration-150",
            checked ? "translate-x-[22px] bg-volt" : "translate-x-0.5 bg-paper"
          )}
        />
      </button>
      {label && (
        <label htmlFor={fieldId} className="cursor-pointer text-sm font-semibold text-ink">
          {label}
        </label>
      )}
    </div>
  );
}

export interface QuantityStepperProps {
  value: number;
  onDecrement: () => void;
  onIncrement: () => void;
  min?: number;
  max?: number;
  disabled?: boolean;
  label?: string;
  className?: string;
}

/** 44×44 −/+ buttons around a tabular value. Handlers are supplied by the owner. */
export function QuantityStepper({
  value,
  onDecrement,
  onIncrement,
  min = 1,
  max,
  disabled,
  label = "Số lượng",
  className,
}: QuantityStepperProps) {
  const atMin = value <= min;
  const atMax = max !== undefined && value >= max;
  return (
    <div
      role="group"
      aria-label={label}
      className={cn("inline-flex items-stretch border-2 border-ink bg-paper rounded-[2px]", className)}
    >
      <button
        type="button"
        onClick={onDecrement}
        disabled={disabled || atMin}
        aria-label="Giảm số lượng"
        className="press-collapse flex h-11 w-11 items-center justify-center border-r-2 border-ink text-ink hover:bg-volt disabled:cursor-not-allowed disabled:bg-fog disabled:text-ink-muted"
      >
        <Minus size={16} strokeWidth={3} aria-hidden="true" />
      </button>
      <output
        aria-live="polite"
        className="flex min-w-12 items-center justify-center px-2 font-mono text-base font-bold tabular"
      >
        {value}
      </output>
      <button
        type="button"
        onClick={onIncrement}
        disabled={disabled || atMax}
        aria-label="Tăng số lượng"
        className="press-collapse flex h-11 w-11 items-center justify-center border-l-2 border-ink text-ink hover:bg-volt disabled:cursor-not-allowed disabled:bg-fog disabled:text-ink-muted"
      >
        <Plus size={16} strokeWidth={3} aria-hidden="true" />
      </button>
    </div>
  );
}

