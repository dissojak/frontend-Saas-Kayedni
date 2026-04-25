"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import { useAuth, UserRole } from "@/(pages)/(auth)/context/AuthContext";
import { useTracking } from "@global/hooks/useTracking";
import { t, type DictionaryKey } from "@global/lib/dictionaryService";
import { useLocale } from "@global/hooks/useLocale";
import { type LocaleCode } from "@global/lib/locales";
import {
  buildBusinessesCategoryUrl,
  categoryNameForSlice,
  getRouteCategoryContext,
  resolveSliceFromCategoryName,
  withCategoryQuery,
} from "@global/lib/slices";
import { Menu, Sun, Moon, Briefcase, Users, MessageCircle, Globe } from "lucide-react";
import Image from "next/image";

const CLIENT_BOT_LABEL = "KayedniBot";
const STAFF_BOT_LABEL = "KayedniBuissnessBot";
const CLIENT_BOT_URL = "https://t.me/KayedniBot";
const STAFF_BOT_URL = "https://t.me/KayedniBuissnessBot";

type NavLink = {
  path: string;
  labelKey: DictionaryKey;
};

const localeLabelMap: Record<LocaleCode, DictionaryKey> = {
  en: "locale_english",
  fr: "locale_french",
  ar: "locale_arabic",
};

// Role-specific navigation links.
const navLinks: Record<Exclude<UserRole, null>, NavLink[]> = {
  CLIENT: [
    { path: "/", labelKey: "nav_home" },
    { path: "/businesses", labelKey: "nav_find_services" },
    { path: "/client/bookings", labelKey: "nav_my_bookings" },
  ],
  BUSINESS_OWNER: [
    { path: "/business/dashboard", labelKey: "nav_dashboard" },
    { path: "/business", labelKey: "nav_my_business" },
    { path: "/business/staff", labelKey: "nav_staff" },
    { path: "/business/services", labelKey: "nav_services" },
    { path: "/business/bookings", labelKey: "nav_bookings" },
  ],
  STAFF: [
    { path: "/staff/dashboard", labelKey: "nav_my_workspace" },
    { path: "/staff/schedule", labelKey: "nav_my_schedule" },
    { path: "/staff/services", labelKey: "nav_services" },
    { path: "/staff/bookings", labelKey: "nav_bookings" },
  ],
  ADMIN: [
    { path: "/admin/dashboard", labelKey: "nav_dashboard" },
    { path: "/admin/businesses", labelKey: "nav_businesses" },
    { path: "/admin/users", labelKey: "nav_users" },
    { path: "/admin/analytics", labelKey: "nav_analytics" },
  ],
};

// Default links for non-authenticated users
const defaultLinks: NavLink[] = [
  { path: "/", labelKey: "nav_home" },
  { path: "/businesses", labelKey: "nav_find_services" },
];

const GENERIC_LOGO_SRC = "/assets/KayedniFullLogo-Zain.png";

const normalizeToken = (value: string) => value.replaceAll(/[^a-z0-9]/gi, "").toLowerCase();

const firstWordToken = (value?: string | null) => {
  const raw = value?.trim();
  if (!raw) {
    return "";
  }
  return raw.split(/[^a-zA-Z0-9]+/)[0] ?? "";
};

const Navbar = () => {
  const { user, isAuthenticated, logout, activeMode, switchMode } = useAuth();
  const { locale, setLocale } = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { trackEvent } = useTracking();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isSwitchingMode, setIsSwitchingMode] = useState(false);
  const [availableLogoFiles, setAvailableLogoFiles] = useState<string[] | null>(null);

  const routeCategoryContext = React.useMemo(
    () => getRouteCategoryContext(pathname, new URLSearchParams(searchParams.toString())),
    [pathname, searchParams],
  );

  const activeSlice = React.useMemo(() => {
    const fromBusinessCategory = resolveSliceFromCategoryName(user?.businessCategoryName);
    if (fromBusinessCategory !== "generic") {
      return fromBusinessCategory;
    }

    return routeCategoryContext.sliceKey;
  }, [routeCategoryContext.sliceKey, user?.businessCategoryName]);

  const guestCategorySlug = isAuthenticated ? null : routeCategoryContext.categorySlug;
  const guestCategoryName = isAuthenticated ? null : routeCategoryContext.categoryName;
  const homeHref = guestCategorySlug ? withCategoryQuery("/", guestCategorySlug) : "/";
  const loginHref = guestCategorySlug ? withCategoryQuery("/login", guestCategorySlug) : "/login";
  const registerHref = guestCategorySlug ? withCategoryQuery("/register", guestCategorySlug) : "/register";

  const logoCategoryName = React.useMemo(() => {
    const mapping = new Map<string, string>();
    for (const file of availableLogoFiles ?? []) {
      mapping.set(normalizeToken(file), file);
    }
    return mapping;
  }, [availableLogoFiles]);

  const [activeLogoSrc, setActiveLogoSrc] = useState(GENERIC_LOGO_SRC);

  useEffect(() => {
    let cancelled = false;

    const loadLogoVariations = async () => {
      try {
        const response = await fetch("/api/logo-variations", { cache: "no-store" });
        if (!response.ok) {
          if (!cancelled) {
            setAvailableLogoFiles([]);
          }
          return;
        }

        const payload = (await response.json()) as { files?: string[] };
        if (!cancelled) {
          setAvailableLogoFiles(Array.isArray(payload.files) ? payload.files : []);
        }
      } catch {
        if (!cancelled) {
          setAvailableLogoFiles([]);
        }
      }
    };

    loadLogoVariations();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!availableLogoFiles) {
      setActiveLogoSrc(GENERIC_LOGO_SRC);
      return;
    }

    const candidateTokens = [
      firstWordToken(user?.businessCategoryName),
      firstWordToken(categoryNameForSlice(activeSlice)),
      firstWordToken(activeSlice),
    ]
      .map((token) => token.trim())
      .filter((token) => token.length > 0 && token.toLowerCase() !== "generic");

    for (const token of candidateTokens) {
      const expectedName = `KayedniFullLogo-${token}.png`;
      const matchedFile = logoCategoryName.get(normalizeToken(expectedName));
      if (matchedFile) {
        setActiveLogoSrc(`/LogoVariations/${matchedFile}`);
        return;
      }
    }

    setActiveLogoSrc(GENERIC_LOGO_SRC);
  }, [activeSlice, availableLogoFiles, logoCategoryName, user?.businessCategoryName]);

  const translated = (key: DictionaryKey) => t(activeSlice, key, locale);

  const languageLabel = translated(localeLabelMap[locale]);

  const changeLocale = (nextLocale: LocaleCode) => {
    setLocale(nextLocale);
    trackEvent("click", { element: "locale_switch", locale: nextLocale, section: "navbar" });
  };

  const resolveLinkHref = (path: string, labelKey: DictionaryKey) => {
    if (labelKey === "nav_find_services") {
      const categoryName = user?.businessCategoryName ?? guestCategoryName;
      return buildBusinessesCategoryUrl(categoryName);
    }

    if (!isAuthenticated && path === "/") {
      return homeHref;
    }

    return path;
  };

  useEffect(() => {
    // initialize theme from localStorage or existing html class
    try {
      const stored = localStorage.getItem("theme");
      const prefersDark =
        stored === "dark" || (!stored && document.documentElement.classList.contains("dark"));
      if (prefersDark) {
        document.documentElement.classList.add("dark");
        setIsDark(true);
      } else {
        document.documentElement.classList.remove("dark");
        setIsDark(false);
      }
    } catch (e) {
      console.warn("Failed to initialize theme:", e);
    }
  }, []);

  const toggleTheme = () => {
    try {
      const html = document.documentElement;
      const isDarkMode = html.classList.contains("dark");

      if (isDarkMode) {
        html.classList.remove("dark");
        localStorage.setItem("theme", "light");
        setIsDark(false);
      } else {
        html.classList.add("dark");
        localStorage.setItem("theme", "dark");
        setIsDark(true);
      }
    } catch (e) {
      console.warn("Failed to toggle theme:", e);
    }
  };

  // Handle mode switching
  const handleModeSwitch = async (mode: "owner" | "staff") => {
    if (mode === activeMode) return;
    setIsSwitchingMode(true);
    try {
      await switchMode(mode);
      if (mode === "staff") {
        router.push("/staff/dashboard");
      } else {
        router.push("/business/dashboard");
      }
    } catch (error) {
      console.error("Failed to switch mode:", error);
    } finally {
      setIsSwitchingMode(false);
    }
  };

  // Determine which links to show based on activeMode for BO+Staff users
  const getNavLinks = () => {
    if (user?.role === "BUSINESS_OWNER" && user?.isAlsoStaff && activeMode === "staff") {
      return navLinks.STAFF;
    }
    const roleKey = user?.role ? (String(user.role).toUpperCase() as keyof typeof navLinks) : null;
    return roleKey && navLinks[roleKey] ? navLinks[roleKey] : defaultLinks;
  };

  const links = getNavLinks();

  const canEnableClientTelegram = isAuthenticated;
  const canEnableStaffTelegram =
    user?.role === "STAFF" || user?.role === "BUSINESS_OWNER";

  const openTelegramBot = (botUrl: string) => {
    if (globalThis.window === undefined) {
      return;
    }
    globalThis.open(botUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 shadow-sm transition-all duration-300">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href={homeHref} className="flex items-center gap-2 group" onClick={() => trackEvent('click', { element: 'logo', section: 'navbar' })}>
               <Image 
                src={activeLogoSrc}
                alt="kayedni Logo" 
                width={140}
                height={40}
                className="transition-transform duration-300 group-hover:scale-105"
               />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {links.map((link) => (
                <Link
                  key={`${link.path}-${link.labelKey}`}
                  href={resolveLinkHref(link.path, link.labelKey)}
                  className="relative px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary group"
                >
                  {translated(link.labelKey)}
                   <span className="absolute inset-x-0 -bottom-[13px] h-[2px] bg-primary scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="hidden md:flex items-center gap-2 rounded-full text-foreground/70 hover:text-primary hover:bg-primary/10 transition-colors"
                >
                  <Globe className="h-4 w-4" />
                  <span className="text-xs font-semibold">{languageLabel}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-40 p-1 rounded-xl border border-border/50 bg-card/90 backdrop-blur-xl shadow-2xl"
              >
                {(["en", "fr", "ar"] as LocaleCode[]).map((option) => (
                  <DropdownMenuItem
                    key={option}
                    onClick={() => changeLocale(option)}
                    className="rounded-lg cursor-pointer focus:bg-primary/10 focus:text-primary"
                  >
                    {translated(localeLabelMap[option])}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

             <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                aria-label={translated("nav_toggle_theme")}
                className="rounded-full text-foreground/70 hover:text-primary hover:bg-primary/10 transition-colors"
              >
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
             </Button>

            {isAuthenticated ? (
              <>
                {/* Mode Switcher for BO who is also Staff */}
                {user?.role === "BUSINESS_OWNER" && user?.isAlsoStaff && (
                  <div className="hidden md:flex items-center bg-muted/50 dark:bg-zinc-800/50 backdrop-blur-sm rounded-full p-1 border border-border/50">
                    <button
                      onClick={() => handleModeSwitch("owner")}
                      disabled={isSwitchingMode}
                      className={`flex items-center px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                        activeMode === "owner"
                          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      <Briefcase className="w-3.5 h-3.5 mr-2" />
                      {translated("nav_manager")}
                    </button>
                    <button
                      onClick={() => handleModeSwitch("staff")}
                      disabled={isSwitchingMode}
                      className={`flex items-center px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                        activeMode === "staff"
                          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      <Users className="w-3.5 h-3.5 mr-2" />
                      {translated("nav_staff")}
                    </button>
                  </div>
                )}
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-10 w-10 rounded-full p-0 overflow-hidden border-2 border-primary/20 hover:border-primary transition-colors focus:ring-2 focus:ring-primary/20 bg-background shadow-skeuo hover:shadow-skeuo-inner"
                    >
                      <img
                        src={
                          user?.avatar ||
                          (user?.name
                            ? `https://ui-avatars.com/api/?name=${user.name}`
                            : "/assets/placeholder.svg")
                        }
                        alt={user?.name ?? translated("nav_profile")}
                        width={40}
                        height={40}
                        className="object-cover h-full w-full"
                      />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-64 p-2 rounded-xl border border-border/50 bg-card/90 backdrop-blur-xl shadow-2xl animate-in slide-in-from-top-2"
                  >
                    <div className="px-3 py-2.5 bg-muted/30 rounded-lg mb-2">
                       <p className="font-semibold text-foreground">{user?.name ?? translated("nav_user")}</p>
                       <div className="flex items-center justify-between mt-1">
                          <p className="text-xs text-muted-foreground truncate max-w-[120px]">
                            {user?.email ?? ""}
                          </p>
                          <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary`}>
                            {user?.role}
                          </span>
                       </div>
                    </div>
                    
                    <DropdownMenuItem onClick={() => router.push("/profile")} className="rounded-lg cursor-pointer focus:bg-primary/10 focus:text-primary">
                      {translated("nav_profile")}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push("/settings")} className="rounded-lg cursor-pointer focus:bg-primary/10 focus:text-primary">
                      {translated("nav_settings")}
                    </DropdownMenuItem>
                    {canEnableClientTelegram && (
                      <DropdownMenuItem
                        onClick={() => {
                          trackEvent("click", { element: "enable_client_telegram", section: "navbar_profile_menu" });
                          openTelegramBot(CLIENT_BOT_URL);
                        }}
                        className="rounded-lg cursor-pointer focus:bg-primary/10 focus:text-primary"
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        {translated("nav_enable_client_telegram")} (@{CLIENT_BOT_LABEL})
                      </DropdownMenuItem>
                    )}
                    {canEnableStaffTelegram && (
                      <DropdownMenuItem
                        onClick={() => {
                          trackEvent("click", { element: "enable_staff_telegram", section: "navbar_profile_menu" });
                          openTelegramBot(STAFF_BOT_URL);
                        }}
                        className="rounded-lg cursor-pointer focus:bg-primary/10 focus:text-primary"
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        {translated("nav_enable_staff_telegram")} (@{STAFF_BOT_LABEL})
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator className="bg-border/50 my-2" />
                    <DropdownMenuItem
                      className="rounded-lg cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
                      onClick={() => {
                        trackEvent("logout", { method: "navbar" });
                        trackEvent("click", { element: "nav_logout", section: "navbar" });
                        logout();
                      }}
                    >
                      {translated("nav_logout")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <Button
                  variant="ghost"
                  className="rounded-full hover:bg-primary/10 hover:text-primary"
                  onClick={() => {
                    trackEvent("click", { element: "nav_login", section: "navbar" });
                    router.push(loginHref);
                  }}
                >
                  {translated("nav_login")}
                </Button>
                <Button
                  variant="skeuo-primary"
                  className="rounded-full px-6 shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all hover:-translate-y-0.5"
                  onClick={() => {
                    trackEvent("click", { element: "nav_signup", section: "navbar" });
                    router.push(registerHref);
                  }}
                >
                  {translated("nav_signup")}
                </Button>
              </div>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden rounded-full hover:bg-muted"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-border/40 space-y-4 animate-in slide-in-from-top-5 pt-4">
            {/* Mobile Mode Switcher */}
            {user?.role === "BUSINESS_OWNER" && user?.isAlsoStaff && (
              <div className="flex items-center justify-center bg-muted/50 rounded-full p-1 mx-4">
                <button
                  onClick={() => {
                    handleModeSwitch("owner");
                    setMobileMenuOpen(false);
                  }}
                  disabled={isSwitchingMode}
                  className={`flex-1 flex items-center justify-center px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeMode === "owner"
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "text-muted-foreground"
                  }`}
                >
                  <Briefcase className="w-4 h-4 mr-2" />
                  {translated("nav_manager")}
                </button>
                <button
                  onClick={() => {
                    handleModeSwitch("staff");
                    setMobileMenuOpen(false);
                  }}
                  disabled={isSwitchingMode}
                  className={`flex-1 flex items-center justify-center px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeMode === "staff"
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "text-muted-foreground"
                  }`}
                >
                  <Users className="w-4 h-4 mr-2" />
                  {translated("nav_staff")}
                </button>
              </div>
            )}

            <div className="mx-2 rounded-xl border border-border/40 p-2">
              <p className="px-2 pb-2 text-xs font-semibold text-muted-foreground">{translated("nav_language")}</p>
              <div className="grid grid-cols-3 gap-2">
                {(["en", "fr", "ar"] as LocaleCode[]).map((option) => (
                  <Button
                    key={option}
                    size="sm"
                    variant={locale === option ? "skeuo-primary" : "ghost"}
                    className="h-8 rounded-lg text-xs"
                    onClick={() => changeLocale(option)}
                  >
                    {translated(localeLabelMap[option])}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="flex flex-col px-2 space-y-1">
              {links.map((link) => (
                <Link
                  key={`${link.path}-${link.labelKey}`}
                  href={resolveLinkHref(link.path, link.labelKey)}
                  className="flex items-center px-4 py-3 rounded-xl text-foreground/80 hover:text-primary hover:bg-primary/5 transition-colors font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {translated(link.labelKey)}
                </Link>
              ))}

              {isAuthenticated && (
                <>
                  {canEnableClientTelegram && (
                    <button
                      type="button"
                      className="flex items-center px-4 py-3 rounded-xl text-foreground/80 hover:text-primary hover:bg-primary/5 transition-colors font-medium text-left"
                      onClick={() => {
                        trackEvent("click", { element: "enable_client_telegram", section: "navbar_mobile" });
                        openTelegramBot(CLIENT_BOT_URL);
                        setMobileMenuOpen(false);
                      }}
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      {translated("nav_enable_client_telegram")} (@{CLIENT_BOT_LABEL})
                    </button>
                  )}
                  {canEnableStaffTelegram && (
                    <button
                      type="button"
                      className="flex items-center px-4 py-3 rounded-xl text-foreground/80 hover:text-primary hover:bg-primary/5 transition-colors font-medium text-left"
                      onClick={() => {
                        trackEvent("click", { element: "enable_staff_telegram", section: "navbar_mobile" });
                        openTelegramBot(STAFF_BOT_URL);
                        setMobileMenuOpen(false);
                      }}
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      {translated("nav_enable_staff_telegram")} (@{STAFF_BOT_LABEL})
                    </button>
                  )}
                </>
              )}
              
              {!isAuthenticated && (
                <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-border/40 px-2">
                  <Button
                    variant="skeuo"
                    className="w-full justify-center rounded-xl"
                    onClick={() => {
                      trackEvent("click", { element: "nav_login", section: "navbar_mobile" });
                      setMobileMenuOpen(false);
                      router.push(loginHref);
                    }}
                  >
                    {translated("nav_login")}
                  </Button>
                  <Button
                    variant="skeuo-primary"
                    className="w-full justify-center rounded-xl"
                    onClick={() => {
                      trackEvent("click", { element: "nav_signup", section: "navbar_mobile" });
                      setMobileMenuOpen(false);
                      router.push(registerHref);
                    }}
                  >
                    {translated("nav_signup")}
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
