"use client";

import React, { useEffect, useMemo, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useAuth } from '@/(pages)/(auth)/context/AuthContext';
import { getRouteCategoryContext, resolveSliceFromCategoryName, type SliceKey } from '@global/lib/slices';
import { SLICE_THEME_CONFIG } from '@global/lib/themeConfig';

function applyTheme(sliceKey: SliceKey) {
  const palette = SLICE_THEME_CONFIG[sliceKey] ?? SLICE_THEME_CONFIG.generic;
  const root = document.documentElement;

  root.style.setProperty('--brand-primary', palette.primary);
  root.style.setProperty('--brand-primary-dark', palette.primaryDark);
  root.style.setProperty('--brand-accent', palette.accent);
  root.style.setProperty('--brand-primary-foreground', palette.primaryForeground);
  root.setAttribute('data-slice-theme', sliceKey);
}

const SliceThemeProviderInner: React.FC<React.PropsWithChildren> = ({ children }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const routeCategoryContext = useMemo(
    () => getRouteCategoryContext(pathname, new URLSearchParams(searchParams.toString())),
    [pathname, searchParams],
  );

  const activeSlice = useMemo<SliceKey>(() => {
    const fromBusinessCategory = resolveSliceFromCategoryName(user?.businessCategoryName);
    if (fromBusinessCategory !== 'generic') {
      return fromBusinessCategory;
    }

    return routeCategoryContext.sliceKey;
  }, [routeCategoryContext.sliceKey, user?.businessCategoryName]);

  useEffect(() => {
    applyTheme(activeSlice);
  }, [activeSlice]);

  return <>{children}</>;
};

const SliceThemeProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <Suspense fallback={children}>
      <SliceThemeProviderInner>{children}</SliceThemeProviderInner>
    </Suspense>
  );
};

export default SliceThemeProvider;
