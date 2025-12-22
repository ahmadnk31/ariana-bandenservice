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
  const locales = ['en', 'nl', 'fr', 'es', 'tr', 'pl', 'gr', 'ar', 'fa', 'uk'];
  const languages: Record<string, string> = {};

  locales.forEach(locale => {
    languages[locale] = `/${locale}${path}`;
  });

  // Add x-default
  languages['x-default'] = `/en${path}`;

  return languages;
}
