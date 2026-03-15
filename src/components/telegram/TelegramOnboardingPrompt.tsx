"use client";

import React, { useEffect, useMemo, useState } from "react";
import { BellRing, MessageCircle, ShieldCheck } from "lucide-react";
import { Button } from "@components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@components/ui/dialog";

type Audience = "client" | "staff";

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
  const [ready, setReady] = useState(false);
  const [isBannerVisible, setIsBannerVisible] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const normalizedPhone = (phone ?? "").trim();
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
    globalThis.open(botUrl, "_blank", "noopener,noreferrer");
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

  const audienceLabel = audience === "client" ? "booking updates and reminders" : "new booking action alerts";

  return (
    <>
      <div className="w-full text-left rounded-2xl border border-amber-300/60 bg-gradient-to-r from-amber-50 to-yellow-50 px-4 py-3 shadow-sm transition hover:shadow-md hover:border-amber-400">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 rounded-full bg-amber-200/70 p-2 text-amber-900">
              <BellRing className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-amber-950">Enable Telegram notifications</p>
              <p className="text-sm text-amber-900/90">
                Start @{botLabel} to receive {audienceLabel}.
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
              Open @{botLabel}
            </Button>
            <Button
              type="button"
              className="bg-amber-600 hover:bg-amber-700 text-white"
              onClick={(event) => {
                event.stopPropagation();
                setIsDialogOpen(true);
              }}
            >
              Setup now
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[560px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-primary" />
              Telegram setup required
            </DialogTitle>
            <DialogDescription>
              To receive {audienceLabel}, Telegram requires that you start the bot first. This only takes a few seconds.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 rounded-xl border border-border bg-muted/30 p-4 text-sm">
            <p className="font-medium text-foreground">How to activate notifications:</p>
            <p>1. Open @{botLabel} on Telegram.</p>
            <p>2. Tap Start in the chat.</p>
            <p>3. Return here and confirm that you started it.</p>
            <div className="flex items-start gap-2 rounded-lg bg-emerald-50 p-2 text-emerald-800">
              <ShieldCheck className="h-4 w-4 mt-0.5" />
              <p className="text-xs">
                We stop showing this reminder after you confirm. If your phone number changes, we ask again to keep alerts reliable.
              </p>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
              Not yet
            </Button>
            <Button type="button" variant="secondary" onClick={openBot}>
              Open @{botLabel}
            </Button>
            <Button type="button" onClick={markAsStarted}>
              Yes, I started the bot
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
