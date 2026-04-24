import React from 'react';
import { AlertCircle, ExternalLink } from 'lucide-react';
import { Badge } from '@components/ui/badge';
import { Button } from '@components/ui/button';
import { cn } from '@global/lib/utils';
import type { GuideCopy, GuideSegment, GuideStep } from '../i18n';

interface SegmentConfig {
  id: GuideSegment;
  title: string;
  description: string;
}

interface OwnerBusinessGuideContentProps {
  copy: GuideCopy;
  steps: GuideStep[];
  showOtherFlow: boolean;
  setShowOtherFlow: React.Dispatch<React.SetStateAction<boolean>>;
}

function scrollToElementById(id: string) {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
}

function handleGoToOtherFlow(setShowOtherFlow: React.Dispatch<React.SetStateAction<boolean>>) {
  setShowOtherFlow(true);
  setTimeout(() => {
    scrollToElementById('guide-section-otherFlow');
  }, 100);
}

function handleNavigateToStep(stepId: string) {
  scrollToElementById(`guide-step-${stepId}`);
}

export function OwnerBusinessGuideContent({
  copy,
  steps,
  showOtherFlow,
  setShowOtherFlow,
}: Readonly<OwnerBusinessGuideContentProps>) {
  const segmentConfig: SegmentConfig[] = [
    {
      id: 'mainStart',
      title: copy.sectionMainStartTitle,
      description: copy.sectionMainStartDescription,
    },
    {
      id: 'otherFlow',
      title: copy.sectionOtherTitle,
      description: copy.sectionOtherDescription,
    },
    {
      id: 'mainEnd',
      title: copy.sectionMainEndTitle,
      description: copy.sectionMainEndDescription,
    },
  ];

  return (
    <>
      {segmentConfig.map((segment) => {
        if (segment.id === 'otherFlow' && !showOtherFlow) {
          return null;
        }

        const segmentSteps = steps.filter((step) => step.segment === segment.id);

        if (segmentSteps.length === 0) {
          return null;
        }

        return (
          <section
            key={segment.id}
            id={segment.id === 'otherFlow' ? 'guide-section-otherFlow' : undefined}
            className="space-y-5"
          >
            <div className="rounded-[26px] border border-primary/20 bg-gradient-to-br from-primary/10 via-[#f8f2e2] to-accent/15 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.75),0_14px_26px_rgba(34,26,5,0.07)] sm:p-6">
              <h3 className="text-2xl font-extrabold tracking-tight text-[#1a1a1a]">{segment.title}</h3>
              <p className="mt-2 text-base leading-8 text-[#5c5140]">{segment.description}</p>
            </div>

            <div className="space-y-5">
              {segmentSteps.map((step) => (
                <article
                  key={step.id}
                  id={`guide-step-${step.id}`}
                  className="rounded-[28px] border border-[#e6dcc1] bg-[#fdfbf6]/95 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.75),0_16px_30px_rgba(34,26,5,0.08)] transition-all duration-200 hover:translate-y-[-2px] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.75),0_22px_34px_rgba(34,26,5,0.1)] sm:p-7"
                >
                  <div className="flex flex-wrap items-start gap-4 sm:gap-5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-base font-extrabold text-primary-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_8px_16px_rgba(0,0,0,0.15)]">
                      {step.order}
                    </div>

                    <div className="min-w-0 flex-1">
                      <Badge className="rounded-full border border-[#dfd4bb] bg-[#f4eddd] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#6c6250]">
                        {step.numberLabel}
                      </Badge>
                      <h4 className="mt-3 text-xl font-extrabold leading-tight text-[#1a1a1a] sm:text-[1.65rem]">
                        {step.title}
                      </h4>
                      <p className="mt-3 text-base leading-8 text-[#4f4638] sm:text-lg">{step.description}</p>

                      {step.hasContextualHelp && step.id === 'm8' ? (
                        <div className="mt-5 rounded-2xl border-2 border-orange-300 bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-50 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_12px_20px_rgba(249,115,22,0.12)]">
                          <div className="flex flex-wrap items-start gap-3">
                            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-orange-600" />
                            <div className="min-w-0 flex-1">
                              <h5 className="text-sm font-extrabold text-orange-900">{copy.m8ContextualTitle}</h5>
                              <p className="mt-1 text-sm leading-6 text-orange-800">{copy.m8ContextualMessage}</p>
                              <div className="mt-3">
                                <Button
                                  onClick={() => handleGoToOtherFlow(setShowOtherFlow)}
                                  className="h-9 rounded-full bg-orange-600 px-5 text-sm font-semibold text-white shadow-[0_6px_12px_rgba(249,115,22,0.25),inset_0_1px_0_rgba(255,255,255,0.2)] hover:bg-orange-700"
                                >
                                  <span className="inline-flex items-center gap-1.5">
                                    {copy.m8ContextualButtonLabel}
                                    <ExternalLink className="h-3.5 w-3.5" />
                                  </span>
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : null}

                      {step.id === 'o4' ? (
                        <div className="mt-5">
                          <Button
                            onClick={() => handleNavigateToStep('m10')}
                            className="h-9 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-[0_6px_12px_rgba(138,66,216,0.25),inset_0_1px_0_rgba(255,255,255,0.2)] hover:bg-primary/90"
                          >
                            <span className="inline-flex items-center gap-1.5">
                              {copy.o4NavigationLabel}
                              <ExternalLink className="h-3.5 w-3.5" />
                            </span>
                          </Button>
                        </div>
                      ) : null}

                      {step.id === 'o5' ? (
                        <div className="mt-5">
                          <Button
                            onClick={() => handleNavigateToStep('m9')}
                            className="h-9 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-[0_6px_12px_rgba(138,66,216,0.25),inset_0_1px_0_rgba(255,255,255,0.2)] hover:bg-primary/90"
                          >
                            <span className="inline-flex items-center gap-1.5">
                              {copy.o5NavigationLabel}
                              <ExternalLink className="h-3.5 w-3.5" />
                            </span>
                          </Button>
                        </div>
                      ) : null}

                      {step.id === 'o6' ? (
                        <div className="mt-5">
                          <Button
                            onClick={() => handleNavigateToStep('m12')}
                            className="h-9 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-[0_6px_12px_rgba(138,66,216,0.25),inset_0_1px_0_rgba(255,255,255,0.2)] hover:bg-primary/90"
                          >
                            <span className="inline-flex items-center gap-1.5">
                              {copy.o6NavigationLabel}
                              <ExternalLink className="h-3.5 w-3.5" />
                            </span>
                          </Button>
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div
                    className={cn(
                      'mt-6 grid gap-4',
                      step.imagePaths.length > 1 ? 'grid-cols-1 xl:grid-cols-2' : 'grid-cols-1',
                    )}
                  >
                    {step.imagePaths.map((path, index) => (
                      <figure
                        key={`${step.id}-${path}`}
                        className="overflow-hidden rounded-2xl border border-[#e1d6bd] bg-[#fffdf8] shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_12px_20px_rgba(34,26,5,0.08)]"
                      >
                        <img
                          src={path}
                          alt={`${step.numberLabel} - ${step.title} (${index + 1})`}
                          className="h-auto w-full object-contain"
                          loading="lazy"
                        />
                        <figcaption className="flex items-center justify-between border-t border-[#e7dcc2] bg-[#f9f3e6] px-4 py-2 text-sm font-medium text-[#5a503e]">
                          <span>{copy.imageReferenceLabel}</span>
                          <span>{index + 1}</span>
                        </figcaption>
                      </figure>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </section>
        );
      })}
    </>
  );
}
