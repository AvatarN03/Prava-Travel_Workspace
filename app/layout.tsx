import type { Metadata, Viewport } from "next";
import { Cinzel, Newsreader, Sora } from "next/font/google";

import { PwaProvider } from "@/components/pwa";
import { Toaster } from "@/components/ui/sonner";

import { ThemeProvider } from "@/providers";

import "./globals.css";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const cinzel = Cinzel({
  variable: "--font-brand",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#2D9BF0",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://prava.app"
  ),
  title: {
    default: "Prava — Travel Workspace",
    template: "%s | Prava",
  },
  description:
    "Intelligent trip planning without the chaos. Organize multi-day itineraries, stays, expenses, and travel essentials in a structured workspace.",
  icons: {
    icon: [
      { url: "/logo.png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Prava",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${sora.variable} ${newsreader.variable} ${cinzel.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body
        className="min-h-full flex flex-col bg-background text-foreground"
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <PwaProvider>
            {children}
            <Toaster position="top-right" richColors />
          </PwaProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

