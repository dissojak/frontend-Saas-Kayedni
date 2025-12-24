/**
 * Utility functions for creating and parsing business URL slugs
 * Format: business-name-id (e.g., "glamour-salon-spa-1" or "elite-cuts-2")
 */

/**
 * Creates a URL-friendly slug from the business name and id
 * @param name - Business name
 * @param id - Business ID
 * @returns URL slug in format "business-name-id"
 */
export function createBusinessSlug(name: string, id: string | number): string {
  const slugifiedName = name
    .toLowerCase()
    .trim()
    .replaceAll(/[^\w\s-]/g, '') // Remove special characters
    .replaceAll(/\s+/g, '-')     // Replace spaces with hyphens
    .replaceAll(/-+/g, '-')      // Replace multiple hyphens with single hyphen
    .replace(/^-/, '')           // Remove leading hyphen
    .replace(/-$/, '');          // Remove trailing hyphen
  
  return `${slugifiedName}-${id}`;
}

/**
 * Extracts the business ID from a slug
 * The ID is always the last segment after the final hyphen
 * @param slug - URL slug (e.g., "glamour-salon-spa-1")
 * @returns Business ID string
 */
export function extractBusinessIdFromSlug(slug: string): string {
  // The ID is the last part after the final hyphen
  const parts = slug.split('-');
  const id = parts.at(-1);
  
  // If the id is numeric, return it
  if (id && /^\d+$/.test(id)) {
    return id;
  }
  
  // If no numeric ID found at the end, return the whole slug as ID
  // (this handles legacy URLs that might just be the ID)
  return slug;
}

/**
 * Validates if a slug has the correct format (contains an ID at the end)
 * @param slug - URL slug to validate
 * @returns boolean indicating if slug is valid
 */
export function isValidBusinessSlug(slug: string): boolean {
  const parts = slug.split('-');
  if (parts.length < 1) return false;
  
  // Last part should be a number (the ID)
  const lastPart = parts.at(-1);
  return (lastPart !== undefined && /^\d+$/.test(lastPart)) || parts.length === 1;
}

/**
 * Extracts business name from slug (for display purposes)
 * @param slug - URL slug
 * @returns Business name portion of slug (with hyphens as spaces)
 */
export function extractBusinessNameFromSlug(slug: string): string {
  const parts = slug.split('-');
  // Remove the last part (ID) and join the rest
  const lastPart = parts.at(-1);
  if (parts.length > 1 && lastPart !== undefined && /^\d+$/.test(lastPart)) {
    return parts.slice(0, -1).join(' ');
  }
  return slug;
}
