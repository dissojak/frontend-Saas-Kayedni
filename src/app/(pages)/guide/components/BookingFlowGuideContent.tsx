import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Badge } from '@components/ui/badge';
import { Button } from '@components/ui/button';
import { cn } from '@global/lib/utils';
import type {
  BookingChecklistScreen,
  BookingGuideCopy,
  BookingGuideSegment,
  BookingGuideStep,
} from '../bookingI18n';

interface BookingSegmentConfig {
  id: BookingGuideSegment;
  title: string;
  description: string;
}

interface BookingFlowGuideContentProps {
  copy: BookingGuideCopy;
  steps: BookingGuideStep[];
  loginHref: string;
  registerHref: string;
  searchHref: string;
}

interface ScreenCardProps {
  path: string;
  title: string;
  copy: BookingGuideCopy;
}

const SCREEN_REFERENCE_REGEX = /\/(\d+)\.png$/;

function screenReferenceFromPath(path: string): string {
  const match = SCREEN_REFERENCE_REGEX.exec(path);
  return match ? match[1] : path;
}

function ScreenCard({ path, title, copy }: Readonly<ScreenCardProps>) {
  return (
    <figure className="overflow-hidden rounded-2xl border border-[#e1d6bd] bg-[#fffdf8] shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_12px_20px_rgba(34,26,5,0.08)]">
      <img src={path} alt={title} className="h-auto w-full object-contain" loading="lazy" />
      <figcaption className="flex items-center justify-between border-t border-[#e7dcc2] bg-[#f9f3e6] px-4 py-2 text-sm font-medium text-[#5a503e]">
        <span>{copy.imageReferenceLabel}</span>
        <span>{screenReferenceFromPath(path)}</span>
      </figcaption>
    </figure>
  );
}

function MissingScreenCard({ copy }: Readonly<{ copy: BookingGuideCopy }>) {
  return (
    <div className="rounded-2xl border border-dashed border-[#d8cdb4] bg-[#f8f2e2] p-4 text-sm font-semibold text-[#7a6a4e]">
      {copy.missingScreenLabel}
    </div>
  );
}

function normalizeChecklistScreenPaths(checklistScreen: BookingChecklistScreen | undefined): string[] {
  if (Array.isArray(checklistScreen)) {
    return checklistScreen;
  }

  if (!checklistScreen) {
    return [];
  }

  return [checklistScreen];
}

function ChecklistScreenContent({
  checklistScreen,
  copy,
  title,
}: Readonly<{
  checklistScreen: BookingChecklistScreen | undefined;
  copy: BookingGuideCopy;
  title: string;
}>) {
  if (checklistScreen === null) {
    return <MissingScreenCard copy={copy} />;
  }

  const checklistPaths = normalizeChecklistScreenPaths(checklistScreen);

  if (checklistPaths.length === 0) {
    return null;
  }

  return (
    <div className={cn('grid gap-3', checklistPaths.length > 1 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1')}>
      {checklistPaths.map((path) => (
        <ScreenCard key={`${title}-${path}`} path={path} title={title} copy={copy} />
      ))}
    </div>
  );
}

export function BookingFlowGuideContent({
  copy,
  steps,
  loginHref,
  registerHref,
  searchHref,
}: Readonly<BookingFlowGuideContentProps>) {
  const segmentConfig: BookingSegmentConfig[] = [
    {
      id: 'discovery',
      title: copy.sectionDiscoveryTitle,
      description: copy.sectionDiscoveryDescription,
    },
    {
      id: 'flow',
      title: copy.sectionFlowTitle,
      description: copy.sectionFlowDescription,
    },
    {
      id: 'checkout',
      title: copy.sectionCheckoutTitle,
      description: copy.sectionCheckoutDescription,
    },
    {
      id: 'telegram',
      title: copy.sectionTelegramTitle,
      description: copy.sectionTelegramDescription,
    },
  ];

  return (
    <>
      {segmentConfig.map((segment) => {
        const segmentSteps = steps.filter((step) => step.segment === segment.id);

        if (segmentSteps.length === 0) {
          return null;
        }

        return (
          <section key={segment.id} className="space-y-5">
            <div className="rounded-[26px] border border-primary/20 bg-gradient-to-br from-primary/10 via-[#f8f2e2] to-accent/15 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.75),0_14px_26px_rgba(34,26,5,0.07)] sm:p-6">
              <h3 className="text-2xl font-extrabold tracking-tight text-[#1a1a1a]">{segment.title}</h3>
              <p className="mt-2 text-base leading-8 text-[#5c5140]">{segment.description}</p>
            </div>

            <div className="space-y-5">
              {segmentSteps.map((step) => (
                <article
                  key={step.id}
                  className="rounded-[28px] border border-[#e6dcc1] bg-[#fdfbf6]/95 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.75),0_16px_30px_rgba(34,26,5,0.08)] transition-all duration-200 hover:translate-y-[-2px] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.75),0_22px_34px_rgba(34,26,5,0.1)] sm:p-7"
                >
                  <div className="flex flex-wrap items-start gap-4 sm:gap-5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-base font-extrabold text-primary-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_8px_16px_rgba(0,0,0,0.15)]">
                      {step.order}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge className="rounded-full border border-[#dfd4bb] bg-[#f4eddd] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#6c6250]">
                          {step.numberLabel}
                        </Badge>
                        {step.isOptional ? (
                          <Badge className="rounded-full border border-primary/35 bg-primary/12 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                            {copy.optionalBadgeLabel}
                          </Badge>
                        ) : null}
                      </div>

                      <h4 className="mt-3 text-xl font-extrabold leading-tight text-[#1a1a1a] sm:text-[1.65rem]">
                        {step.title}
                      </h4>
                      <p className="mt-3 text-base leading-8 text-[#4f4638] sm:text-lg">{step.description}</p>

                      {step.id === 'b1' ? (
                        <div className="mt-5 flex flex-wrap gap-3">
                          <Button
                            asChild
                            className="h-10 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-[0_8px_16px_rgba(138,66,216,0.22)] hover:bg-primary/90"
                          >
                            <Link href={loginHref}>{copy.loginButtonLabel}</Link>
                          </Button>
                          <Button
                            asChild
                            variant="outline"
                            className="h-10 rounded-full border-primary/40 bg-[#f8f2ff] px-5 text-sm font-semibold text-primary hover:bg-primary/10"
                          >
                            <Link href={registerHref}>{copy.noAccountButtonLabel}</Link>
                          </Button>
                        </div>
                      ) : null}

                      {step.id === 'b2' ? (
                        <div className="mt-5">
                          <Button
                            asChild
                            className="h-10 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-[0_8px_16px_rgba(138,66,216,0.22)] hover:bg-primary/90"
                          >
                            <Link href={searchHref}>{copy.openSearchButtonLabel}</Link>
                          </Button>
                        </div>
                      ) : null}
                    </div>
                  </div>

                  {step.flowSteps && step.flowSteps.length > 0 ? (
                    <div className="mt-6 overflow-x-auto pb-2">
                      <div className="flex min-w-max items-stretch gap-3">
                        {step.flowSteps.map((flowStep, index) => {
                          const screenPath = step.flowStepScreens?.[index];

                          return (
                            <React.Fragment key={`${step.id}-${index}-${flowStep}`}>
                              <div className="w-[19rem] rounded-2xl border border-[#dfd4bb] bg-[#fff9ec] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
                                <p className="text-xs font-bold uppercase tracking-wide text-[#8b6f3f]">
                                  {copy.flowStepLabel} {index + 1}
                                </p>
                                <p className="mt-2 text-sm font-semibold leading-6 text-[#3e3526]">{flowStep}</p>
                                <div className="mt-3">
                                  {screenPath ? (
                                    <ScreenCard
                                      path={screenPath}
                                      title={`${step.numberLabel} - ${flowStep}`}
                                      copy={copy}
                                    />
                                  ) : (
                                    <MissingScreenCard copy={copy} />
                                  )}
                                </div>
                              </div>
                              {index < step.flowSteps.length - 1 ? (
                                <ArrowRight className="mt-[8.25rem] h-5 w-5 shrink-0 text-primary/75" />
                              ) : null}
                            </React.Fragment>
                          );
                        })}
                      </div>
                    </div>
                  ) : null}

                  {step.imagePaths.length > 0 ? (
                    <div
                      className={cn(
                        'mt-6 grid gap-4',
                        step.imagePaths.length > 1 ? 'grid-cols-1 xl:grid-cols-2' : 'grid-cols-1',
                      )}
                    >
                      {step.imagePaths.map((path) => (
                        <ScreenCard
                          key={`${step.id}-${path}`}
                          path={path}
                          title={`${step.numberLabel} - ${step.title}`}
                          copy={copy}
                        />
                      ))}
                    </div>
                  ) : null}

                  {step.checklist && step.checklist.length > 0 ? (
                    <div className="mt-5 rounded-2xl border border-[#dcd1b8] bg-[#f9f3e5] p-4 sm:p-5">
                      <p className="text-sm font-bold uppercase tracking-wide text-[#7b5f2f]">
                        {copy.telegramChecklistTitle}
                      </p>
                      <ol className="mt-3 space-y-4 text-sm leading-6 text-[#3f3740] sm:text-base">
                        {step.checklist.map((item, index) => {
                          const checklistScreen = step.checklistScreens?.[index];
                          const checklistTitle = `${step.numberLabel} - ${item}`;

                          return (
                            <li key={`${step.id}-check-${index}`} className="space-y-2">
                              <div className="flex gap-2">
                                <span className="font-semibold text-[#5f4a2a]">{index + 1}.</span>
                                <span>{item}</span>
                              </div>
                              <ChecklistScreenContent
                                checklistScreen={checklistScreen}
                                copy={copy}
                                title={checklistTitle}
                              />
                            </li>
                          );
                        })}
                      </ol>
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
          </section>
        );
      })}
    </>
  );
}
