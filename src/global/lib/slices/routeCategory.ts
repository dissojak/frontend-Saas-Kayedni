import type { SliceKey } from './types';
import { SLICE_THEME_CONFIG } from '../themeConfig';

export interface RouteCategoryContext {
  sliceKey: SliceKey;
  categorySlug: string | null;
  categoryName: string | null;
  source: 'path' | 'query' | 'none';
}

const LANDING_SLICE_SEGMENTS = new Set<string>(
  Object.keys(SLICE_THEME_CONFIG)
    .map((sliceKey) => normalizeCategorySlug(sliceKey))
    .filter((sliceKey): sliceKey is string => Boolean(sliceKey && sliceKey !== 'generic')),
);

function titleCaseWord(word: string): string {
  if (!word) {
    return '';
  }

  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

function titleCasePhrase(value: string): string {
  return value
    .split(' ')
    .map((part) => part.trim())
    .filter((part) => part.length > 0)
    .map((part) => titleCaseWord(part))
    .join(' ');
}

function firstPathSegment(pathname?: string | null): string | null {
  if (!pathname) {
    return null;
  }

  const cleaned = pathname.trim().replace(/^\/+/, '');
  if (!cleaned) {
    return null;
  }

  const segment = cleaned.split('/')[0]?.trim();
  return segment && segment.length > 0 ? segment : null;
}

function readableCategoryFromSlug(normalizedSlug: string): string {
  return normalizedSlug.includes('&')
    ? normalizedSlug
      .split('&')
      .map((segment) => titleCasePhrase(segment.replaceAll('-', ' ')))
      .filter((segment) => segment.length > 0)
      .join(' & ')
    : titleCasePhrase(normalizedSlug.replaceAll('-', ' '));
}

export function normalizeCategorySlug(raw?: string | null): string | null {
  if (!raw) {
    return null;
  }

  let decoded = raw;
  try {
    decoded = decodeURIComponent(raw);
  } catch {
    decoded = raw;
  }

  const normalized = decoded
    .trim()
    .toLowerCase()
    .replaceAll(/\s*&\s*/g, '&')
    .replaceAll(/\s+/g, '-')
    .replaceAll(/-+/g, '-');

  return normalized.length > 0 ? normalized : null;
}

export function categoryNameForSlice(sliceKey: SliceKey): string {
  if (sliceKey === 'generic') {
    return 'Generic';
  }

  return categoryNameFromSlug(sliceKey) ?? 'Generic';
}

export function resolveSliceFromCategoryName(categoryName?: string | null): SliceKey {
  return normalizeCategorySlug(categoryName) ?? 'generic';
}

export function resolveSliceFromPath(pathname?: string | null): SliceKey {
  const segment = firstPathSegment(pathname);
  const normalized = normalizeCategorySlug(segment);
  if (!normalized) {
    return 'generic';
  }

  // Only route segments backed by dedicated landing pages should become slice context.
  return LANDING_SLICE_SEGMENTS.has(normalized) ? normalized : 'generic';
}

export function categorySlugForSlice(sliceKey: SliceKey): string | null {
  if (sliceKey === 'generic') {
    return null;
  }

  return normalizeCategorySlug(sliceKey);
}

export function categoryNameFromSlug(categorySlug?: string | null): string | null {
  const normalizedSlug = normalizeCategorySlug(categorySlug);
  if (!normalizedSlug) {
    return null;
  }

  const readableName = readableCategoryFromSlug(normalizedSlug);

  return readableName.length > 0 ? readableName : null;
}

export function resolveSliceFromCategorySlug(categorySlug?: string | null): SliceKey {
  return normalizeCategorySlug(categorySlug) ?? 'generic';
}

export function withCategoryQuery(path: string, categorySlug?: string | null): string {
  const normalizedSlug = normalizeCategorySlug(categorySlug);
  if (!normalizedSlug) {
    return path;
  }

  const [pathname, queryString = ''] = path.split('?');
  const params = new URLSearchParams(queryString);
  params.set('category', normalizedSlug);

  const serialized = params.toString();
  return serialized ? `${pathname}?${serialized}` : pathname;
}

export function buildBusinessesCategoryUrl(categoryName?: string | null): string {
  if (!categoryName) {
    return '/businesses';
  }

  const params = new URLSearchParams();
  params.set('category', categoryName);
  return `/businesses?${params.toString()}`;
}

export function getRouteCategoryContext(pathname?: string | null, searchParams?: URLSearchParams | null): RouteCategoryContext {
  const queryCategory = normalizeCategorySlug(searchParams?.get('category'));
  if (queryCategory) {
    return {
      sliceKey: resolveSliceFromCategorySlug(queryCategory),
      categorySlug: queryCategory,
      categoryName: categoryNameFromSlug(queryCategory),
      source: 'query',
    };
  }

  const pathSlice = resolveSliceFromPath(pathname);
  if (pathSlice !== 'generic') {
    return {
      sliceKey: pathSlice,
      categorySlug: categorySlugForSlice(pathSlice),
      categoryName: categoryNameForSlice(pathSlice),
      source: 'path',
    };
  }

  return {
    sliceKey: 'generic',
    categorySlug: null,
    categoryName: null,
    source: 'none',
  };
}

export function resolveBusinessLandingPathFromCategorySlug(categorySlug?: string | null): string | null {
  const normalized = normalizeCategorySlug(categorySlug);
  if (!normalized || normalized === 'generic') {
    return null;
  }

  return `/${normalized}`;
}