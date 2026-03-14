/**
 * Validation de la structure des JSON site-data (recent-interventions, pricing, simulateur).
 * Log des warnings au build si la structure est incohérente.
 */

import type { PricingJSON } from "@/lib/estimatePrice";
import type { SimulateurJSON, SimulateurStepOption } from "@/lib/site-data";

export interface RecentInterventionEntry {
  city?: string;
  label?: string;
  slug?: string;
  date?: string;
}

export interface SiteDataValidationResult {
  recentInterventions: { valid: boolean; warnings: string[] };
  pricing: { valid: boolean; warnings: string[] };
  simulateur: { valid: boolean; warnings: string[] };
}

function isNonEmptyString(x: unknown): x is string {
  return typeof x === "string" && x.trim().length > 0;
}

function validateRecentInterventions(data: unknown): { valid: boolean; warnings: string[] } {
  const warnings: string[] = [];
  if (data == null) return { valid: true, warnings: [] };
  const arr = Array.isArray(data) ? data : (data as { interventions?: unknown[] }).interventions;
  if (!Array.isArray(arr)) {
    warnings.push("recent-interventions.json: format attendu array ou { interventions: array }");
    return { valid: false, warnings };
  }
  arr.forEach((item, i) => {
    if (item && typeof item === "object") {
      const o = item as Record<string, unknown>;
      if (o.label !== undefined && !isNonEmptyString(o.label)) {
        warnings.push(`recent-interventions[${i}]: "label" doit être une chaîne non vide`);
      }
      if (o.city !== undefined && o.city !== null && typeof o.city !== "string") {
        warnings.push(`recent-interventions[${i}]: "city" doit être une chaîne`);
      }
    } else {
      warnings.push(`recent-interventions[${i}]: élément invalide (attendu objet)`);
    }
  });
  return { valid: warnings.length === 0, warnings };
}

function validatePricing(data: unknown): { valid: boolean; warnings: string[] } {
  const warnings: string[] = [];
  if (data == null) return { valid: true, warnings: [] };
  const o = data as Record<string, unknown>;
  if (typeof o !== "object") {
    warnings.push("pricing.json: racine doit être un objet");
    return { valid: false, warnings };
  }
  if (!o.base || typeof o.base !== "object") {
    warnings.push('pricing.json: champ "base" (objet) requis');
  }
  if (!o.precision || typeof o.precision !== "object") {
    warnings.push('pricing.json: champ "precision" (objet) requis');
  }
  if (!o.urgence || typeof o.urgence !== "object") {
    warnings.push('pricing.json: champ "urgence" (objet) requis');
  }
  if (!o.distance || typeof o.distance !== "object") {
    warnings.push('pricing.json: champ "distance" (objet) requis');
  }
  return { valid: warnings.length === 0, warnings };
}

function validateSimulateurOption(opt: unknown, path: string): string[] {
  const w: string[] = [];
  if (!opt || typeof opt !== "object") {
    w.push(`${path}: élément attendu { value, label }`);
    return w;
  }
  const o = opt as SimulateurStepOption;
  if (!isNonEmptyString(o.value)) w.push(`${path}: "value" requis (string)`);
  if (!isNonEmptyString(o.label)) w.push(`${path}: "label" requis (string)`);
  return w;
}

function validateSimulateur(data: unknown): { valid: boolean; warnings: string[] } {
  const warnings: string[] = [];
  if (data == null) return { valid: true, warnings: [] };
  const o = data as SimulateurJSON;
  if (typeof o !== "object") {
    warnings.push("simulateur.json: racine doit être un objet");
    return { valid: false, warnings };
  }
  if (Array.isArray(o.step1)) {
    o.step1.forEach((item, i) => {
      warnings.push(...validateSimulateurOption(item, `simulateur.step1[${i}]`));
    });
  }
  if (o.step2 && typeof o.step2 === "object") {
    for (const [key, arr] of Object.entries(o.step2)) {
      if (Array.isArray(arr)) {
        arr.forEach((item, i) => {
          warnings.push(...validateSimulateurOption(item, `simulateur.step2.${key}[${i}]`));
        });
      }
    }
  }
  if (Array.isArray(o.step3)) {
    o.step3.forEach((item, i) => {
      warnings.push(...validateSimulateurOption(item, `simulateur.step3[${i}]`));
    });
  }
  return { valid: warnings.length === 0, warnings };
}

/**
 * Valide les trois fichiers site-data (à appeler avec le contenu déjà parsé).
 */
export function validateSiteData(params: {
  recentInterventions: unknown;
  pricing: unknown;
  simulateur: unknown;
}): SiteDataValidationResult {
  return {
    recentInterventions: validateRecentInterventions(params.recentInterventions),
    pricing: validatePricing(params.pricing),
    simulateur: validateSimulateur(params.simulateur),
  };
}

/**
 * Log les warnings en console (build).
 */
export function logSiteDataValidationWarnings(result: SiteDataValidationResult): void {
  for (const [name, r] of Object.entries(result)) {
    if (r.warnings.length > 0) {
      console.warn(`[siteDataValidator] ${name}:`, r.warnings.join("; "));
    }
  }
}
