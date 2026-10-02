// src/components/ui/Button.tsx
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  children: ReactNode;
}

const variantStyles: Record<Variant, string> = {
  primary: "bg-black text-white hover:bg-gray-800",
  secondary: "bg-white text-black hover:bg-gray-100",
  ghost: "bg-transparent text-black hover:bg-gray-100 border-transparent",
  danger: "bg-red-600 text-white hover:bg-red-700 border-red-600",
};

export function Button({
  variant = "secondary",
  className = "",
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      className={`mono-border px-4 py-2 text-xs uppercase font-bold transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-black focus-visible:outline-offset-2 ${variantStyles[variant]} ${className}`}
    >
      {children}
    </button>
  );
}