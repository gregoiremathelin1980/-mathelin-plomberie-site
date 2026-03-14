import { BarChart3 } from "lucide-react";
import type { LocalActivityEntry } from "@/lib/site-data";

interface LocalActivityBlockProps {
  activities: LocalActivityEntry[];
}

/** Bloc « X interventions réalisées à [ville] ces derniers mois » — preuve d’activité locale. */
export default function LocalActivityBlock({ activities }: LocalActivityBlockProps) {
  if (!activities?.length) return null;

  return (
    <section className="mb-14 rounded-2xl border border-primary/20 bg-primary/5 p-6">
      <h2 className="font-heading text-xl font-semibold text-primary flex items-center gap-2">
        <BarChart3 className="h-5 w-5" />
        Activité locale
      </h2>
      <ul className="mt-4 space-y-2 text-gray-700">
        {activities.map((entry, i) => (
          <li key={i}>
            <span className="font-medium text-primary">{entry.count} intervention{entry.count > 1 ? "s" : ""} réalisée{entry.count > 1 ? "s" : ""} à {entry.city}</span>
            <span className="text-gray-600"> {entry.period ?? "ces derniers mois"}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
