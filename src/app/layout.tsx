import type { Metadata } from "next";
import nextDynamic from "next/dynamic";
import { Poppins, Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { getSiteSettings } from "@/lib/content";
import { SITE_URL } from "@/lib/config";

// Import dynamique pour réduire la taille du chunk layout et éviter ChunkLoadError (timeout)
const Header = nextDynamic(() => import("@/components/Header"), { ssr: true });
const Footer = nextDynamic(() => import("@/components/Footer"), { ssr: true });
const MobileCallButton = nextDynamic(() => import("@/components/MobileCallButton"), { ssr: true });
const ChunkLoadErrorHandler = nextDynamic(() => import("@/components/ChunkLoadErrorHandler"), { ssr: false });

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

/**
 * ISR layout : HTML mis en cache (TTFB meilleur). Données site-data / site.json rafraîchies à l’intervalle ci-dessous.
 * Après sauvegarde admin, `revalidatePath` est appelé sur l’API site-settings.
 */
export const revalidate = 3600;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Mathelin Plomberie Chauffage | Plombier à Pérouges",
  description:
    "Artisan plombier chauffagiste à Pérouges : dépannage, chauffe-eau, chauffage et rénovation dans l'Ain. Intervention rapide, devis gratuit au 06 61 42 24 07.",
  keywords: [
    "plombier Pérouges",
    "plombier Meximieux",
    "plombier Ambérieu-en-Bugey",
    "plombier Saint-Vulbas",
    "plombier Lagnieu",
    "chauffagiste Pérouges",
    "dépannage plomberie",
  ],
  openGraph: {
    title: "Mathelin Plomberie Chauffage | Plombier à Pérouges",
    description:
      "Artisan plombier chauffagiste à Pérouges : dépannage, chauffe-eau, chauffage et rénovation dans l'Ain. Intervention rapide, devis gratuit au 06 61 42 24 07.",
    type: "website",
    siteName: "Mathelin Plomberie Chauffage",
    url: "https://www.mathelin-plomberie.fr/",
    images: [{ url: "/images/og-mathelin.jpg", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", images: ["/images/og-mathelin.jpg"] },
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = getSiteSettings();
  return (
    <html lang="fr" className={`${poppins.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-white text-gray-900 antialiased">
        <SettingsProvider initialSettings={settings}>
          <ChunkLoadErrorHandler />
          <Header />
          <main className="pb-20 md:pb-0">{children}</main>
          <Footer />
          <MobileCallButton />
          <Analytics />
        </SettingsProvider>
      </body>
    </html>
  );
}
