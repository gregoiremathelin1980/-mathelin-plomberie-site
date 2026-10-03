import LocalBusinessSchema from "@/components/SEO/LocalBusinessSchema";
import { getSiteSettings } from "@/lib/content";

/** Schéma LocalBusiness du site principal : absent des landings satellites (leur propre JSON-LD), sans lecture du Host pour rester statique. */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <LocalBusinessSchema settings={getSiteSettings()} />
      {children}
    </>
  );
}
