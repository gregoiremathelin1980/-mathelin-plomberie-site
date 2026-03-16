"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Calculator, ChevronRight, ChevronLeft, RotateCcw, Phone } from "lucide-react";
import { useSettings } from "@/contexts/SettingsContext";
import { Button, buttonVariants } from "@/components/ui/button";
import { estimatePrice, type PricingJSON } from "@/lib/estimatePrice";
import type { SimulateurJSON } from "@/lib/site-data";

const STEP1_OPTIONS = [
  { value: "canalisation", label: "Canalisation bouchée" },
  { value: "fuite", label: "Fuite d'eau" },
  { value: "chauffe-eau", label: "Problème chauffe-eau" },
  { value: "radiateur", label: "Problème radiateur" },
  { value: "robinet", label: "Problème robinetterie" },
  { value: "autre", label: "Autre problème plomberie" },
] as const;

const STEP2_BY_TYPE: Record<string, { value: string; label: string }[]> = {
  canalisation: [
    { value: "evier", label: "Évier bouché" },
    { value: "toilette", label: "Toilettes bouchées" },
    { value: "douche", label: "Douche / baignoire bouchée" },
    { value: "autre", label: "Autre canalisation" },
  ],
  fuite: [
    { value: "robinet", label: "Fuite robinet" },
    { value: "tuyau", label: "Fuite tuyau / canalisation" },
    { value: "chauffe-eau", label: "Fuite chauffe-eau" },
    { value: "radiateur", label: "Fuite radiateur" },
    { value: "autre", label: "Autre fuite" },
  ],
  "chauffe-eau": [
    { value: "pas-eau-chaude", label: "Pas d'eau chaude" },
    { value: "fuite", label: "Fuite chauffe-eau" },
    { value: "bruit", label: "Bruit anormal" },
    { value: "entretien", label: "Entretien / détartrage" },
    { value: "autre", label: "Autre" },
  ],
  radiateur: [
    { value: "froid", label: "Radiateur froid" },
    { value: "bruit", label: "Bruit / coups" },
    { value: "fuite", label: "Fuite radiateur" },
    { value: "purge", label: "Purge / désembouage" },
    { value: "autre", label: "Autre" },
  ],
  robinet: [
    { value: "fuite", label: "Fuite robinet" },
    { value: "pression", label: "Problème de pression" },
    { value: "remplacement", label: "Remplacement" },
    { value: "autre", label: "Autre" },
  ],
  autre: [],
};

const STEP3_OPTIONS = [
  { value: "urgence", label: "Urgence" },
  { value: "genant", label: "Problème gênant" },
  { value: "diagnostic", label: "Demande de diagnostic" },
] as const;

const PRICE_RANGES: Record<string, { min: number; max: number; label?: string }> = {
  "canalisation-evier": { min: 90, max: 180, label: "Débouchage évier" },
  "canalisation-toilette": { min: 100, max: 220, label: "Débouchage WC" },
  "canalisation-douche": { min: 120, max: 260, label: "Canalisation bouchée" },
  "canalisation-autre": { min: 120, max: 260, label: "Canalisation bouchée" },
  "fuite-robinet": { min: 90, max: 200, label: "Fuite robinet / fuite simple" },
  "fuite-tuyau": { min: 90, max: 200, label: "Fuite robinet / fuite simple" },
  "fuite-chauffe-eau": { min: 120, max: 300, label: "Diagnostic chauffe-eau" },
  "fuite-radiateur": { min: 90, max: 200, label: "Fuite robinet / fuite simple" },
  "fuite-autre": { min: 100, max: 220, label: "Réparation chasse d'eau" },
  "chauffe-eau-pas-eau-chaude": { min: 120, max: 300, label: "Diagnostic chauffe-eau" },
  "chauffe-eau-fuite": { min: 120, max: 300, label: "Diagnostic chauffe-eau" },
  "chauffe-eau-bruit": { min: 120, max: 300, label: "Diagnostic chauffe-eau" },
  "chauffe-eau-entretien": { min: 120, max: 300, label: "Diagnostic chauffe-eau" },
  "chauffe-eau-autre": { min: 250, max: 600, label: "Remplacement chauffe-eau (main d'œuvre)" },
  "radiateur-froid": { min: 90, max: 180, label: "Purge ou réglage radiateur" },
  "radiateur-bruit": { min: 90, max: 180, label: "Purge ou réglage radiateur" },
  "radiateur-fuite": { min: 90, max: 200, label: "Fuite robinet / fuite simple" },
  "radiateur-purge": { min: 90, max: 180, label: "Purge ou réglage radiateur" },
  "radiateur-autre": { min: 300, max: 900, label: "Désembouage chauffage" },
  "robinet-fuite": { min: 90, max: 200, label: "Fuite robinet / fuite simple" },
  "robinet-pression": { min: 90, max: 180, label: "Problème de pression" },
  "robinet-remplacement": { min: 100, max: 220, label: "Remplacement robinetterie" },
  "robinet-autre": { min: 90, max: 200, label: "Fuite robinet / fuite simple" },
  "autre-autre": { min: 90, max: 300, label: "Intervention" },
};

function getPriceKey(
  step1: string,
  step2: string,
  step2ByType: Record<string, { value: string; label: string }[]>
): string {
  if (!step1 || step1 === "autre") return "autre-autre";
  const details = step2ByType[step1];
  if (!details?.length || !step2) return `${step1}-autre`;
  return `${step1}-${step2}`;
}

export interface PrixMap {
  [key: string]: { min: number; max: number; label?: string };
}

interface EstimateFormProps {
  /** Price ranges from content/prix/prix.json when provided by the server (fallback) */
  prix?: PrixMap;
  /** Pricing from site-data/pricing.json or data/pricing.json for estimation dynamique */
  pricing?: PricingJSON | null;
  /** Options du sélecteur de problème (site-data/simulateur.json). Si absent, valeurs par défaut. */
  simulateur?: SimulateurJSON | null;
}

function getEstimateLabel(
  problemType: string,
  problemDetail: string,
  step1Options: readonly { value: string; label: string }[],
  step2ByType: Record<string, { value: string; label: string }[]>
): string {
  if (!problemType) return "";
  const step1 = step1Options.find((o) => o.value === problemType);
  if (problemType === "autre" || !step1) return step1?.label ?? "Intervention";
  const details = step2ByType[problemType];
  if (details?.length && problemDetail) {
    const d = details.find((o) => o.value === problemDetail);
    if (d) return d.label;
  }
  return step1.label;
}

export default function EstimateForm({ prix: prixFromServer, pricing, simulateur }: EstimateFormProps) {
  const settings = useSettings();
  const phoneRaw = settings.phone.replace(/\s/g, "");
  const cities = [...settings.cities, "Autre commune"];
  const step1Options = simulateur?.step1?.length ? simulateur.step1 : STEP1_OPTIONS;
  const step2ByType = simulateur?.step2 && Object.keys(simulateur.step2).length > 0 ? simulateur.step2 : STEP2_BY_TYPE;
  const step3Options = simulateur?.step3?.length ? simulateur.step3 : STEP3_OPTIONS;
  const priceRanges = prixFromServer && Object.keys(prixFromServer).length > 0 ? prixFromServer : PRICE_RANGES;
  const [step, setStep] = useState(1);
  const [problemType, setProblemType] = useState("");
  const [problemDetail, setProblemDetail] = useState("");
  const [situation, setSituation] = useState("");
  const [city, setCity] = useState("");

  const detailOptions = problemType ? (step2ByType[problemType] ?? step2ByType.autre ?? []) : [];
  const isOther = problemType === "autre";
  const priceKey = getPriceKey(problemType, problemDetail, step2ByType);
  const priceRange = priceRanges[priceKey] ?? priceRanges["autre-autre"];

  const dynamicEstimate = useMemo(() => {
    if (!pricing || isOther || !problemType) return null;
    const hasDetail = detailOptions.length <= 1 || problemDetail;
    return estimatePrice(pricing, {
      type_intervention: problemType,
      precision: problemDetail || "",
      situation: step >= 3 ? situation : "",
      ville: step >= 4 ? city : "",
    });
  }, [pricing, isOther, problemType, problemDetail, situation, city, step, detailOptions.length]);

  const canGoNext =
    (step === 1 && problemType && !isOther) ||
    (step === 2 && (detailOptions.length <= 1 || problemDetail)) ||
    (step === 3 && situation) ||
    (step === 4 && city);
  const showOtherMessage = isOther;
  const showPriceResult =
    !isOther &&
    problemType &&
    (problemDetail || detailOptions.length === 0) &&
    (step >= 2 || (step === 1 && detailOptions.length === 0));

  const resetForm = () => {
    setStep(1);
    setProblemType("");
    setProblemDetail("");
    setSituation("");
    setCity("");
  };

  return (
    <section id="devis" className="bg-gray-50 px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Calculator className="h-6 w-6" />
          </span>
          <div>
            <h2 className="font-heading text-2xl font-bold text-primary sm:text-3xl">
              Estimer le prix d&apos;une intervention
            </h2>
            <p className="mt-0.5 text-sm text-gray-text">
              Répondez en 4 étapes pour une fourchette indicative.
            </p>
            <p className="mt-2 text-xs text-gray-500">
              Estimation indicative. Diagnostic sur place avant toute intervention. Les prix peuvent varier selon la situation.
            </p>
          </div>
        </div>
        <div
          className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
          data-form-type="devis"
          data-geocompta-form="estimate"
        >
          {/* Step indicator */}
          <div className="mb-8 flex gap-2">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`h-1.5 flex-1 rounded-full ${s <= step ? "bg-primary" : "bg-gray-200"}`}
                aria-hidden
              />
            ))}
          </div>

          {step === 1 && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Étape 1 — Type de problème
              </label>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {step1Options.map((o) => (
                  <button
                    key={o.value}
                    type="button"
                    onClick={() => {
                      setProblemType(o.value);
                      setProblemDetail("");
                    }}
                    className={`rounded-xl border px-4 py-3 text-left text-sm font-medium transition ${
                      problemType === o.value
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && !isOther && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Étape 2 — Précision
              </label>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {detailOptions.map((o) => (
                  <button
                    key={o.value}
                    type="button"
                    onClick={() => setProblemDetail(o.value)}
                    className={`rounded-xl border px-4 py-3 text-left text-sm font-medium transition ${
                      problemDetail === o.value
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {showOtherMessage && (
            <div className="rounded-xl bg-primary/5 p-6">
              <p className="font-medium text-gray-800">
                Votre problème n&apos;est pas dans la liste ?
              </p>
              <p className="mt-1 text-gray-600">
                Contactez-nous directement pour expliquer votre situation.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href={`tel:${phoneRaw}`}
                  className={buttonVariants({ variant: "accent" }) + " inline-flex items-center gap-2"}
                >
                  Appeler maintenant
                </a>
                <Link href="/contact" className={buttonVariants({ variant: "outline" })}>
                  Envoyer une demande
                </Link>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Étape 3 — Situation
              </label>
              <div className="mt-3 space-y-2">
                {step3Options.map((o) => (
                  <button
                    key={o.value}
                    type="button"
                    onClick={() => setSituation(o.value)}
                    className={`w-full rounded-xl border px-4 py-3 text-left text-sm font-medium transition ${
                      situation === o.value
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                Étape 4 — Ville
              </label>
              <select
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="mt-3 w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                <option value="">Sélectionnez votre commune</option>
                {cities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              {step > 1 && !isOther && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep((s) => s - 1)}
                  className="gap-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Retour
                </Button>
              )}
              {(step > 1 || problemType) && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={resetForm}
                  className="gap-1"
                >
                  <RotateCcw className="h-4 w-4" />
                  Recommencer le formulaire
                </Button>
              )}
            </div>
            <div>
              {!isOther && step < 4 && (
                <Button
                  type="button"
                  disabled={!canGoNext}
                  onClick={() => setStep((s) => s + 1)}
                  className="gap-1"
                >
                  Suivant
                  <ChevronRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Price result — estimation dynamique (urgence, lieu) si pricing fourni, sinon fourchette fixe */}
          {showPriceResult && (
            <div className="mt-8 rounded-xl bg-primary/5 p-4">
              <p className="text-sm font-medium text-gray-700">
                {getEstimateLabel(problemType, problemDetail, step1Options, step2ByType)} — estimation indicative
              </p>
              <p className="mt-1 text-2xl font-bold text-primary">
                {dynamicEstimate
                  ? `${dynamicEstimate.min} € – ${dynamicEstimate.max} €`
                  : `${priceRange.min} € – ${priceRange.max} €`}
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link
                  href="/contact"
                  className={buttonVariants({ className: "inline-flex" })}
                >
                  Recevoir un devis précis
                </Link>
                <a
                  href={`tel:${phoneRaw}`}
                  className={buttonVariants({ variant: "outline", className: "inline-flex items-center gap-2" })}
                >
                  <Phone className="h-4 w-4" />
                  Appeler maintenant
                </a>
              </div>
            </div>
          )}
        </div>
        <p className="mt-6 text-center text-sm font-medium text-gray-700">
          Artisan plombier-chauffagiste diplômé (BP Génie Climatique) à votre service depuis 2013.
        </p>
      </div>
    </section>
  );
}
