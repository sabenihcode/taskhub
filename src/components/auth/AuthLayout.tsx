import { ReactNode } from "react";
import { BackgroundIllustration } from "./BackgroundIllustration";

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <>
      <BackgroundIllustration />
      <div className="relative min-h-screen flex items-center justify-center lg:justify-end px-4 py-8 lg:py-12 lg:pr-8 xl:pr-16">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </>
  );
}
