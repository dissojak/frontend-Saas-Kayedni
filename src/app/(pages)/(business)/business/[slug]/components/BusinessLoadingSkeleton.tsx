import React from "react";

const BusinessLoadingSkeleton: React.FC = () => (
  <div className="container mx-auto px-4 py-8 max-w-5xl animate-pulse">
    <div className="mb-8 bg-card/50 border border-border/50 rounded-3xl p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6">
        <div className="space-y-3 flex-1">
          <div className="h-10 w-64 bg-muted rounded-lg" />
          <div className="flex flex-wrap gap-4">
            <div className="h-8 w-20 bg-muted rounded-full" />
            <div className="h-8 w-28 bg-muted rounded-full" />
            <div className="h-8 w-48 bg-muted rounded-full" />
          </div>
        </div>
        <div className="h-14 w-full md:w-48 bg-muted rounded-xl" />
      </div>
    </div>

    <div className="mb-12 mt-6 space-y-2">
      <div className="rounded-xl bg-muted h-[420px]" />
      <div className="grid grid-cols-6 gap-2">
        {["skel-thumb-1", "skel-thumb-2", "skel-thumb-3", "skel-thumb-4", "skel-thumb-5", "skel-thumb-6"].map((id) => (
          <div key={id} className="h-16 sm:h-20 md:h-24 rounded-lg bg-muted" />
        ))}
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
      <div className="lg:col-span-2 space-y-12">
        <div className="space-y-4">
          <div className="h-8 w-48 bg-muted rounded-lg" />
          <div className="h-4 w-full bg-muted rounded" />
          <div className="h-4 w-3/4 bg-muted rounded" />
          <div className="h-4 w-5/6 bg-muted rounded" />
        </div>
        <hr className="border-gray-200" />
        <div className="space-y-6">
          <div className="h-8 w-40 bg-muted rounded-lg" />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {["skel-team-1", "skel-team-2", "skel-team-3"].map((id) => (
              <div key={id} className="flex flex-col items-center gap-3">
                <div className="w-24 h-24 rounded-full bg-muted" />
                <div className="h-4 w-20 bg-muted rounded" />
                <div className="h-3 w-16 bg-muted rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="lg:col-span-1 space-y-6">
        <div className="h-48 bg-muted rounded-xl" />
        <div className="h-40 bg-muted rounded-xl" />
      </div>
    </div>
  </div>
);

export default BusinessLoadingSkeleton;
