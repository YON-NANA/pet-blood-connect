import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AnimalBloodConnect | Animal Mutual Aid Japan (AMAJ)",
  description: "全国の動物病院と飼い主を繋ぐ、命を救うための献血マッチングプラットフォーム。日本動物共助機構 (AMAJ) が提供する非営利プロジェクトです。",
  manifest: "/manifest.json",
  icons: {
    icon: "/assets/abc.icon.png",
    apple: "/assets/abc.icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ABC",
  },
};

export const viewport: Viewport = {
  themeColor: "#003366",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* beforeinstallprompt をページ描画より早く捕捉する */}
        <Script
          id="pwa-install-capture"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.__pwaPrompt = null;
              window.addEventListener('beforeinstallprompt', function(e) {
                e.preventDefault();
                window.__pwaPrompt = e;
                window.dispatchEvent(new Event('pwa-prompt-ready'));
              });
            `,
          }}
        />
        {children}
      </body>
    </html>
  );
}
