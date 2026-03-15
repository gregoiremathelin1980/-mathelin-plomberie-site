"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Save, Loader2, FileEdit, Send, Share2, Settings, Layout } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { SiteSettings } from "@/lib/content";
import type { SiteDataSettings, DisplaySettings } from "@/lib/site-data-types";
import { getDefaultDisplaySettings } from "@/lib/display-settings";

interface DraftItem {
  slug: string;
  title: string;
  city?: string;
  date?: string;
  service?: string;
}

interface DraftsData {
  realisations: DraftItem[];
  blog: DraftItem[];
  conseils: DraftItem[];
}

const defaultDisplay = getDefaultDisplaySettings();

export default function AdminPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [siteDataSettings, setSiteDataSettings] = useState<SiteDataSettings & { displaySettings: DisplaySettings } | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<"saved" | "error" | null>(null);
  const [drafts, setDrafts] = useState<DraftsData | null>(null);
  const [publishing, setPublishing] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/settings").then((res) => res.json()),
      fetch("/api/admin/site-settings", { credentials: "include" }).then((res) => (res.ok ? res.json() : {})),
    ])
      .then(([settingsData, siteData]: [SiteSettings | null, Record<string, unknown>]) => {
        setSettings(settingsData);
        const fromSite = siteData?.displaySettings && typeof siteData.displaySettings === "object" ? (siteData.displaySettings as Partial<DisplaySettings>) : {};
        const fromMerged = (settingsData?.displaySettings && typeof settingsData.displaySettings === "object" ? settingsData.displaySettings : {}) as Partial<DisplaySettings>;
        const ds: Partial<DisplaySettings> = { ...fromMerged, ...fromSite };
        setSiteDataSettings({
          ...siteData,
          showChantierPhotos: typeof siteData?.showChantierPhotos === "boolean" ? siteData.showChantierPhotos : true,
          displaySettings: {
            showReviews: typeof ds.showReviews === "boolean" ? ds.showReviews : defaultDisplay.showReviews,
            showAdvice: typeof ds.showAdvice === "boolean" ? ds.showAdvice : defaultDisplay.showAdvice,
            showAdviceImages: typeof ds.showAdviceImages === "boolean" ? ds.showAdviceImages : defaultDisplay.showAdviceImages,
            showEstimator: typeof ds.showEstimator === "boolean" ? ds.showEstimator : defaultDisplay.showEstimator,
            showRecentInterventions: typeof ds.showRecentInterventions === "boolean" ? ds.showRecentInterventions : defaultDisplay.showRecentInterventions,
          },
        });
      })
      .catch(() => setSettings(null))
      .finally(() => setLoading(false));
  }, []);

  /** Réglages d'affichage : site-settings en priorité, sinon depuis settings fusionnés (pour afficher la section même si site-settings a échoué). */
  const displayState = siteDataSettings ?? (settings && {
    displaySettings: {
      showReviews: settings.displaySettings?.showReviews ?? defaultDisplay.showReviews,
      showAdvice: settings.displaySettings?.showAdvice ?? defaultDisplay.showAdvice,
      showAdviceImages: settings.displaySettings?.showAdviceImages ?? defaultDisplay.showAdviceImages,
      showEstimator: settings.displaySettings?.showEstimator ?? defaultDisplay.showEstimator,
      showRecentInterventions: settings.displaySettings?.showRecentInterventions ?? defaultDisplay.showRecentInterventions,
    },
    showChantierPhotos: settings.show_chantier_photos !== false,
  });

  useEffect(() => {
    fetch("/api/admin/drafts")
      .then((res) => res.json())
      .then((data) => setDrafts(data))
      .catch(() => setDrafts({ realisations: [], blog: [], conseils: [] }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    setMessage(null);
    try {
      const resSettings = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      let ok = resSettings.ok;
      const toSend = siteDataSettings ?? (displayState ? { displaySettings: displayState.displaySettings, showChantierPhotos: displayState.showChantierPhotos } : null);
      if (toSend) {
        const resSiteData = await fetch("/api/admin/site-settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(toSend),
        });
        ok = ok && resSiteData.ok;
      }
      setMessage(ok ? "saved" : "error");
    } catch {
      setMessage("error");
    }
    setSaving(false);
  };

  const handlePublish = async (type: "realisation" | "blog" | "conseil", slug: string) => {
    const key = `${type}:${slug}`;
    setPublishing(key);
    try {
      const res = await fetch("/api/admin/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, slug }),
      });
      if (res.ok && drafts) {
        setDrafts({
          realisations: type === "realisation" ? drafts.realisations.filter((r) => r.slug !== slug) : drafts.realisations,
          blog: type === "blog" ? drafts.blog.filter((p) => p.slug !== slug) : drafts.blog,
          conseils: type === "conseil" ? drafts.conseils.filter((c) => c.slug !== slug) : drafts.conseils,
        });
      }
    } finally {
      setPublishing(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center px-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="px-4 py-16 text-center text-gray-text">
        Impossible de charger la configuration.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="font-heading text-2xl font-bold text-primary">
        Administration du site
      </h1>
      <p className="mt-1 text-gray-text">
        Modifiez les informations affichées sur le site.
      </p>

      <div className="mt-6 rounded-xl border border-primary/20 bg-primary/5 p-4">
        <h2 className="font-heading text-lg font-semibold text-primary flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Informations de contact
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          Entreprise, téléphone, email, zone et message d&apos;urgence — sans modifier le code. Enregistré dans <code className="rounded bg-white px-1 text-xs">site-data/site-settings.json</code>.
        </p>
        <Link
          href="/admin/site-settings"
          className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          Modifier les paramètres contact
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        {/* Affichage du site — toujours affiché, juste après l'encadré bleu */}
        <div className="rounded-xl border-2 border-primary/30 bg-primary/10 p-4 space-y-3">
          <h2 className="font-heading text-lg font-semibold text-primary flex items-center gap-2">
            <Layout className="h-5 w-5" />
            Affichage du site
          </h2>
          <p className="text-sm text-gray-600">
            Activer ou désactiver des sections sans modifier le code (avis, conseils, images, estimateur, interventions récentes, photos chantiers).
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={(displayState?.displaySettings?.showReviews ?? true) !== false}
                onChange={(e) =>
                  setSiteDataSettings((s) => {
                    const d = displayState ?? { displaySettings: { ...defaultDisplay }, showChantierPhotos: true };
                    const next = s ?? { displaySettings: { ...d.displaySettings }, showChantierPhotos: d.showChantierPhotos };
                    return { ...next, displaySettings: { ...next.displaySettings, showReviews: e.target.checked } };
                  })
                }
                className="h-4 w-4 rounded border-gray-300 text-primary"
              />
              <span className="text-sm">Afficher les avis clients</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={(displayState?.displaySettings?.showAdvice ?? true) !== false}
                onChange={(e) =>
                  setSiteDataSettings((s) => {
                    const d = displayState ?? { displaySettings: { ...defaultDisplay }, showChantierPhotos: true };
                    const next = s ?? { displaySettings: { ...d.displaySettings }, showChantierPhotos: d.showChantierPhotos };
                    return { ...next, displaySettings: { ...next.displaySettings, showAdvice: e.target.checked } };
                  })
                }
                className="h-4 w-4 rounded border-gray-300 text-primary"
              />
              <span className="text-sm">Afficher les conseils plomberie</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={(displayState?.displaySettings?.showAdviceImages ?? true) !== false}
                onChange={(e) =>
                  setSiteDataSettings((s) => {
                    const d = displayState ?? { displaySettings: { ...defaultDisplay }, showChantierPhotos: true };
                    const next = s ?? { displaySettings: { ...d.displaySettings }, showChantierPhotos: d.showChantierPhotos };
                    return { ...next, displaySettings: { ...next.displaySettings, showAdviceImages: e.target.checked } };
                  })
                }
                className="h-4 w-4 rounded border-gray-300 text-primary"
              />
              <span className="text-sm">Afficher les images dans les conseils</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={(displayState?.displaySettings?.showEstimator ?? true) !== false}
                onChange={(e) =>
                  setSiteDataSettings((s) => {
                    const d = displayState ?? { displaySettings: { ...defaultDisplay }, showChantierPhotos: true };
                    const next = s ?? { displaySettings: { ...d.displaySettings }, showChantierPhotos: d.showChantierPhotos };
                    return { ...next, displaySettings: { ...next.displaySettings, showEstimator: e.target.checked } };
                  })
                }
                className="h-4 w-4 rounded border-gray-300 text-primary"
              />
              <span className="text-sm">Afficher l&apos;estimateur de prix</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={(displayState?.displaySettings?.showRecentInterventions ?? true) !== false}
                onChange={(e) =>
                  setSiteDataSettings((s) => {
                    const d = displayState ?? { displaySettings: { ...defaultDisplay }, showChantierPhotos: true };
                    const next = s ?? { displaySettings: { ...d.displaySettings }, showChantierPhotos: d.showChantierPhotos };
                    return { ...next, displaySettings: { ...next.displaySettings, showRecentInterventions: e.target.checked } };
                  })
                }
                className="h-4 w-4 rounded border-gray-300 text-primary"
              />
              <span className="text-sm">Afficher les interventions récentes</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={(displayState?.showChantierPhotos ?? true) !== false}
                onChange={(e) =>
                  setSiteDataSettings((s) => {
                    const d = displayState ?? { displaySettings: { ...defaultDisplay }, showChantierPhotos: true };
                    const next = s ?? { displaySettings: { ...d.displaySettings }, showChantierPhotos: d.showChantierPhotos };
                    return { ...next, showChantierPhotos: e.target.checked };
                  })
                }
                className="h-4 w-4 rounded border-gray-300 text-primary"
              />
              <span className="text-sm">Afficher photos chantiers</span>
            </label>
          </div>
        </div>

        <div>
          <Label htmlFor="phone">Téléphone</Label>
          <Input
            id="phone"
            value={settings.phone}
            onChange={(e) =>
              setSettings((s) => (s ? { ...s, phone: e.target.value } : s))
            }
            className="mt-2"
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={settings.email}
            onChange={(e) =>
              setSettings((s) => (s ? { ...s, email: e.target.value } : s))
            }
            className="mt-2"
          />
        </div>
        <div>
          <Label htmlFor="address">Adresse</Label>
          <Input
            id="address"
            value={settings.address}
            onChange={(e) =>
              setSettings((s) => (s ? { ...s, address: e.target.value } : s))
            }
            className="mt-2"
          />
        </div>
        <div>
          <Label htmlFor="service_radius">Rayon d&apos;intervention</Label>
          <Input
            id="service_radius"
            value={settings.service_radius}
            onChange={(e) =>
              setSettings((s) =>
                s ? { ...s, service_radius: e.target.value } : s
              )
            }
            placeholder="15 km"
            className="mt-2"
          />
        </div>
        <div>
          <Label htmlFor="business_hours">Horaires</Label>
          <Input
            id="business_hours"
            value={settings.business_hours ?? ""}
            onChange={(e) =>
              setSettings((s) =>
                s ? { ...s, business_hours: e.target.value || undefined } : s
              )
            }
            placeholder="Lun–Ven 8h–18h"
            className="mt-2"
          />
        </div>
        <div>
          <Label htmlFor="homepage_message">Message d&apos;accueil (sous-titre)</Label>
          <Textarea
            id="homepage_message"
            value={settings.homepage_message ?? ""}
            onChange={(e) =>
              setSettings((s) =>
                s ? { ...s, homepage_message: e.target.value || undefined } : s
              )
            }
            rows={3}
            className="mt-2"
            placeholder="Dépannage plomberie, chauffe-eau, radiateurs et débouchage canalisation."
          />
        </div>
        <div>
          <Label>Villes (une par ligne)</Label>
          <Textarea
            value={settings.cities.join("\n")}
            onChange={(e) =>
              setSettings((s) =>
                s
                  ? {
                      ...s,
                      cities: e.target.value
                        .split("\n")
                        .map((c) => c.trim())
                        .filter(Boolean),
                    }
                  : s
              )
            }
            rows={6}
            className="mt-2 font-mono text-sm"
            placeholder="Pérouges&#10;Meximieux&#10;..."
          />
        </div>

        {message === "saved" && (
          <p className="text-sm font-medium text-green-600">
            Configuration enregistrée.
          </p>
        )}
        {message === "error" && (
          <p className="text-sm font-medium text-red-600">
            Erreur lors de l&apos;enregistrement (écriture fichier possible uniquement en local).
          </p>
        )}

        <Button type="submit" disabled={saving}>
          {saving ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Enregistrer
        </Button>
      </form>

      <p className="mt-8 text-xs text-gray-text">
        Sur Vercel, le système de fichiers est en lecture seule : les modifications depuis l’admin ne sont pas persistées. En local ou sur un hébergement avec écriture, elles mettent à jour{" "}
        <code>content/settings/site.json</code>.
      </p>

      {/* Brouillons — validation avant publication */}
      <section className="mt-16 border-t border-gray-200 pt-12">
        <h2 className="font-heading text-xl font-bold text-primary flex items-center gap-2">
          <FileEdit className="h-5 w-5" />
          Brouillons
        </h2>
        <p className="mt-1 text-sm text-gray-text">
          Contenu généré par GeoCompta en attente de validation. Publiez pour le rendre visible sur le site.
        </p>
        {drafts && !("error" in drafts) && (
          <div className="mt-6 space-y-6">
            {[
              { key: "realisations" as const, label: "Réalisations", items: drafts.realisations ?? [] },
              { key: "blog" as const, label: "Blog", items: drafts.blog ?? [] },
              { key: "conseils" as const, label: "Conseils", items: drafts.conseils ?? [] },
            ].map(({ key, label, items }) => (
              <div key={key}>
                <h3 className="text-sm font-semibold text-gray-700">{label}</h3>
                {items.length === 0 ? (
                  <p className="mt-1 text-sm text-gray-500">Aucun brouillon.</p>
                ) : (
                  <ul className="mt-2 space-y-2">
                    {items.map((item) => (
                      <li
                        key={item.slug}
                        className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm"
                      >
                        <span className="font-medium">{item.title}</span>
                        <span className="text-gray-500">
                          {[item.date, item.city, item.service].filter(Boolean).join(" · ")}
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={publishing !== null}
                          onClick={() => handlePublish(key === "realisations" ? "realisation" : key === "conseils" ? "conseil" : "blog", item.slug)}
                        >
                          {publishing === `${key}:${item.slug}` ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Send className="h-4 w-4" />
                          )}
                          {" "}Publier
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Déploiement */}
      <section className="mt-16 border-t border-gray-200 pt-12">
        <h2 className="font-heading text-xl font-bold text-primary flex items-center gap-2">
          Déploiement
        </h2>
        <p className="mt-1 text-sm text-gray-text">
          Après validation des brouillons, exécutez le script pour pousser les changements et déclencher le déploiement Vercel.
        </p>
        <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4 font-mono text-sm">
          <p className="text-gray-600">À la racine du projet, double-cliquez sur :</p>
          <p className="mt-2 font-semibold text-primary">Déployer le site.bat</p>
          <p className="mt-2 text-gray-600">ou en terminal :</p>
          <pre className="mt-1 overflow-x-auto whitespace-pre text-gray-800">
            {`git add .
git commit -m "Nouvelle intervention plomberie"
git push`}
          </pre>
        </div>
      </section>

      {/* Réseaux sociaux */}
      <section className="mt-16 border-t border-gray-200 pt-12">
        <h2 className="font-heading text-xl font-bold text-primary flex items-center gap-2">
          <Share2 className="h-5 w-5" />
          Réseaux sociaux
        </h2>
        <p className="mt-1 text-sm text-gray-text">
          Après publication, générez des posts courts pour Google Business, Facebook et Instagram à partir du contenu validé.
        </p>
        <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          Les textes sont à créer manuellement ou via votre outil GeoCompta à partir du contenu publié.
        </p>
      </section>
    </div>
  );
}
