"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

const Sheet: React.FC<SheetProps> = ({ open, onOpenChange, children }) => {
  // Handle ESC key
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        onOpenChange(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open, onOpenChange]);

  // Lock body scroll when open
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-[60] bg-slate-900/60 backdrop-blur-sm animate-fade-in"
          onClick={() => onOpenChange(false)}
        />
      )}
      <SheetContent open={open}>{children}</SheetContent>
    </>
  );
};

interface SheetContentProps {
  open: boolean;
  children: React.ReactNode;
  className?: string;
}

const SheetContent: React.FC<SheetContentProps> = ({ open, children, className }) => {
  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 z-[70] w-72 max-w-[85vw] bg-white shadow-2xl",
        "transition-transform duration-300 ease-out flex flex-col",
        open ? "translate-x-0" : "-translate-x-full",
        className
      )}
      role="dialog"
      aria-modal="true"
    >
      {children}
    </div>
  );
};

interface SheetTriggerProps {
  asChild?: boolean;
  children: React.ReactNode;
}

const SheetTrigger: React.FC<SheetTriggerProps> = ({ asChild, children }) => {
  // Simple clone element to add onClick
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children);
  }
  return <>{children}</>;
};

export { Sheet, SheetContent, SheetTrigger };