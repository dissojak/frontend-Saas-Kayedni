"use client";

import { Suspense } from "react";
import Index from "@/Index";

export default function HomePage() {
  return (
    <Suspense fallback={null}>
      <Index />
    </Suspense>
  );
}