import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes, ReactNode } from "react";

interface FieldProps {
  label: string;
  children: ReactNode;
}

export function Field({ label, children }: FieldProps) {
  return (
    <div>
      <label className="block text-[10px] font-bold uppercase mb-1">
        {label}
      </label>
      {children}
    </div>
  );
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export function Input({ className = "", ...rest }: InputProps) {
  return (
    <input
      {...rest}
      className={`w-full p-2 text-xs uppercase mono-border bg-white text-black outline-none focus:outline-2 focus:outline-black ${className}`}
    />
  );
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {}

export function Select({ className = "", children, ...rest }: SelectProps) {
  return (
    <select
      {...rest}
      className={`w-full p-2 text-xs uppercase mono-border bg-white text-black outline-none focus:outline-2 focus:outline-black ${className}`}
    >
      {children}
    </select>
  );
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {}

export function Textarea({ className = "", ...rest }: TextareaProps) {
  return (
    <textarea
      {...rest}
      className={`w-full p-2 text-xs uppercase mono-border bg-white text-black outline-none focus:outline-2 focus:outline-black ${className}`}
    />
  );
}
