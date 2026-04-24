export function formatLastUpdatedLabel(dateValue?: string | null) {
  if (!dateValue) return null;

  const timestamp = Date.parse(dateValue);
  if (Number.isNaN(timestamp)) return null;

  const diffInDays = Math.round((Date.now() - timestamp) / (1000 * 60 * 60 * 24));

  if (diffInDays <= 0) {
    return 'Last updated today';
  }

  if (diffInDays === 1) {
    return 'Last updated 1 day ago';
  }

  return `Last updated ${diffInDays} days ago`;
}