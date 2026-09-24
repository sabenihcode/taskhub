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

// ✅ METADATA - Tanpa msapplicationTileColor & tanpa duplicate icons
export const metadata: Metadata = {
  title: {
    default: "TaskHub - Task Admin Dashboard",
    template: "%s | TaskHub",
  },
  description:
    "Manage requests, track progress, and collaborate with your team efficiently",
  keywords: ["task management", "request tracker", "admin dashboard", "permit management"],
  authors: [{ name: "Sabndev" }],
  creator: "Sabndev",
  publisher: "Sabndev",

  // ✅ Favicon (satu kali saja)
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "180x180" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: "/favicon.ico",
  },

  // ✅ Manifest PWA
  manifest: "/manifest.json",

  // ✅ Open Graph
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://yourdomain.com",
    title: "TaskHub - Task Admin Dashboard",
    description:
      "Manage requests, track progress, and collaborate with your team",
    siteName: "TaskHub",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "TaskHub Dashboard",
      },
    ],
  },

  // ✅ Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "TaskHub - Task Admin Dashboard",
    description: "Manage requests efficiently",
    images: ["/og-image.png"],
    creator: "@yourusername",
  },

  // ✅ Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

// ✅ VIEWPORT - Theme color ditaruh di sini (Next.js 14+)
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
    <html lang="id">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}