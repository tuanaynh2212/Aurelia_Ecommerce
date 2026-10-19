import React from "react";

export const InputField = ({
  icon: Icon,
  label,
  name,
  type = "text",
  value,
  onChange,
}: any) => (
  <div className="space-y-1.5">
    <label className="block text-[11px] font-mono uppercase tracking-wider text-ink-muted">
      {label}
    </label>
    <div className="relative">
      {Icon && (
        <Icon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted" />
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className={`
          w-full
          ${Icon ? "pl-10" : "pl-3.5"} pr-4 py-2.5
          border border-rule/80
          rounded-tag
          bg-paper
          text-ink
          font-mono text-sm
          focus:outline-none
          focus:border-cobalt
          focus:ring-1 focus:ring-cobalt
          transition-all
        `}
      />
    </div>
  </div>
);

