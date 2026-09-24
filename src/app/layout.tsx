import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ✅ Add metadataBase
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ),
  title: {
    default: "RequestHub - Task Admin Dashboard",
    template: "%s | RequestHub",
  },
  description:
    "Manage requests, track progress, and collaborate with your team efficiently",
  keywords: ["task management", "request tracker", "admin dashboard"],
  authors: [{ name: "RequestHub Team" }],
  
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "180x180" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: "/favicon.ico",
  },
  
  manifest: "/manifest.json",
  
  openGraph: {
    type: "website",
    locale: "id_ID",
    title: "RequestHub - Task Admin Dashboard",
    description: "Manage requests efficiently",
    siteName: "RequestHub",
  },
  
  twitter: {
    card: "summary_large_image",
    title: "RequestHub - Task Admin Dashboard",
    description: "Manage requests efficiently",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0d9488" },
    { media: "(prefers-color-scheme: dark)", color: "#0f766e" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // ✅ Add data-scroll-behavior untuk fix warning
    <html lang="id" data-scroll-behavior="smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}