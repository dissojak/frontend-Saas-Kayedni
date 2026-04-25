"use client";

import React, { useEffect, useMemo, useState } from "react";
import { BellRing, MessageCircle, ShieldCheck } from "lucide-react";
import { Button } from "@components/ui/button";
import { useLocale } from "@global/hooks/useLocale";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@components/ui/dialog";

type Audience = "client" | "staff";

type PromptCopy = {
  title: string;
  bannerText: (botLabel: string, audienceLabel: string) => string;
  openBot: string;
  setupNow: string;
  dialogTitle: string;
  dialogDescription: (audienceLabel: string) => string;
  howToActivate: string;
  step1: (botLabel: string) => string;
  step2: string;
  step3: string;
  notice: string;
  notYet: string;
  yesStarted: string;
  audienceLabel: (botLabel: string) => string;
};

const COPY: Record<string, PromptCopy> = {
  en: {
    title: 'Enable Telegram notifications',
    bannerText: (botLabel, audienceLabel) => `Start @${botLabel} to receive ${audienceLabel}.`,
    openBot: 'Open',
    setupNow: 'Setup now',
    dialogTitle: 'Telegram setup required',
    dialogDescription: (audienceLabel) => `To receive ${audienceLabel}, Telegram requires that you start the bot first. This only takes a few seconds.`,
    howToActivate: 'How to activate notifications:',
    step1: (botLabel) => `1. Open @${botLabel} on Telegram.`,
    step2: '2. Tap Start in the chat.',
    step3: '3. Return here and confirm that you started it.',
    notice: 'We stop showing this reminder after you confirm. If your phone number changes, we ask again to keep alerts reliable.',
    notYet: 'Not yet',
    yesStarted: 'Yes, I started the bot',
    audienceLabel: (botLabel) => botLabel,
  },
  fr: {
    title: 'Activer les notifications Telegram',
    bannerText: (botLabel, audienceLabel) => `Lancez @${botLabel} pour recevoir ${audienceLabel}.`,
    openBot: 'Ouvrir',
    setupNow: 'Configurer maintenant',
    dialogTitle: 'Configuration Telegram requise',
    dialogDescription: (audienceLabel) => `Pour recevoir ${audienceLabel}, Telegram demande que vous lanciez d’abord le bot. Cela ne prend que quelques secondes.`,
    howToActivate: 'Comment activer les notifications :',
    step1: (botLabel) => `1. Ouvrez @${botLabel} sur Telegram.`,
    step2: '2. Appuyez sur Start dans la conversation.',
    step3: '3. Revenez ici et confirmez que vous l’avez démarré.',
    notice: 'Nous n’affichons plus ce rappel après confirmation. Si votre numéro de téléphone change, nous vous le redemandons pour garder des alertes fiables.',
    notYet: 'Pas encore',
    yesStarted: 'Oui, j’ai démarré le bot',
    audienceLabel: (botLabel) => botLabel,
  },
  ar: {
    title: 'تفعيل اشعارات تيليجرام',
    bannerText: (botLabel, audienceLabel) => `شغّل @${botLabel} لتلقي ${audienceLabel}.`,
    openBot: 'فتح',
    setupNow: 'التفعيل الآن',
    dialogTitle: 'يتطلب تيليجرام اعدادا مسبقا',
    dialogDescription: (audienceLabel) => `لتلقي ${audienceLabel}، يحتاج تيليجرام الى تشغيل البوت اولا. هذا يستغرق بضع ثوان فقط.`,
    howToActivate: 'كيفية تفعيل الاشعارات:',
    step1: (botLabel) => `1. افتح @${botLabel} على تيليجرام.`,
    step2: '2. اضغط Start داخل المحادثة.',
    step3: '3. ارجع هنا ثم أكد أنك بدأت البوت.',
    notice: 'نتوقف عن عرض هذا التنبيه بعد التأكيد. إذا تغير رقم هاتفك، سنطلب منك ذلك مرة اخرى لضمان موثوقية التنبيهات.',
    notYet: 'ليس الآن',
    yesStarted: 'نعم، بدأت البوت',
    audienceLabel: (botLabel) => botLabel,
  },
};

function getAudienceLabel(locale: string, audience: Audience): string {
  if (audience === 'client') {
    if (locale === 'fr') return 'les confirmations et rappels de reservation';
    if (locale === 'ar') return 'تحديثات وتذكيرات الحجز';
    return 'booking updates and reminders';
  }

  if (locale === 'fr') return 'les alertes d’action de nouvelles reservations';
  if (locale === 'ar') return 'تنبيهات اجراءات الحجوزات الجديدة';
  return 'new booking action alerts';
}

function buildTelegramStartUrl(botUrl: string, userId?: string | null): string {
  if (!userId) return botUrl;
  const separator = botUrl.includes('?') ? '&' : '?';
  return botUrl + separator + 'start=' + encodeURIComponent('kyd_u_' + userId);
}

interface TelegramOnboardingPromptProps {
  audience: Audience;
  userId?: string | null;
  phone?: string | null;
  botLabel: string;
  botUrl: string;
  firstPromptStorageKey?: string;
}

interface ConfirmationState {
  confirmed: boolean;
  phoneSnapshot: string;
  confirmedAt: string;
}

function readConfirmationState(storageKey: string): ConfirmationState | null {
  try {
    const raw = globalThis.localStorage.getItem(storageKey);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<ConfirmationState>;
    if (parsed?.confirmed !== true) return null;
    return {
      confirmed: true,
      phoneSnapshot: String(parsed.phoneSnapshot ?? ""),
      confirmedAt: String(parsed.confirmedAt ?? ""),
    };
  } catch {
    return null;
  }
}

export default function TelegramOnboardingPrompt({
  audience,
  userId,
  phone,
  botLabel,
  botUrl,
  firstPromptStorageKey,
}: Readonly<TelegramOnboardingPromptProps>) {
  const { locale } = useLocale();
  const [ready, setReady] = useState(false);
  const [isBannerVisible, setIsBannerVisible] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const normalizedPhone = (phone ?? "").trim();
  const copy = COPY[locale] ?? COPY.en;
  const storageKey = useMemo(() => {
    if (!userId) return null;
    return `telegram_onboarding:${audience}:${userId}:confirmation`;
  }, [audience, userId]);

  useEffect(() => {
    if (!storageKey) {
      setReady(true);
      return;
    }

    const saved = readConfirmationState(storageKey);
    const isConfirmedForCurrentPhone = Boolean(saved?.confirmed) && saved?.phoneSnapshot === normalizedPhone;

    setIsBannerVisible(!isConfirmedForCurrentPhone);

    if (!isConfirmedForCurrentPhone && firstPromptStorageKey) {
      const shouldOpenFirstPrompt = globalThis.localStorage.getItem(firstPromptStorageKey) === "1";
      if (shouldOpenFirstPrompt) {
        setIsDialogOpen(true);
        globalThis.localStorage.removeItem(firstPromptStorageKey);
      }
    }

    setReady(true);
  }, [firstPromptStorageKey, normalizedPhone, storageKey]);

  const openBot = () => {
    const targetUrl = audience === 'client' ? buildTelegramStartUrl(botUrl, userId) : botUrl;
    globalThis.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  const markAsStarted = () => {
    if (!storageKey) return;

    const payload: ConfirmationState = {
      confirmed: true,
      phoneSnapshot: normalizedPhone,
      confirmedAt: new Date().toISOString(),
    };

    globalThis.localStorage.setItem(storageKey, JSON.stringify(payload));
    setIsBannerVisible(false);
    setIsDialogOpen(false);
  };

  if (!ready || !isBannerVisible) {
    return null;
  }

  const audienceLabel = getAudienceLabel(locale, audience);

  return (
    <>
      <div className="w-full text-left rounded-2xl border border-amber-300/60 bg-gradient-to-r from-amber-50 to-yellow-50 px-4 py-3 shadow-sm transition hover:shadow-md hover:border-amber-400">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 rounded-full bg-amber-200/70 p-2 text-amber-900">
              <BellRing className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-amber-950">{copy.title}</p>
              <p className="text-sm text-amber-900/90">
                {copy.bannerText(botLabel, audienceLabel)}
              </p>
            </div>
          </div>

          <div className="flex gap-2 sm:shrink-0">
            <Button
              type="button"
              variant="outline"
              className="border-amber-300 bg-white/80 text-amber-900 hover:bg-white"
              onClick={(event) => {
                event.stopPropagation();
                openBot();
              }}
            >
              {copy.openBot} @{botLabel}
            </Button>
            <Button
              type="button"
              className="bg-amber-600 hover:bg-amber-700 text-white"
              onClick={(event) => {
                event.stopPropagation();
                setIsDialogOpen(true);
              }}
            >
              {copy.setupNow}
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[560px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-primary" />
              {copy.dialogTitle}
            </DialogTitle>
            <DialogDescription>
              {copy.dialogDescription(audienceLabel)}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 rounded-xl border border-border bg-muted/30 p-4 text-sm">
            <p className="font-medium text-foreground">{copy.howToActivate}</p>
            <p>{copy.step1(botLabel)}</p>
            <p>{copy.step2}</p>
            <p>{copy.step3}</p>
            <div className="flex items-start gap-2 rounded-lg bg-emerald-50 p-2 text-emerald-800">
              <ShieldCheck className="h-4 w-4 mt-0.5" />
              <p className="text-xs">
                {copy.notice}
              </p>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
              {copy.notYet}
            </Button>
            <Button type="button" variant="secondary" onClick={openBot}>
              {copy.openBot} @{botLabel}
            </Button>
            <Button type="button" onClick={markAsStarted}>
              {copy.yesStarted}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
