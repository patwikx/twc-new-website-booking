import type { Metadata } from "next";
import { Bebas_Neue, Outfit } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { getSiteSettings } from "@/actions/site/get-site-settings";
import { getProperties } from "@/actions/properties/get-properties";

const bebasNeue = Bebas_Neue({
  weight: "400",
  variable: "--font-display",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dolores Hotels & Resorts",
  description: "Experience luxury and comfort across our distinctive properties in the Philippines",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [siteSettings, properties] = await Promise.all([
    getSiteSettings(),
    getProperties(),
  ]);

  const footerProperties = properties.map(p => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
  }));

  return (
    <html lang="en" className={`${bebasNeue.variable} ${outfit.variable}`}>
      <body className="antialiased font-body">
        <Header 
          siteName={siteSettings?.siteName}
          siteTagline={siteSettings?.siteTagline}
        />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer 
          siteName={siteSettings?.siteName}
          siteTagline={siteSettings?.siteTagline}
          properties={footerProperties}
        />
      </body>
    </html>
  );
}
