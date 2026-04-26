'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { BookOpen, ExternalLink, Palette, Search } from 'lucide-react';
import Layout from '@components/layout/Layout';
import { Badge } from '@components/ui/badge';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { useLocale } from '@global/hooks/useLocale';
import { categoryNameFromSlug, withCategoryQuery } from '@global/lib/slices';
import { cn } from '@global/lib/utils';
import {
  getBookingGuideCopy,
  getBookingGuideSteps,
} from './bookingI18n';
import { BookingFlowGuideContent } from './components/BookingFlowGuideContent';
import { OwnerBusinessGuideContent } from './components/OwnerBusinessGuideContent';
import { getGuideCopy, getGuideSteps } from './i18n';

type ActiveGuideId = 'owner-business' | 'booking-guide';

interface SearchableStep {
  numberLabel: string;
  title: string;
  description: string;
  searchTerms: string[];
}

interface GuideDefinition {
  pageTitle: string;
  pageSubtitle: string;
  searchLabel: string;
  searchPlaceholder: string;
  searchCountLabel: string;
  noResultsTitle: string;
  noResultsDescription: string;
  primaryActionLabel: string;
  primaryActionHref: string;
  filteredCount: number;
  totalCount: number;
}

function normalizeSearchValue(value: string): string {
  return value.trim().toLocaleLowerCase();
}

function stepMatchesQuery(step: SearchableStep, query: string): boolean {
  if (!query) {
    return true;
  }

  const haystack = [step.numberLabel, step.title, step.description, ...step.searchTerms]
    .join(' ')
    .toLocaleLowerCase();

  return haystack.includes(query);
}

export default function GuidePage() {
  const { locale } = useLocale();
  const [routeCategorySlug, setRouteCategorySlug] = useState<string | null>(null);

  useEffect(() => {
    if (typeof globalThis === 'undefined' || !globalThis.location) {
      return;
    }

    const params = new URLSearchParams(globalThis.location.search);
    setRouteCategorySlug(params.get('category'));
  }, []);

  const ownerCopy = getGuideCopy(locale);
  const bookingCopy = getBookingGuideCopy(locale);

  const ownerSteps = useMemo(() => getGuideSteps(locale), [locale]);
  const bookingSteps = useMemo(() => getBookingGuideSteps(locale), [locale]);

  const activeCategoryName = useMemo(() => categoryNameFromSlug(routeCategorySlug), [routeCategorySlug]);

  const landingHref = useMemo(() => withCategoryQuery('/', routeCategorySlug), [routeCategorySlug]);
  const searchHref = useMemo(() => withCategoryQuery('/search', routeCategorySlug), [routeCategorySlug]);
  const loginHref = useMemo(() => withCategoryQuery('/login', routeCategorySlug), [routeCategorySlug]);
  const registerHref = useMemo(() => withCategoryQuery('/register', routeCategorySlug), [routeCategorySlug]);

  const [activeGuide, setActiveGuide] = useState<ActiveGuideId>('owner-business');
  const [search, setSearch] = useState('');
  const [showOtherFlow, setShowOtherFlow] = useState(false);

  const normalizedSearch = normalizeSearchValue(search);

  const filteredOwnerSteps = useMemo(
    () => ownerSteps.filter((step) => stepMatchesQuery(step, normalizedSearch)),
    [ownerSteps, normalizedSearch],
  );

  const filteredBookingSteps = useMemo(
    () => bookingSteps.filter((step) => stepMatchesQuery(step, normalizedSearch)),
    [bookingSteps, normalizedSearch],
  );

  const visibleOwnerSteps = useMemo(() => {
    if (showOtherFlow) {
      return filteredOwnerSteps;
    }

    return filteredOwnerSteps.filter((step) => step.segment !== 'otherFlow');
  }, [filteredOwnerSteps, showOtherFlow]);

  const ownerTotalStepCount = useMemo(() => {
    if (showOtherFlow) {
      return ownerSteps.length;
    }

    return ownerSteps.filter((step) => step.segment !== 'otherFlow').length;
  }, [ownerSteps, showOtherFlow]);

  const guideDefinitions: Record<ActiveGuideId, GuideDefinition> = {
    'owner-business': {
      pageTitle: ownerCopy.pageTitle,
      pageSubtitle: ownerCopy.pageSubtitle,
      searchLabel: ownerCopy.searchLabel,
      searchPlaceholder: ownerCopy.searchPlaceholder,
      searchCountLabel: ownerCopy.searchCountLabel,
      noResultsTitle: ownerCopy.noResultsTitle,
      noResultsDescription: ownerCopy.noResultsDescription,
      primaryActionLabel: ownerCopy.landingButtonLabel,
      primaryActionHref: landingHref,
      filteredCount: visibleOwnerSteps.length,
      totalCount: ownerTotalStepCount,
    },
    'booking-guide': {
      pageTitle: bookingCopy.pageTitle,
      pageSubtitle: bookingCopy.pageSubtitle,
      searchLabel: bookingCopy.searchLabel,
      searchPlaceholder: bookingCopy.searchPlaceholder,
      searchCountLabel: bookingCopy.searchCountLabel,
      noResultsTitle: bookingCopy.noResultsTitle,
      noResultsDescription: bookingCopy.noResultsDescription,
      primaryActionLabel: bookingCopy.searchPageButtonLabel,
      primaryActionHref: searchHref,
      filteredCount: filteredBookingSteps.length,
      totalCount: bookingSteps.length,
    },
  };

  const activeGuideConfig = guideDefinitions[activeGuide];

  const sidebarItemById = useMemo(() => {
    return new Map(ownerCopy.sidebarItems.map((item) => [item.id, item]));
  }, [ownerCopy.sidebarItems]);

  const sidebarItems = useMemo(() => {
    return [
      {
        id: 'owner-business',
        title: sidebarItemById.get('owner-business')?.title ?? 'Create Owner and Business',
        isPlaceholder: false,
      },
      {
        id: 'booking-guide',
        title: sidebarItemById.get('booking-guide')?.title ?? 'Booking Flow Guide',
        isPlaceholder: false,
      },
      {
        id: 'personal-signup',
        title: sidebarItemById.get('personal-signup')?.title ?? 'Create Personal Account',
        isPlaceholder: true,
      },
      {
        id: 'dashboard-guide',
        title: sidebarItemById.get('dashboard-guide')?.title ?? 'Dashboard Basics',
        isPlaceholder: true,
      },
    ];
  }, [sidebarItemById]);

  let guideContent: React.ReactNode;

  if (activeGuideConfig.filteredCount === 0) {
    guideContent = (
      <div className="rounded-[28px] border border-dashed border-[#d9cfb5] bg-[#fbf7ec] p-10 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
        <h3 className="text-2xl font-bold text-[#1a1a1a]">{activeGuideConfig.noResultsTitle}</h3>
        <p className="mx-auto mt-3 max-w-2xl text-base leading-8 text-[#6b604b]">
          {activeGuideConfig.noResultsDescription}
        </p>
      </div>
    );
  } else if (activeGuide === 'owner-business') {
    guideContent = (
      <OwnerBusinessGuideContent
        copy={ownerCopy}
        steps={filteredOwnerSteps}
        showOtherFlow={showOtherFlow}
        setShowOtherFlow={setShowOtherFlow}
      />
    );
  } else {
    guideContent = (
      <BookingFlowGuideContent
        copy={bookingCopy}
        steps={filteredBookingSteps}
        loginHref={loginHref}
        registerHref={registerHref}
        searchHref={searchHref}
      />
    );
  }

  return (
    <Layout>
      <div className="relative min-h-screen overflow-hidden bg-[#f4efe1] text-[#1a1a1a]">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-16 -top-20 h-80 w-80 rounded-full bg-primary/25 blur-3xl" />
          <div className="absolute -right-24 top-1/4 h-[26rem] w-[26rem] rounded-full bg-accent/25 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
          <div
            className="absolute inset-0 opacity-[0.16]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
              backgroundSize: '42px 42px',
            }}
          />
        </div>

        <div className="relative mx-auto w-full max-w-[1320px] px-4 py-8 sm:px-6 lg:px-8">
          <section className="rounded-[30px] border border-[#e6dcc1] bg-[#fdfbf6]/95 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.75),0_16px_36px_rgba(34,26,5,0.08)] backdrop-blur-sm sm:p-8 lg:p-10">
            <div className="flex flex-wrap items-center gap-3">
              <Badge className="rounded-full border border-primary/35 bg-primary/12 px-4 py-2 text-sm font-semibold text-primary">
                <BookOpen className="mr-2 h-4 w-4" />
                SAP / SOP
              </Badge>
              <Badge className="rounded-full border border-accent/40 bg-accent/15 px-4 py-2 text-sm font-semibold text-[#6c4c1f]">
                <Palette className="mr-2 h-4 w-4" />
                {ownerCopy.activeThemeLabel}: {activeCategoryName ?? ownerCopy.activeThemeGeneric}
              </Badge>
            </div>

            <h1 className="mt-6 max-w-4xl text-4xl font-extrabold leading-[1.08] tracking-tight text-[#1a1a1a] sm:text-5xl lg:text-6xl">
              {activeGuideConfig.pageTitle}
            </h1>

            <p className="mt-5 max-w-4xl text-base leading-8 text-[#4f4638] sm:text-lg lg:text-xl">
              {activeGuideConfig.pageSubtitle}
            </p>

            <p className="mt-4 text-sm font-semibold text-primary sm:text-base">{ownerCopy.aliasNotice}</p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Button
                asChild
                className="h-12 rounded-full bg-primary px-7 text-base font-semibold text-primary-foreground shadow-[0_10px_22px_rgba(0,0,0,0.14),inset_0_1px_0_rgba(255,255,255,0.35)] hover:bg-primary/90"
              >
                <Link href={activeGuideConfig.primaryActionHref} className="inline-flex items-center gap-2">
                  {activeGuideConfig.primaryActionLabel}
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </Button>

              <Badge className="rounded-full border border-[#dacfb5] bg-[#f6efdf] px-4 py-2 text-sm font-semibold text-[#4f4638]">
                {activeGuideConfig.filteredCount} / {activeGuideConfig.totalCount}{' '}
                {activeGuideConfig.searchCountLabel}
              </Badge>
            </div>
          </section>

          <section className="mt-8 grid gap-6 lg:grid-cols-[310px_1fr] lg:gap-8">
            <aside className="h-fit lg:sticky lg:top-24">
              <div className="rounded-[28px] border border-[#e6dcc1] bg-[#fdfbf6]/95 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.72),0_14px_30px_rgba(34,26,5,0.08)]">
                <h2 className="text-xl font-bold tracking-tight text-[#1a1a1a]">{ownerCopy.sidebarTitle}</h2>
                <div className="mt-4 space-y-3">
                  {sidebarItems.map((item) => {
                    const isSelectable = item.id === 'owner-business' || item.id === 'booking-guide';
                    const isActive = item.id === activeGuide;

                    if (isSelectable) {
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            setActiveGuide(item.id as ActiveGuideId);
                            setSearch('');
                          }}
                          className={cn(
                            'w-full rounded-2xl border px-4 py-4 text-left text-base transition-all duration-200',
                            isActive
                              ? 'border-primary/35 bg-primary/12 text-[#1a1a1a] shadow-[inset_0_1px_0_rgba(255,255,255,0.75),0_8px_16px_rgba(138,66,216,0.18)]'
                              : 'border-[#e3d7bd] bg-[#fbf7ed] text-[#6b604b] hover:border-primary/20 hover:bg-primary/8',
                          )}
                        >
                          <span className="font-semibold leading-6">{item.title}</span>
                        </button>
                      );
                    }

                    return (
                      <div
                        key={item.id}
                        className="rounded-2xl border border-[#e3d7bd] bg-[#fbf7ed] px-4 py-4 text-base text-[#6b604b]"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span className="font-semibold leading-6">{item.title}</span>
                          <Badge className="rounded-full border border-[#dfd2b8] bg-[#f3ecd9] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#7a6f58]">
                            {ownerCopy.sidebarPlaceholderLabel}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </aside>

            <main className="space-y-6">
              <div className="rounded-[28px] border border-[#e6dcc1] bg-[#fdfbf6]/95 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.75),0_14px_30px_rgba(34,26,5,0.08)] sm:p-6">
                <label htmlFor="guide-search" className="mb-3 block text-lg font-bold text-[#1a1a1a]">
                  {activeGuideConfig.searchLabel}
                </label>
                <div className="relative">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#7d735f]" />
                  <Input
                    id="guide-search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder={activeGuideConfig.searchPlaceholder}
                    className="h-14 rounded-2xl border-[#ded2b4] bg-[#fffdf8] pl-12 text-base text-[#1a1a1a] placeholder:text-[#8f846d]"
                  />
                </div>
                <div className="mt-3 text-sm font-medium text-[#6b604b]">
                  {activeGuideConfig.filteredCount} / {activeGuideConfig.totalCount}{' '}
                  {activeGuideConfig.searchCountLabel}
                </div>
              </div>

              {guideContent}
            </main>
          </section>
        </div>
      </div>
    </Layout>
  );
}
