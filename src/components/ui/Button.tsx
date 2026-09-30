import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  children: ReactNode;
}

const variantStyles: Record<Variant, string> = {
  primary: "bg-black text-white",
  secondary: "bg-white text-black",
  ghost: "bg-transparent text-black border-transparent",
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
      className={`mono-border px-4 py-2 text-xs uppercase font-bold transition-colors hover:bg-black hover:text-white disabled:opacity-50 ${variantStyles[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
