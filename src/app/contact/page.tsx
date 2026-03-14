import ContactForm from "@/components/ContactForm";

export const metadata = {
  title: "Contact | Mathelin Plomberie Chauffage",
  description:
    "Contactez Mathelin Plomberie Chauffage pour un devis ou une intervention. Pérouges, Meximieux, Ambérieu, Lagnieu.",
};

export default function ContactPage() {
  return (
    <div className="pb-16">
      <ContactForm />
    </div>
  );
}
