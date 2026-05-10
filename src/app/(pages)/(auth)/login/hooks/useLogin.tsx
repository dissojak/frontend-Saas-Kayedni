"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/(pages)/(auth)/context/AuthContext";
import { callBackendLogin, callBackendTwoFactorLogin } from "../utils/index";
import { sendTwoFactorLoginCodeAPI } from "../../api/auth.api";
import type { LoginPayload } from "../types/index";
import { TwoFactorMethod, UserRole } from "../../types";
import { useRouter, useSearchParams } from "next/navigation";
import { useTracking } from "@global/hooks/useTracking";
import { logAuthEvent } from "@global/lib/authLogger";
import { useLocale } from "@global/hooks/useLocale";
import { authT } from "@/(pages)/(auth)/i18n";

export function useLogin() {
  const auth = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { trackEvent } = useTracking();
  const { locale } = useLocale();
  const tr = (key: Parameters<typeof authT>[1]) => authT(locale, key);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("CLIENT");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [twoFactorRequired, setTwoFactorRequired] = useState(false);
  const [twoFactorToken, setTwoFactorToken] = useState<string | null>(null);
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [twoFactorNotice, setTwoFactorNotice] = useState<string | null>(null);
  const [twoFactorMethods, setTwoFactorMethods] = useState<TwoFactorMethod[]>([]);
  const [selectedTwoFactorMethod, setSelectedTwoFactorMethod] = useState<TwoFactorMethod>("APP");
  const [sendingTwoFactorCode, setSendingTwoFactorCode] = useState(false);

  // Track which method we already auto-sent for, so we don't spam
  const lastAutoSentRef = useRef<string | null>(null);

  const resetTwoFactor = () => {
    setTwoFactorRequired(false);
    setTwoFactorToken(null);
    setTwoFactorCode("");
    setTwoFactorNotice(null);
    setTwoFactorMethods([]);
    setSelectedTwoFactorMethod("APP");
    lastAutoSentRef.current = null;
  };

  // Auto-send the verification code as soon as EMAIL or SMS is the active method.
  // The user should never have to press "Send code" manually on login.
  useEffect(() => {
    if (
      !twoFactorRequired ||
      !twoFactorToken ||
      (selectedTwoFactorMethod !== "EMAIL" && selectedTwoFactorMethod !== "SMS")
    ) {
      return;
    }
    const key = `${twoFactorToken}-${selectedTwoFactorMethod}`;
    if (lastAutoSentRef.current === key) return; // already sent
    lastAutoSentRef.current = key;

    // Fire-and-forget — errors are handled inside sendMethodCode
    sendMethodCode();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [twoFactorRequired, twoFactorToken, selectedTwoFactorMethod]);

  const handleSuccessfulLogin = async (result: {
    user: Parameters<typeof auth.login>[0];
    accessToken?: string | null;
    refreshToken?: string | null;
  }) => {
    await auth.login(result.user, result.accessToken, result.refreshToken);

    const redirectUrl = searchParams.get("redirect");
    if (redirectUrl) {
      router.push(redirectUrl);
    } else {
      router.push("/");
    }
  };

  const handleTwoFactorStep = async () => {
    if (!twoFactorToken) {
      return;
    }

    trackEvent("login_attempt", { role, method: "2fa" });
    logAuthEvent({ action: "login_attempt", email, role, metadata: { stage: "two_factor" } });

    const result = await callBackendTwoFactorLogin({
      twoFactorToken,
      code: twoFactorCode,
      method: selectedTwoFactorMethod,
    });

    if (result.success && result.user) {
      await handleSuccessfulLogin({ ...result, user: result.user });
      trackEvent("login", { method: "two_factor", role });
      logAuthEvent({
        action: "login_success",
        success: true,
        email,
        role,
        metadata: { stage: "two_factor" },
      });
      return;
    }

    setError(result.message || tr("error_login_failed"));
  };

  const handlePasswordStep = async () => {
    trackEvent("login_attempt", { role });
    logAuthEvent({ action: "login_attempt", email, role });

    const payload: LoginPayload = { email, password, role };
    const result = await callBackendLogin(payload);

    if (result.requiresTwoFactor && result.twoFactorToken) {
      const methods =
        result.twoFactorMethods && result.twoFactorMethods.length > 0
          ? result.twoFactorMethods
          : ["APP" as TwoFactorMethod];
      setTwoFactorRequired(true);
      setTwoFactorToken(result.twoFactorToken);
      setTwoFactorNotice(result.message || tr("login_two_factor_code_label"));
      setTwoFactorCode("");
      setTwoFactorMethods(methods);
      setSelectedTwoFactorMethod(methods[0]);
      return;
    }

    if (result.success && result.user) {
      await handleSuccessfulLogin({ ...result, user: result.user });
      trackEvent("login", { method: "email", role });
      logAuthEvent({ action: "login_success", success: true, email, role });
      return;
    }

    setError(result.message || tr("error_login_failed"));
    trackEvent("login_failed", {
      reason: result.message || "invalid_credentials",
      role,
      error_type: "invalid_credentials",
    });
    logAuthEvent({
      action: "login_failed",
      success: false,
      failReason: result.message || "invalid_credentials",
      failStage: "api",
      email,
      role,
      metadata: {
        passwordLength: password.length,
        passwordHasUpper: /[A-Z]/.test(password),
        passwordHasDigit: /\d/.test(password),
        passwordHasSpecial: /[^a-zA-Z0-9]/.test(password),
        serverMessage: result.message || null,
      },
    });
  };

  const sendMethodCode = async () => {
    if (
      !twoFactorToken ||
      selectedTwoFactorMethod === "APP" ||
      selectedTwoFactorMethod === "BACKUP_CODE"
    ) {
      return;
    }

    setSendingTwoFactorCode(true);
    setError(null);
    try {
      const response = await sendTwoFactorLoginCodeAPI({
        twoFactorToken,
        method: selectedTwoFactorMethod,
      });
      setTwoFactorNotice(response.message || tr("login_two_factor_code_sent"));
    } catch (err) {
      const msg = err instanceof Error ? err.message : tr("error_login_failed");
      setError(msg);
    } finally {
      setSendingTwoFactorCode(false);
    }
  };

  const submit = async () => {
    setError(null);
    setLoading(true);
    try {
      if (twoFactorRequired) {
        await handleTwoFactorStep();
      } else {
        await handlePasswordStep();
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
      trackEvent("login_failed", {
        reason: msg,
        role,
        error_type: "network_or_server_error",
      });
      logAuthEvent({
        action: "login_failed",
        success: false,
        failReason: msg,
        failStage: "network_error",
        email,
        role,
        metadata: {
          passwordLength: password.length,
          passwordHasUpper: /[A-Z]/.test(password),
          passwordHasDigit: /\d/.test(password),
          passwordHasSpecial: /[^a-zA-Z0-9]/.test(password),
          errorMessage: msg,
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    role,
    setRole,
    loading,
    error,
    twoFactorRequired,
    twoFactorCode,
    setTwoFactorCode,
    twoFactorNotice,
    twoFactorMethods,
    selectedTwoFactorMethod,
    setSelectedTwoFactorMethod,
    onSendTwoFactorCode: sendMethodCode,
    sendingTwoFactorCode,
    onResetTwoFactor: resetTwoFactor,
    submit,
  } as const;
}
