import React from "react";

interface InputFieldProps {
  icon?: React.ElementType;
  label: string;
  name?: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const InputField: React.FC<InputFieldProps> = ({
  icon: Icon,
  label,
  name,
  type = "text",
  value,
  onChange,
}) => (
  <div className="space-y-1.5">
    <label className="block mono-label text-[var(--color-ink)]">{label}</label>
    <div className="relative">
      {Icon && (
        <Icon
          size={16}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-flash)]"
        />
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full min-h-[48px] ${
          Icon ? "pl-10" : "pl-3.5"
        } pr-4 py-2.5 border-2 border-[var(--color-ink)] bg-[var(--color-paper)] text-[var(--color-ink)] font-mono text-xs focus:outline-none focus:bg-[var(--color-volt)]/15 focus:shadow-[var(--shadow-hard-sm)] transition-all`}
      />
    </div>
  </div>
);
