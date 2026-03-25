import ContactForm from "@/components/ContactForm";
import { buildPageMetadata } from "@/lib/seo/metaBuilder";

export const metadata = buildPageMetadata({
  title: "Contact | Mathelin Plomberie Chauffage",
  description:
    "Contactez Mathelin Plomberie Chauffage pour un devis ou une intervention. Pérouges, Meximieux, Ambérieu, Lagnieu.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <div className="pb-16">
      <ContactForm />
    </div>
  );
}
