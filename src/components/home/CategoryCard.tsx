
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@components/ui/card";

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
  const router = useRouter();

  return (
    <Card
      className="card-hover cursor-pointer"
      onClick={() => router.push(`/businesses?category=${category.id}`)}
    >
      <CardContent className="p-6 flex items-center space-x-4">
        <div className={`${category.color} h-12 w-12 rounded-full flex items-center justify-center text-xl`}>
          {category.icon}
        </div>
        <div>
          <h3 className="font-semibold text-lg">{category.name}</h3>
          <p className="text-gray-500">{category.count} businesses</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryCard;
