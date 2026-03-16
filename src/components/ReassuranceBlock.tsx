import { GraduationCap, Calendar, MapPin } from "lucide-react";

const ITEMS = [
  {
    icon: GraduationCap,
    label: "Maître Artisan (en cours) & BP Génie Climatique",
  },
  {
    icon: Calendar,
    label: "13 ans à votre service (depuis 2013)",
  },
  {
    icon: MapPin,
    label: "Artisan local basé à Pérouges (01)",
  },
] as const;

export default function ReassuranceBlock() {
  return (
    <section className="border-b border-primary/10 bg-primary/5 px-4 py-8 sm:px-6" aria-label="Réassurance">
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-6 sm:grid-cols-3">
          {ITEMS.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-3 text-center"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="h-6 w-6" aria-hidden />
              </span>
              <p className="text-sm font-medium text-gray-800 sm:text-base">
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
