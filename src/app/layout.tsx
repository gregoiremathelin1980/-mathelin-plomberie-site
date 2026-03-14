import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Poppins, Inter } from "next/font/google";
import "./globals.css";
import LocalBusinessSchema from "@/components/LocalBusinessSchema";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { getSiteSettings } from "@/lib/content";
import { SITE_URL } from "@/lib/config";

// Import dynamique pour réduire la taille du chunk layout et éviter ChunkLoadError (timeout)
const Header = dynamic(() => import("@/components/Header"), { ssr: true });
const Footer = dynamic(() => import("@/components/Footer"), { ssr: true });
const MobileCallButton = dynamic(() => import("@/components/MobileCallButton"), { ssr: true });
const ChunkLoadErrorHandler = dynamic(() => import("@/components/ChunkLoadErrorHandler"), { ssr: false });

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
  alternates: { canonical: SITE_URL },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = getSiteSettings();
  return (
    <html lang="fr" className={`${poppins.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-white text-gray-900 antialiased">
        <LocalBusinessSchema settings={settings} />
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
