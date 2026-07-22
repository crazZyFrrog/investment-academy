import type { Metadata, Viewport } from "next";
import { Fraunces, Source_Sans_3 } from "next/font/google";
import { AuthProvider } from "./auth-provider";
import { QueryProvider } from "./providers";
import { OfflineBanner } from "@/features/pwa/OfflineBanner";
import "@/styles/globals.css";

const display = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
});

const body = Source_Sans_3({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Investment Academy",
    template: "%s · Investment Academy",
  },
  description:
    "Production-ready investment education. Learn markets, risk, and portfolio thinking.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Investment Academy",
  },
};

export const viewport: Viewport = {
  themeColor: "#0f5c4c",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} h-full`}>
      <body className="min-h-full antialiased">
        <AuthProvider>
          <QueryProvider>
            <OfflineBanner />
            {children}
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
