import { PENDING_OWNER_CATEGORY_STORAGE_KEY } from './constants';
import type { PendingOwnerCategory } from './types';

function hasWindow(): boolean {
  return globalThis.window !== undefined;
}

export function setPendingOwnerCategory(payload: PendingOwnerCategory): void {
  if (!hasWindow()) {
    return;
  }

  localStorage.setItem(PENDING_OWNER_CATEGORY_STORAGE_KEY, JSON.stringify(payload));
}

export function getPendingOwnerCategory(): PendingOwnerCategory | null {
  if (!hasWindow()) {
    return null;
  }

  const raw = localStorage.getItem(PENDING_OWNER_CATEGORY_STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<PendingOwnerCategory>;
    if (typeof parsed.categoryId !== 'number' || !parsed.categoryName) {
      return null;
    }

    return {
      categoryId: parsed.categoryId,
      categoryName: parsed.categoryName,
      source: parsed.source === 'manual' ? 'manual' : 'slice',
      storedAt: parsed.storedAt ?? new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

export function clearPendingOwnerCategory(): void {
  if (!hasWindow()) {
    return;
  }

  localStorage.removeItem(PENDING_OWNER_CATEGORY_STORAGE_KEY);
}
