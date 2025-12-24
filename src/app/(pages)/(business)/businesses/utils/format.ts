import { Business } from "../types/business";

export const placeholderLogo = "/assets/placeholder.svg";

export function getLogo(b: Business) {
  return b.logo || placeholderLogo;
}

export function formatRating(r?: number | string) {
  if (r == null || r === "") return "—";
  const n = Number.parseFloat(String(r));
  if (Number.isNaN(n)) return "—";
  return n.toFixed(1);
}
