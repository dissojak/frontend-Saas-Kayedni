"use client";

import React from "react";

type AuthBackdropProps = {
  children: React.ReactNode;
};

export function AuthBackdrop({ children }: Readonly<AuthBackdropProps>) {
  return (
    <div className="relative min-h-screen bg-slate-950 text-white overflow-hidden">
      <div className="auth-bg">
        <div className="auth-sphere auth-sphere-1" />
        <div className="auth-sphere auth-sphere-2" />
        <div className="auth-sphere auth-sphere-3" />
        <div className="auth-glow" />
        <div className="auth-grid" />
        <div className="auth-noise" />
        <div className="auth-particles" />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export default AuthBackdrop;
