import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const metadata = {
  title: "Alien Signal Blog",
  description: "A futuristic green + orange coding journal.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="site">
          <SiteHeader />
          <main className="main">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
