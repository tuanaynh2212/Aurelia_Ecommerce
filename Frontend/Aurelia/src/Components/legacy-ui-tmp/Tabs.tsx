import { useState, useId } from "react";
import { cn } from "../../utils/cn";

export interface TabItem<T extends string = string> {
  value: T;
  label: string;
  icon?: React.ReactNode;
}

interface TabsProps<T extends string = string> {
  items: TabItem<T>[];
  value?: T;
  defaultValue?: T;
  onChange?: (value: T) => void;
  className?: string;
}

export function Tabs<T extends string>({
  items,
  value,
  defaultValue,
  onChange,
  className,
}: TabsProps<T>) {
  const instanceId = useId();
  const [internal, setInternal] = useState<T>(defaultValue ?? items[0]?.value);
  const active = value ?? internal;

  const handleSelect = (v: T) => {
    if (!value) setInternal(v);
    onChange?.(v);
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      handleSelect(items[(index + 1) % items.length].value);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      handleSelect(items[(index - 1 + items.length) % items.length].value);
    }
  };

  return (
    <div
      role="tablist"
      aria-label="Product tabs"
      className={cn(
        "inline-flex items-center gap-1 p-1",
        "bg-[var(--color-cream-100)] rounded-[var(--radius-pill)]",
        className
      )}
    >
      {items.map((item, i) => {
        const isActive = active === item.value;
        return (
          <button
            key={item.value}
            role="tab"
            id={`tab-${instanceId}-${item.value}`}
            aria-selected={isActive}
            tabIndex={isActive ? 0 : -1}
            onClick={() => handleSelect(item.value)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            className={cn(
              "chip transition-all duration-[var(--duration-base)]",
              "focus-visible:outline-2 focus-visible:outline-[var(--color-accent)] focus-visible:outline-offset-2",
              isActive
                ? "bg-[var(--color-surface)] text-[var(--color-ink)] shadow-[var(--shadow-card)]"
                : "text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]"
            )}
          >
            {item.icon && <span aria-hidden="true">{item.icon}</span>}
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
