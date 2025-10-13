import { Business } from "../types/business";

export const placeholderLogo = "/assets/placeholder.svg";

export function getLogo(b: Business) {
  return b.logo || placeholderLogo;
}

export function formatRating(r?: number | string) {
  if (r == null || r === "") return "—";
  return String(r);
}
