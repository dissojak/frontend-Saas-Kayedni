"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import { Menu, Sun, Moon } from "lucide-react";

// Role-specific navigation links (keys now use uppercase to match backend/user role values)
const navLinks: Record<Exclude<UserRole, null>, { path: string; label: string }[]> = {
  CLIENT: [
    { path: "/", label: "Home" },
    { path: "/businesses", label: "Find Services" },
    { path: "/client/bookings", label: "My Bookings" },
  ],
  BUSINESS_OWNER: [
    { path: "/business/dashboard", label: "Dashboard" },
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

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // initialize theme from localStorage or existing html class
    try {
      const stored = localStorage.getItem("theme");
      const prefersDark = stored === "dark" || (!stored && document.documentElement.classList.contains("dark"));
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
      const nowDark = !html.classList.contains("dark");
      if (nowDark) {
        html.classList.add("dark");
        localStorage.setItem("theme", "dark");
        setIsDark(true);
      } else {
        html.classList.remove("dark");
        localStorage.setItem("theme", "light");
        setIsDark(false);
      }
    } catch (e) {
      console.warn("Failed to toggle theme:", e);
    }
  };

  // Use the user.role (now uppercase) to look up navLinks; fall back to defaultLinks.
  const roleKey = user?.role ? String(user.role).toUpperCase() as keyof typeof navLinks : null;
  const links = roleKey && navLinks[roleKey] ? navLinks[roleKey] : defaultLinks;

  return (
    <nav className="bg-white dark:bg-zinc-900 shadow-sm sticky top-0 z-50 transition-colors">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-primary dark:text-primary-light">Bookify</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-6 ml-10">
              {links.map((link) => 
                <Link
                  key={link.path}
                  href={link.path}
                  className="text-gray-600 dark:text-gray-200 hover:text-primary dark:hover:text-primary font-medium transition-colors"
                >
                  {link.label}
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {user && (
                  <div className="hidden md:flex md:flex-col md:items-end md:text-right md:mr-2">
                    <span className="text-sm text-gray-800 dark:text-gray-200 font-medium leading-tight">{user.name ?? user.email?.split('@')[0]}</span>
                    <span className={`text-xs text-gray-500 dark:text-gray-400 mt-0.5 role-badge role-badge-${String(user.role).toLowerCase()}`}>{user.role}</span>
                  </div>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative rounded-full h-8 w-8 p-0 hover:bg-transparent">
                      <img
                        src={user?.avatar || (user?.name ? `https://ui-avatars.com/api/?name=${user.name}` : "/assets/placeholder.svg")}
                        alt={user?.name ?? "Profile"}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-white dark:bg-zinc-800 dark:text-gray-100">
                    <div className="p-2">
                      <p className="font-medium">{user?.name ?? "User"}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-300">{user?.email ?? ""}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => router.push("/profile")}>
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push("/settings")}>
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => logout()}>Logout</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="hidden md:block">
                <Button variant="ghost" onClick={() => router.push("/login")}>
                  Login
                </Button>
                <Button onClick={() => router.push("/register")}>Sign Up</Button>
              </div>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
              aria-pressed={isDark}
              className="transition-colors"
            >
              {isDark ? <Sun className="text-yellow-400" /> : <Moon className="text-gray-600" />}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
              <div className="md:hidden mt-3 pb-3 border-t dark:border-zinc-700">
            <div className="flex flex-col space-y-3 mt-3">
              {links.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className="text-gray-600 dark:text-gray-200 hover:text-primary dark:hover:text-primary py-2 font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              {!isAuthenticated && (
                <>
                  <Link
                    href="/login"
                    className="text-gray-600 hover:text-primary py-2 font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="text-primary py-2 font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
