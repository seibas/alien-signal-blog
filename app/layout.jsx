import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import BackToTop from "@/components/BackToTop";

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
    siteName: "Alien Signal Blog"
  },
  twitter: {
    card: "summary_large_image",
    title: "Alien Signal Blog — Cosmic Coding Journey",
    description: "Broadcasting signals from the frontier of programming",
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
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#020304' },
    { media: '(prefers-color-scheme: light)', color: '#020304' }
  ],
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

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="site">
          <SiteHeader />
          <main className="main">{children}</main>
          <SiteFooter />
          <BackToTop />
        </div>
      </body>
    </html>
  );
}
