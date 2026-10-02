// src/components/layout/DashboardErrorBoundary.tsx
"use client";

import { Component, type ReactNode, type ErrorInfo } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class DashboardErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[DashboardErrorBoundary]", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-8 text-center">
          <div className="mono-border p-6 bg-red-50 max-w-md">
            <h2 className="text-sm font-bold uppercase mb-2 text-red-600">
              Application Error
            </h2>
            <p className="text-xs mb-4">
              Something went wrong. Please refresh the page or contact support.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mono-border px-4 py-2 text-xs uppercase font-bold bg-black text-white hover:bg-gray-800"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}