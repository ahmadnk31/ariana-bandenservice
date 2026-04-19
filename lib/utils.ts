import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Parses a search query for tire size components.
 * Supports formats like:
 * - 185/65/15
 * - 185 65 15
 * - 185/65 R15 
 * - 185/65 (partial)
 */
export function parseTireSize(query: string) {
  const trimmed = query.trim().toUpperCase();

  // Pattern for full size: WIDTH/RATIO/RIM or WIDTH RATIO RIM or WIDTH/RATIO R RIM
  // Examples: 185/65/15, 185 65 15, 185/65 R15, 185/65-15
  const fullPattern = /^(\d{3})[/\s-]?(\d{2})[/\s-]?(?:R)?(\d{2})$/;
  const fullMatch = trimmed.match(fullPattern);
  if (fullMatch) {
    return {
      width: parseInt(fullMatch[1]),
      aspectRatio: parseInt(fullMatch[2]),
      rimSize: parseInt(fullMatch[3])
    };
  }

  // Pattern for partial size: WIDTH/RATIO
  const partialPattern = /^(\d{3})[/\s-]?(\d{2})$/;
  const partialMatch = trimmed.match(partialPattern);
  if (partialMatch) {
    return {
      width: parseInt(partialMatch[1]),
      aspectRatio: parseInt(partialMatch[2])
    };
  }

  // Pattern for width only (optional, but might be too broad)
  const widthPattern = /^(\d{3})$/;
  const widthMatch = trimmed.match(widthPattern);
  if (widthMatch) {
    return {
      width: parseInt(widthMatch[1])
    };
  }

  return null;
}

export function getAlternateLanguages(path: string = '') {
  const locales = ['en', 'nl', 'fr', 'es', 'tr', 'pl', 'gr', 'ar', 'fa', 'uk', 'de', 'it'];
  const languages: Record<string, string> = {};

  locales.forEach(locale => {
    languages[locale] = `/${locale}${path}`;
  });

  // Add x-default
  languages['x-default'] = `/en${path}`;

  return languages;
}

export function getBrandLogo(brandName?: string | null): string | null {
  if (!brandName) return null;
  const brand = brandName.trim().toLowerCase();
  const logos: Record<string, string> = {
    michelin: '/michelin.png',
    bridgestone: '/bridgestone.png',
    continental: '/continental.png',
    pirelli: '/pirelli.png',
    goodride: '/goodride.png',
    hankook: '/hankook.png',
    dunlop: '/dunlop.png',
    goodyear: '/goodyear.png',
    kumho: '/kumho.png',
    nexen: '/nexen.png',
    kleber: '/kleber.png',
    toyo: '/toyo.png',
    nankang: '/nankang.png',
    ceat: '/ceat.png',
    tracmax: '/tracmax.png',
    rotalla: '/rotalla.png',
    minerva: '/minerva.png',
    leao: '/Leao.png',
    trazano: '/trazano.png',
    westlake: '/westlake.png',
    berlin: '/berlin.png',
    falken: '/falken.png',
    firestone: '/firestone.png',
    fulda: '/fulda.png',
    doublestar: '/doublestar.png',
    tomket: '/tomket.png',
    blackarrow: '/blackarrow.png',
    vredestein: '/vredestein.png',
    landspider: '/landspider.png',
    uniroyal: '/uniroyal.png',
    imperial: '/imperial.png',
    kpatos: '/kpatos.png',
    aptany: '/aptany.png',
    windforce: '/windforce.png',
    maxxis: '/maxxis.png',
    fortuna: '/fortuna.png',
    tristar: '/tristar.png',
    lykeen: '/lykeen.png',
    mazzini: '/mazzini.png',
    yokohama: '/yokohama.png',
    delmax: '/delmax.png',
    superia: '/superia.png',
    kenda: '/kenda.png',
    lanvigator: '/lanvigator.png',
    rockblade: '/rockblade.png',
    accelera: '/accelera.png',
    goodtrip: '/goodtrip.png',
    ovation: '/ovation.png',
    rapid: '/rapid.png',
    gtradial: '/gtradial.png',
    security: '/security.png',
    sailun: '/sailun.png',
    laufenn: '/laufenn.png',
    roadx: '/roadx.png',
    kustone: '/kustone.png',
    dovroad: '/dovroad.png',
    sonix: '/sonix.png',
    arivo: '/arivo.png',
    triangle: '/triangle.png'
  };
  return logos[brand] || null;
}
