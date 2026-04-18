import type { Metadata } from "next";
import nextDynamic from "next/dynamic";
import { Poppins, Inter } from "next/font/google";
import "./globals.css";
import LocalBusinessSchema from "@/components/SEO/LocalBusinessSchema";
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
  display: "optional",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "optional",
});

/**
 * ISR layout : HTML mis en cache (TTFB meilleur). Données site-data / site.json rafraîchies à l’intervalle ci-dessous.
 * Après sauvegarde admin, `revalidatePath` est appelé sur l’API site-settings.
 */
export const revalidate = 3600;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Mathelin Plomberie Chauffage | Plombier Pérouges, Meximieux, Ambérieu",
  description:
    "Plombier chauffagiste à Pérouges, Meximieux, Ambérieu-en-Bugey et Lagnieu. Dépannage plomberie, chauffe-eau, radiateurs, débouchage. Devis gratuit.",
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
    title: "Mathelin Plomberie Chauffage | Plombier Pérouges, Meximieux, Ambérieu",
    description:
      "Plombier chauffagiste à Pérouges, Meximieux, Ambérieu-en-Bugey et Lagnieu. Devis gratuit.",
    type: "website",
  },
  robots: "index, follow",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = getSiteSettings();
  return (
    <html lang="fr" className={`${poppins.variable} ${inter.variable}`}>
      <head>
        <LocalBusinessSchema settings={settings} />
      </head>
      <body className="min-h-screen bg-white text-gray-900 antialiased">
        <SettingsProvider initialSettings={settings}>
          <ChunkLoadErrorHandler />
          <Header />
          <main className="pb-20 md:pb-0">{children}</main>
          <Footer />
          <MobileCallButton />
        </SettingsProvider>
      </body>
    </html>
  );
}
