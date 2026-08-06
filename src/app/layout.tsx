import type { Metadata } from "next";
import { Fraunces, Source_Sans_3 } from "next/font/google";
import { AuthProvider } from "./auth-provider";
import { QueryProvider } from "./providers";
import { ThemeProvider } from "@/design-system/theme";
import { OfflineBanner } from "@/features/pwa/OfflineBanner";
import "@/styles/globals.css";

const display = Fraunces({
  variable: "--font-display",
  subsets: ["latin", "latin-ext"],
});

const body = Source_Sans_3({
  variable: "--font-body",
  subsets: ["latin", "latin-ext", "cyrillic"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Investment Academy",
    template: "%s · Investment Academy",
  },
  description:
    "Спокойное обучение инвестициям: рынки, риск и долгий горизонт — онлайн и офлайн.",
  keywords: [
    "инвестиции",
    "обучение",
    "портфель",
    "акции",
    "облигации",
    "финграмотность",
  ],
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Investment Academy",
  },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: "Investment Academy",
    title: "Investment Academy",
    description:
      "Спокойное обучение инвестициям: рынки, риск и долгий горизонт.",
    images: [{ url: "/images/hero-workspace.jpg", width: 1920, height: 1080 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Investment Academy",
    description:
      "Спокойное обучение инвестициям: рынки, риск и долгий горизонт.",
    images: ["/images/hero-workspace.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export { viewport } from "./viewport";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={`${display.variable} ${body.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="min-h-full antialiased">
        <ThemeProvider>
          <AuthProvider>
            <QueryProvider>
              <OfflineBanner />
              {children}
            </QueryProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
