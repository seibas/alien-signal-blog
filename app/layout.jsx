import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import BackToTop from "@/components/BackToTop";
import ErrorBoundary from "@/components/ErrorBoundary";
import ReadingModeToggle from "@/components/ReadingModeToggle";
import ScrollToTop from "@/components/ScrollToTop";
import ReadingProgress from "@/components/ReadingProgress";
import SkipLink from "@/components/SkipLink";
import WebVitals from "@/components/WebVitals";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { LanguageProvider } from "../hooks/useTranslation";

export const metadata = {
  title: {
    default: "Alien Signal Blog — Cosmic Coding Journey",
    template: "%s | Alien Signal Blog"
  },
  description: "A futuristic coding journal exploring JavaScript, React, Next.js, and web development. Broadcasting signals from the frontier of programming.",
  keywords: ["coding blog", "web development", "JavaScript", "React", "Next.js", "programming", "frontend", "learning to code"],
  authors: [{ name: "Alien Signal" }],
  creator: "Alien Signal",
  publisher: "Alien Signal",
  metadataBase: new URL('https://alien-signal-blog.vercel.app'),
  openGraph: {
    title: "Alien Signal Blog — Cosmic Coding Journey",
    description: "A futuristic coding journal exploring JavaScript, React, Next.js, and web development.",
    type: "website",
    locale: "en_US",
    siteName: "Alien Signal Blog",
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Alien Signal Blog - Broadcasting my coding journey',
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Alien Signal Blog — Cosmic Coding Journey",
    description: "Broadcasting signals from the frontier of programming",
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  // viewport moved to viewport export below
  // themeColor moved to viewport export below
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },

};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#020304' },
    { media: '(prefers-color-scheme: light)', color: '#020304' }
  ]
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Audiowide&family=Share+Tech+Mono&family=Space+Mono:wght@400;700&family=Rajdhani:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ErrorBoundary>
          <LanguageProvider>
            <WebVitals />
            <GoogleAnalytics />
            <SkipLink />
            <ScrollToTop />
            <ReadingProgress />
            <div className="site">
              <SiteHeader />
              <main id="main-content" className="main" tabIndex={-1}>{children}</main>
              <SiteFooter />
              <BackToTop />
              <ReadingModeToggle />
            </div>
          </LanguageProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
