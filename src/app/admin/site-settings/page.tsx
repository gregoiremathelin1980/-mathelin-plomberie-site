"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Save, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { SiteDataSettings, DisplaySettings } from "@/lib/site-data-types";
import { getDefaultDisplaySettings } from "@/lib/display-settings";

const defaultDisplaySettings = getDefaultDisplaySettings();

const defaultSettings: SiteDataSettings & { displaySettings: DisplaySettings } = {
  entreprise: "",
  nom_contact: "",
  telephone: "",
  email: "",
  zone: "",
  messageUrgence: "",
  showAdviceImages: true,
  showChantierPhotos: true,
  displaySettings: defaultDisplaySettings,
};

export default function SiteSettingsPage() {
  const [settings, setSettings] = useState<SiteDataSettings & { displaySettings: DisplaySettings }>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<"saved" | "error" | null>(null);

  useEffect(() => {
    fetch("/api/admin/site-settings", { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => {
        const ds = data.displaySettings && typeof data.displaySettings === "object" ? data.displaySettings : {};
        setSettings({
          entreprise: data.entreprise ?? "",
          nom_contact: data.nom_contact ?? "",
          telephone: data.telephone ?? "",
          email: data.email ?? "",
          zone: data.zone ?? "",
          messageUrgence: data.messageUrgence ?? "",
          showAdviceImages: typeof data.showAdviceImages === "boolean" ? data.showAdviceImages : true,
          showChantierPhotos: typeof data.showChantierPhotos === "boolean" ? data.showChantierPhotos : true,
          displaySettings: {
            showReviews: typeof ds.showReviews === "boolean" ? ds.showReviews : defaultDisplaySettings.showReviews,
            showAdvice: typeof ds.showAdvice === "boolean" ? ds.showAdvice : defaultDisplaySettings.showAdvice,
            showAdviceImages: typeof ds.showAdviceImages === "boolean" ? ds.showAdviceImages : defaultDisplaySettings.showAdviceImages,
            showEstimator: typeof ds.showEstimator === "boolean" ? ds.showEstimator : defaultDisplaySettings.showEstimator,
            showRecentInterventions: typeof ds.showRecentInterventions === "boolean" ? ds.showRecentInterventions : defaultDisplaySettings.showRecentInterventions,
          },
        });
      })
      .catch(() => setSettings(defaultSettings))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/site-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        setMessage("saved");
      } else {
        setMessage("error");
      }
    } catch {
      setMessage("error");
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center px-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-16">
      <Link
        href="/admin"
        className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour à l&apos;admin
      </Link>

      <h1 className="font-heading text-2xl font-bold text-primary">
        Informations de contact
      </h1>
      <p className="mt-1 text-gray-600">
        Ces informations sont enregistrées dans{" "}
        <code className="rounded bg-gray-100 px-1 text-sm">site-data/site-settings.json</code> et
        affichées sur le site (téléphone, email, zone, message d&apos;urgence).
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div>
          <Label htmlFor="nom_contact">Nom prénom (affiché au-dessus du header)</Label>
          <Input
            id="nom_contact"
            value={settings.nom_contact ?? ""}
            onChange={(e) =>
              setSettings((s) => ({ ...s, nom_contact: e.target.value }))
            }
            className="mt-2"
            placeholder="Grégoire Mathelin"
          />
        </div>
        <div>
          <Label htmlFor="entreprise">Entreprise</Label>
          <Input
            id="entreprise"
            value={settings.entreprise ?? ""}
            onChange={(e) =>
              setSettings((s) => ({ ...s, entreprise: e.target.value }))
            }
            className="mt-2"
            placeholder="Mathelin Plomberie Chauffage"
          />
        </div>
        <div>
          <Label htmlFor="telephone">Téléphone</Label>
          <Input
            id="telephone"
            value={settings.telephone ?? ""}
            onChange={(e) =>
              setSettings((s) => ({ ...s, telephone: e.target.value }))
            }
            className="mt-2"
            placeholder="06 00 00 00 00"
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={settings.email ?? ""}
            onChange={(e) =>
              setSettings((s) => ({ ...s, email: e.target.value }))
            }
            className="mt-2"
            placeholder="contact@mathelin-plomberie.fr"
          />
        </div>
        <div>
          <Label htmlFor="zone">Zone d&apos;intervention</Label>
          <Input
            id="zone"
            value={settings.zone ?? ""}
            onChange={(e) =>
              setSettings((s) => ({ ...s, zone: e.target.value }))
            }
            className="mt-2"
            placeholder="Bugey et Côtière"
          />
        </div>
        <div>
          <Label htmlFor="messageUrgence">Message urgence</Label>
          <Textarea
            id="messageUrgence"
            value={settings.messageUrgence ?? ""}
            onChange={(e) =>
              setSettings((s) => ({ ...s, messageUrgence: e.target.value }))
            }
            rows={3}
            className="mt-2"
            placeholder="Intervention rapide dans le Bugey et la Côtière"
          />
        </div>
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="showChantierPhotos"
            checked={settings.showChantierPhotos !== false}
            onChange={(e) =>
              setSettings((s) => ({ ...s, showChantierPhotos: e.target.checked }))
            }
            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <Label htmlFor="showChantierPhotos" className="cursor-pointer font-normal">
            Afficher photos chantiers
          </Label>
        </div>

        <h2 className="font-heading text-xl font-semibold text-primary pt-8 border-t mt-8">
          Affichage du site
        </h2>
        <p className="text-gray-600 text-sm -mt-2">
          Activer ou désactiver des sections du site sans modifier le code.
        </p>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="showReviews"
              checked={settings.displaySettings.showReviews !== false}
              onChange={(e) =>
                setSettings((s) => ({
                  ...s,
                  displaySettings: { ...s.displaySettings, showReviews: e.target.checked },
                }))
              }
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <Label htmlFor="showReviews" className="cursor-pointer font-normal">
              Afficher les avis clients
            </Label>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="showAdvice"
              checked={settings.displaySettings.showAdvice !== false}
              onChange={(e) =>
                setSettings((s) => ({
                  ...s,
                  displaySettings: { ...s.displaySettings, showAdvice: e.target.checked },
                }))
              }
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <Label htmlFor="showAdvice" className="cursor-pointer font-normal">
              Afficher les conseils plomberie
            </Label>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="showAdviceImages"
              checked={settings.displaySettings.showAdviceImages !== false}
              onChange={(e) =>
                setSettings((s) => ({
                  ...s,
                  displaySettings: { ...s.displaySettings, showAdviceImages: e.target.checked },
                }))
              }
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <Label htmlFor="showAdviceImages" className="cursor-pointer font-normal">
              Afficher les images dans les conseils
            </Label>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="showEstimator"
              checked={settings.displaySettings.showEstimator !== false}
              onChange={(e) =>
                setSettings((s) => ({
                  ...s,
                  displaySettings: { ...s.displaySettings, showEstimator: e.target.checked },
                }))
              }
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <Label htmlFor="showEstimator" className="cursor-pointer font-normal">
              Afficher l&apos;estimateur de prix
            </Label>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="showRecentInterventions"
              checked={settings.displaySettings.showRecentInterventions !== false}
              onChange={(e) =>
                setSettings((s) => ({
                  ...s,
                  displaySettings: { ...s.displaySettings, showRecentInterventions: e.target.checked },
                }))
              }
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <Label htmlFor="showRecentInterventions" className="cursor-pointer font-normal">
              Afficher les interventions récentes
            </Label>
          </div>
        </div>

        {message === "saved" && (
          <p className="text-sm font-medium text-green-600">
            Paramètres enregistrés.
          </p>
        )}
        {message === "error" && (
          <p className="text-sm font-medium text-red-600">
            Erreur lors de l&apos;enregistrement (vérifiez que le dossier site-data est accessible en écriture).
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
    </div>
  );
}
