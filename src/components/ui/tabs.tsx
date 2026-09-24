"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface TabsContextValue {
  value: string;
  onValueChange: (value: string) => void;
}

const TabsContext = React.createContext<TabsContextValue | null>(null);

function useTabsContext() {
  const ctx = React.useContext(TabsContext);
  if (!ctx) throw new Error("Tabs components must be used within Tabs");
  return ctx;
}

interface TabsProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

const Tabs: React.FC<TabsProps> = ({ value, onValueChange, children, className }) => {
  return (
    <TabsContext.Provider value={{ value, onValueChange }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
};

interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      role="tablist"
      className={cn(
        // ✅ Responsive: horizontal scroll di mobile, flex di desktop
        "inline-flex h-11 items-center gap-1 rounded-xl bg-slate-100 p-1 text-slate-500",
        "sm:flex sm:w-full",
        // ✅ Scrollable di mobile
        "max-w-full overflow-x-auto scrollbar-hide",
        className
      )}
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      {...props}
    >
      {children}
    </div>
  )
);
TabsList.displayName = "TabsList";

interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
  active?: boolean;
}

const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, active, value, ...props }, ref) => {
    const ctx = useTabsContext();
    const isActive = active ?? ctx.value === value;

    return (
      <button
        ref={ref}
        role="tab"
        type="button"
        onClick={() => ctx.onValueChange(value)}
        aria-selected={isActive}
        className={cn(
          // ✅ Responsive: tidak shrink, padding sesuai device
          "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200",
          "px-3 py-1.5 sm:px-4 sm:py-1.5",
          "flex-shrink-0", // Penting untuk horizontal scroll
          isActive
            ? "bg-white text-slate-900 shadow-sm"
            : "text-slate-600 hover:text-slate-900",
          className
        )}
        {...props}
      />
    );
  }
);
TabsTrigger.displayName = "TabsTrigger";

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  activeValue?: string;
}

const TabsContent: React.FC<TabsContentProps> = ({
  value,
  activeValue,
  children,
  className,
  ...props
}) => {
  const ctx = useTabsContext();
  const currentValue = activeValue ?? ctx.value;

  if (value !== currentValue) return null;

  return (
    <div
      role="tabpanel"
      className={cn("mt-4 animate-in fade-in duration-200", className)}
      {...props}
    >
      {children}
    </div>
  );
};

export { Tabs, TabsList, TabsTrigger, TabsContent };