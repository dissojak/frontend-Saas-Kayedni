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
import { t } from "@global/lib/dictionaryService";
import {
  buildBusinessesCategoryUrl,
  categoryNameForSlice,
  getRouteCategoryContext,
  resolveSliceFromCategoryName,
  withCategoryQuery,
} from "@global/lib/slices";
import { Menu, Sun, Moon, Briefcase, Users, MessageCircle } from "lucide-react";
import Image from "next/image";

const CLIENT_BOT_LABEL = "KayedniBot";
const STAFF_BOT_LABEL = "KayedniBuissnessBot";
const CLIENT_BOT_URL = "https://t.me/KayedniBot";
const STAFF_BOT_URL = "https://t.me/KayedniBuissnessBot";

// Role-specific navigation links (keys now use uppercase to match backend/user role values)
const navLinks: Record<Exclude<UserRole, null>, { path: string; label: string }[]> = {
  CLIENT: [
    { path: "/", label: "Home" },
    { path: "/businesses", label: "Find Services" },
    { path: "/client/bookings", label: "My Bookings" },
  ],
  BUSINESS_OWNER: [
    { path: "/business/dashboard", label: "Dashboard" },
    { path: "/business", label: "My Business" },
    { path: "/business/staff", label: "Staff" },
    { path: "/business/services", label: "Services" },
    { path: "/business/bookings", label: "Bookings" },
  ],
  STAFF: [
    { path: "/staff/dashboard", label: "My Workspace" },
    { path: "/staff/schedule", label: "My Schedule" },
    { path: "/staff/services", label: "Services" },
    { path: "/staff/bookings", label: "Bookings" },
  ],
  ADMIN: [
    { path: "/admin/dashboard", label: "Dashboard" },
    { path: "/admin/businesses", label: "Businesses" },
    { path: "/admin/users", label: "Users" },
    { path: "/admin/analytics", label: "Analytics" },
  ],
};

// Default links for non-authenticated users
const defaultLinks = [
  { path: "/", label: "Home" },
  { path: "/businesses", label: "Find Services" },
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

  const translateNavLabel = (label: string) => {
    if (label === "Services") {
      return t(activeSlice, "nav_services");
    }
    if (label === "Bookings") {
      return t(activeSlice, "nav_bookings");
    }
    return label;
  };

  const resolveLinkHref = (path: string, label: string) => {
    if (label === "Find Services") {
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
                  key={`${link.path}-${link.label}`}
                  href={resolveLinkHref(link.path, link.label)}
                  className="relative px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary group"
                >
                  {translateNavLabel(link.label)}
                   <span className="absolute inset-x-0 -bottom-[13px] h-[2px] bg-primary scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
             <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                aria-label="Toggle theme"
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
                      Manager
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
                      Staff
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
                        alt={user?.name ?? "Profile"}
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
                       <p className="font-semibold text-foreground">{user?.name ?? "User"}</p>
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
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push("/settings")} className="rounded-lg cursor-pointer focus:bg-primary/10 focus:text-primary">
                      Settings
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
                        Enable Client Telegram (@{CLIENT_BOT_LABEL})
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
                        Enable Staff Telegram (@{STAFF_BOT_LABEL})
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
                      Logout
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
                  Log in
                </Button>
                <Button
                  variant="skeuo-primary"
                  className="rounded-full px-6 shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all hover:-translate-y-0.5"
                  onClick={() => {
                    trackEvent("click", { element: "nav_signup", section: "navbar" });
                    router.push(registerHref);
                  }}
                >
                  Sign Up
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
                  Manager
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
                  Staff
                </button>
              </div>
            )}
            
            <div className="flex flex-col px-2 space-y-1">
              {links.map((link) => (
                <Link
                  key={`${link.path}-${link.label}`}
                  href={resolveLinkHref(link.path, link.label)}
                  className="flex items-center px-4 py-3 rounded-xl text-foreground/80 hover:text-primary hover:bg-primary/5 transition-colors font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {translateNavLabel(link.label)}
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
                      Enable Client Telegram (@{CLIENT_BOT_LABEL})
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
                      Enable Staff Telegram (@{STAFF_BOT_LABEL})
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
                    Log in
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
                    Sign Up
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
