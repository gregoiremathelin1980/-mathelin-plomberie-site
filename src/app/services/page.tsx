import Link from "next/link";
import { Wrench } from "lucide-react";
import ServiceCard from "@/components/ServiceCard";
import { SERVICES } from "@/lib/services-data";
import { buildPageMetadata } from "@/lib/seo/metaBuilder";

export const metadata = buildPageMetadata({
  title: "Services | Mathelin Plomberie Chauffage",
  description:
    "Débouchage canalisation, réparation fuite, robinetterie, chauffe-eau, radiateurs, plancher chauffant, chaudière, WC. Plombier à Pérouges, Meximieux, Ambérieu.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <div className="px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 flex items-center gap-3">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Wrench className="h-7 w-7" />
          </span>
          <div>
            <h1 className="font-heading text-3xl font-bold text-primary">
              Nos services
            </h1>
            <p className="mt-1 text-gray-text">
              Plomberie et chauffage : dépannage, installation et entretien dans l’Ain.
            </p>
          </div>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s) => (
            <ServiceCard
              key={s.slug}
              slug={s.slug}
              title={s.title}
              description={s.description}
              iconKey={s.icon}
            />
          ))}
        </div>
        <p className="mt-10 text-center text-gray-text">
          <Link href="/contact" className="font-medium text-primary hover:underline">
            Demander un devis →
          </Link>
        </p>
      </div>
    </div>
  );
}
