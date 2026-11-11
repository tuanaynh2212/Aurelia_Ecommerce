import {
  forwardRef,
  useId,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";
import { AlertTriangle, ChevronDown } from "lucide-react";
import { cn } from "../../../utils/cn";
import { inputClass, labelClass, selectClass, textareaClass } from "./recipes";

interface FieldChromeProps {
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  wrapperClassName?: string;
}

function FieldError({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p
      id={id}
      role="alert"
      className="mt-1.5 inline-flex items-center gap-1.5 border-2 border-danger bg-paper px-2 py-1 mono-label text-[11px] font-bold text-danger"
    >
      <AlertTriangle size={13} aria-hidden="true" />
      {children}
    </p>
  );
}

export interface InputProps extends InputHTMLAttributes<HTMLInputElement>, FieldChromeProps {
  leading?: ReactNode;
  trailing?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, hint, error, wrapperClassName, leading, trailing, className, id, ...rest },
  ref
) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  const errId = `${fieldId}-err`;
  const hintId = `${fieldId}-hint`;
  return (
    <div className={cn("w-full", wrapperClassName)}>
      {label && (
        <label htmlFor={fieldId} className={labelClass}>
          {label}
        </label>
      )}
      <div className="relative">
        {leading && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted">
            {leading}
          </span>
        )}
        <input
          ref={ref}
          id={fieldId}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errId : hint ? hintId : undefined}
          className={cn(inputClass, leading && "pl-10", trailing && "pr-12", className)}
          {...rest}
        />
        {trailing && <span className="absolute right-1 top-1/2 -translate-y-1/2">{trailing}</span>}
      </div>
      {hint && !error && (
        <p id={hintId} className="mt-1.5 text-xs text-ink-muted">
          {hint}
        </p>
      )}
      {error && <FieldError id={errId}>{error}</FieldError>}
    </div>
  );
});

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement>, FieldChromeProps {}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, hint, error, wrapperClassName, className, id, ...rest },
  ref
) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  const errId = `${fieldId}-err`;
  return (
    <div className={cn("w-full", wrapperClassName)}>
      {label && (
        <label htmlFor={fieldId} className={labelClass}>
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={fieldId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errId : undefined}
        className={cn(textareaClass, className)}
        {...rest}
      />
      {hint && !error && <p className="mt-1.5 text-xs text-ink-muted">{hint}</p>}
      {error && <FieldError id={errId}>{error}</FieldError>}
    </div>
  );
});

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement>, FieldChromeProps {}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, hint, error, wrapperClassName, className, id, children, ...rest },
  ref
) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  const errId = `${fieldId}-err`;
  return (
    <div className={cn("w-full", wrapperClassName)}>
      {label && (
        <label htmlFor={fieldId} className={labelClass}>
          {label}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          id={fieldId}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errId : undefined}
          className={cn(selectClass, className)}
          {...rest}
        >
          {children}
        </select>
        <ChevronDown
          size={18}
          aria-hidden="true"
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink"
        />
      </div>
      {hint && !error && <p className="mt-1.5 text-xs text-ink-muted">{hint}</p>}
      {error && <FieldError id={errId}>{error}</FieldError>}
    </div>
  );
});

