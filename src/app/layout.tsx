import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import AuthProvider from "@/components/features/auth/AuthProvider";

const APP_NAME = "TaskLDB"; // ganti ke "TaskHub" jika memang itu nama yang dipakai
const APP_DESCRIPTION =
  "Single source of truth for all visa & permit tracking operations.";

export const metadata: Metadata = {
  title: {
    default: `${APP_NAME} - Permit & Immigration Tracking System`,
    template: `%s | ${APP_NAME}`, // halaman lain cukup mengisi title pendek
  },
  description: APP_DESCRIPTION,
  applicationName: APP_NAME,
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: APP_NAME,
    description: APP_DESCRIPTION,
    siteName: APP_NAME,
    images: ["/logo.png"],
    type: "website",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-black antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}