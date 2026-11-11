import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";

interface InputGroupProps {
  id: string;
  type: "text" | "email" | "password";
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
  actionLink?: {
    text: string;
    href: string;
  };
}

export const InputGroup: React.FC<InputGroupProps> = ({
  id,
  type,
  label,
  value,
  onChange,
  placeholder,
  required,
  autoComplete,
  actionLink,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const resolvedType = isPassword ? (showPassword ? "text" : "password") : type;

  const FieldIcon =
    type === "email" ? Mail : type === "password" ? Lock : User;

  return (
    <div className="relative group">
      <div className="flex justify-between items-center mb-1.5">
        <label
          htmlFor={id}
          className="font-mono text-[11px] font-bold uppercase tracking-wider text-ink block"
        >
          {label}
          {required && <span className="text-flash ml-1">*</span>}
        </label>
        {actionLink &&
          (actionLink.href.startsWith("/") ? (
            <Link
              to={actionLink.href}
              className="font-mono text-[11px] font-bold uppercase tracking-wider text-ink-muted hover:text-flash transition-colors"
            >
              {actionLink.text}
            </Link>
          ) : (
            <a
              href={actionLink.href}
              className="font-mono text-[11px] font-bold uppercase tracking-wider text-ink-muted hover:text-flash transition-colors"
            >
              {actionLink.text}
            </a>
          ))}
      </div>

      <div className="relative flex items-center">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted group-focus-within:text-ink transition-colors"
        >
          <FieldIcon size={16} />
        </span>

        <input
          id={id}
          type={resolvedType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          autoComplete={
            autoComplete ??
            (type === "email"
              ? "email"
              : isPassword
                ? "current-password"
                : "username")
          }
          className={`w-full h-12 border-2 border-ink bg-bone pl-10 ${
            isPassword ? "pr-12" : "pr-3.5"
          } font-mono text-xs text-ink placeholder:text-ink-muted/60 focus:bg-paper focus:border-ink focus:shadow-hard-sm outline-none transition-all`}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-0.5 top-1/2 -translate-y-1/2 min-w-[44px] min-h-[44px] flex items-center justify-center text-ink-muted hover:text-ink cursor-pointer"
            aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
    </div>
  );
};
