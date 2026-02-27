
"use client";

import React from "react";
import Link from "next/link";
import { useTracking } from "@global/hooks/useTracking";

interface CategoryCardProps {
  category: {
    id: string;
    name: string;
    icon: string;
    count: number;
    color: string;
  };
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  const { trackEvent } = useTracking();

  return (
    <Link
      href={`/businesses?category=${category.id}`}
      className="group relative block overflow-hidden rounded-2xl bg-card border border-border/50 p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-primary/50"
      onClick={() => trackEvent('category_browsed', { categoryId: category.id, categoryName: category.name, source: 'home' })}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative z-10 flex items-center gap-4">
        <div className={`h-14 w-14 rounded-2xl flex items-center justify-center text-2xl shadow-inner ${category.color.includes('bg-') ? category.color : 'bg-primary/10 text-primary'} group-hover:scale-110 transition-transform duration-300`}>
          {category.icon}
        </div>
        
        <div className="flex-1">
          <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">{category.name}</h3>
          <p className="text-sm text-muted-foreground font-medium">{category.count} businesses</p>
        </div>

        <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
