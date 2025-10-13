"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { LoginViewProps } from "../types/index";
import Link from "next/link";
import { UserRole } from "../../types";

export default function LoginView({
  email,
  setEmail,
  password,
  setPassword,
  role,
  setRole,
  loading,
  error,
  onSubmit,
}: Readonly<LoginViewProps>) {
  let submitClass, color: string;
 
  switch (role) {
    case "client":
      submitClass = "bg-client text-white";
      color = "text-client";
      break;
    case "business":
      submitClass = "bg-business text-white";
      color = "text-business";
      break;
    case "staff":
      submitClass = "bg-staff text-white";
      color = "text-staff";
      break;
    case "admin":
    default:
      submitClass = "bg-admin text-white";
      color = "text-admin";
  }

  return (
    <>
      {error && (
        <div
          className="bg-red-50 text-red-600 p-3 rounded-md mb-4"
          role="alert"
          aria-live="assertive"
        >
          {error}
        </div>
      )}

      <Tabs defaultValue={role} onValueChange={(v) => setRole(v as UserRole)} className="mb-6">
        <TabsList className="mb-2 grid grid-cols-4">
          <TabsTrigger
            value="client"
            className="data-[state=active]:bg-client data-[state=active]:text-white"
          >
            Client
          </TabsTrigger>
          <TabsTrigger
            value="business"
            className="data-[state=active]:bg-business data-[state=active]:text-white"
          >
            Business
          </TabsTrigger>
          <TabsTrigger
            value="staff"
            className="data-[state=active]:bg-staff data-[state=active]:text-white"
          >
            Staff
          </TabsTrigger>
          <TabsTrigger
            value="admin"
            className="data-[state=active]:bg-admin data-[state=active]:text-white"
          >
            Admin
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          void onSubmit();
        }}
        className="space-y-4"
      >
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="mail@example.com"
            required
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link href="/forgot-password" className={`text-sm ${color} hover:underline`}>
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="••••••••"
            required
          />
        </div>

        <input type="hidden" name="role" value={role} />

        <Button type="submit" disabled={loading} className={`w-full ${submitClass}`}>
          {loading ? "Signing in..." : "Sign In"}
        </Button>
      </form>
    </>
  );
}
