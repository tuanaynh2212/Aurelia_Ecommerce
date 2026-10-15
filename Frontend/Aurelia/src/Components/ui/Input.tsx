import { forwardRef } from "react";
import { cn } from "../../lib/cn";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", label, error, hint, id, ...props }, ref) => {
    const inputId = id || props.name;

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-heading font-semibold uppercase tracking-wider text-ink"
          >
            {label}
          </label>
        )}
        <input
          id={inputId}
          type={type}
          ref={ref}
          className={cn(
            "w-full h-11 min-h-[44px] px-3.5 bg-bg text-ink placeholder:text-ink-muted text-base sm:text-sm font-body",
            "border border-rule rounded-none transition-colors duration-150",
            "focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink",
            "disabled:opacity-40 disabled:cursor-not-allowed",
            error && "border-accent focus:border-accent focus:ring-accent",
            className
          )}
          {...props}
        />
        {error && <span className="text-xs font-medium text-accent font-body">{error}</span>}
        {!error && hint && <span className="text-xs text-ink-muted font-body">{hint}</span>}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
