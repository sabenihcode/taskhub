// src/components/ui/Field.tsx
"use client";

import {
  createContext,
  useContext,
  useId,
  type ReactNode,
  type InputHTMLAttributes,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";

const FieldContext = createContext<{ id: string; invalid: boolean } | null>(
  null,
);

// ==========================================
// FIELD WRAPPER
// ==========================================
interface FieldProps {
  label: string;
  children: ReactNode;
  error?: string | null;
}

export function Field({ label, children, error }: FieldProps) {
  const id = useId();
  const invalid = !!error;

  return (
    <div>
      <label
        htmlFor={id}
        className="block text-[10px] font-bold uppercase mb-1"
      >
        {label}
      </label>
      <FieldContext.Provider value={{ id, invalid }}>
        {children}
      </FieldContext.Provider>
      {error && (
        <p
          className="text-[10px] text-red-600 font-bold uppercase mt-1"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}

// ==========================================
// INPUT (UPPERCASE)
// ==========================================
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export function Input({ className = "", ...rest }: InputProps) {
  const field = useContext(FieldContext);

  return (
    <input
      {...rest}
      id={field?.id ?? rest.id}
      aria-invalid={
        field?.invalid ? true : rest["aria-invalid"]
      }
      className={`w-full p-2 text-xs uppercase mono-border bg-white text-black outline-none focus:outline-2 focus:outline-black ${className}`}
    />
  );
}

// ==========================================
// SELECT (UPPERCASE)
// ==========================================
interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {}

export function Select({ className = "", children, ...rest }: SelectProps) {
  const field = useContext(FieldContext);

  return (
    <select
      {...rest}
      id={field?.id ?? rest.id}
      aria-invalid={
        field?.invalid ? true : rest["aria-invalid"]
      }
      className={`w-full p-2 text-xs uppercase mono-border bg-white text-black outline-none focus:outline-2 focus:outline-black ${className}`}
    >
      {children}
    </select>
  );
}

// ==========================================
// TEXTAREA (UPPERCASE)
// ==========================================
interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {}

export function Textarea({ className = "", ...rest }: TextareaProps) {
  const field = useContext(FieldContext);

  return (
    <textarea
      {...rest}
      id={field?.id ?? rest.id}
      aria-invalid={
        field?.invalid ? true : rest["aria-invalid"]
      }
      className={`w-full p-2 text-xs uppercase mono-border bg-white text-black outline-none focus:outline-2 focus:outline-black ${className}`}
    />
  );
}