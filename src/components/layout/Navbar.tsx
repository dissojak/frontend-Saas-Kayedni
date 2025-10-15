import React, { useState } from "react";
import { redirect } from "next/navigation";
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
import { Menu } from "lucide-react";

// Role-specific navigation links
const navLinks: Record<Exclude<UserRole, null>, { path: string; label: string }[]> = {
  client: [
    { path: "/", label: "Home" },
    { path: "/businesses", label: "Find Services" },
    { path: "/client/bookings", label: "My Bookings" },
  ],
  business: [
    { path: "/business/dashboard", label: "Dashboard" },
    { path: "/business/staff", label: "Staff" },
    { path: "/business/services", label: "Services" },
    { path: "/business/bookings", label: "Bookings" },
  ],
  staff: [
    { path: "/staff/dashboard", label: "Dashboard" },
    { path: "/staff/schedule", label: "My Schedule" },
    { path: "/staff/bookings", label: "Bookings" },
  ],
  admin: [
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

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Use user role links if authenticated, otherwise use default links
  const links = user && user.role ? navLinks[user.role] : defaultLinks;

  const roleColor = user?.role
    ? `text-${user.role} border-${user.role}`
    : "text-primary border-primary";

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-primary">Bookify</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-6 ml-10">
              {links.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className="text-gray-600 hover:text-primary font-medium"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {user?.role && (
                  <span className="hidden md:inline-block">
                    <span className={`role-badge role-badge-${user.role}`}>{user.role}</span>
                  </span>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative rounded-full h-8 w-8 p-0">
                      <img
                        src={user?.avatar || (user?.name ? `https://ui-avatars.com/api/?name=${user.name}` : "/assets/placeholder.svg")}
                        alt={user?.name ?? "Profile"}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="p-2">
                      <p className="font-medium">{user?.name ?? "User"}</p>
                      <p className="text-sm text-gray-500">{user?.email ?? ""}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => redirect("/profile")}>
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => redirect("/settings")}>
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => logout()}>Logout</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="hidden md:block">
                <Button variant="ghost" onClick={() => redirect("/login")}>
                  Login
                </Button>
                <Button onClick={() => redirect("/register")}>Sign Up</Button>
              </div>
            )}

            {/* Mobile menu button */}
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
          <div className="md:hidden mt-3 pb-3 border-t">
            <div className="flex flex-col space-y-3 mt-3">
              {links.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className="text-gray-600 hover:text-primary py-2 font-medium"
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
