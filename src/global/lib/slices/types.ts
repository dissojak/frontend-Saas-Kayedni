export type SliceKey = `${string}`;

export interface PendingOwnerCategory {
  categoryId: number;
  categoryName: string;
  source: 'slice' | 'manual';
  storedAt: string;
}
