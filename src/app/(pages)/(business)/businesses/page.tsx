"use client";

import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useBooking } from "@/(pages)/(booking)/context/BookingContext";

const BusinessesPage = () => {
  const { businesses } = useBooking();
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
   

  // Categories for filtering
  const categories = [
    "All",
    "Barber",
    "Education",
    "Gaming",
    "Fitness",
    "Spa",
    "Therapy",
  ];

  const [selectedCategory, setSelectedCategory] = useState("All");

  // Filter businesses based on search term and category
  const filteredBusinesses = businesses.filter((business) => {
    const matchesSearchTerm = business.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || business.category === selectedCategory;
    return matchesSearchTerm && matchesCategory;
  });

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Find Businesses</h1>

        {/* Search and Filter */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <Input
              placeholder="Search businesses..."
              className="md:w-96"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button 
              variant="outline"
              className="md:w-auto"
            >
              Advanced Filters
            </Button>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Business Listings */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBusinesses.map((business) => (
            <Card key={business.id} className="overflow-hidden card-hover">
              <div className="h-48 overflow-hidden">
                <img
                  src={business.logo}
                  alt={business.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-2">{business.name}</h2>
                <p className="text-gray-600 mb-3">{business.description}</p>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-500">{business.category}</span>
                  <div className="flex items-center">
                    <span className="text-yellow-500 mr-1">★</span>
                    <span>{business.rating}</span>
                  </div>
                </div>
                <Button 
                  className="w-full"
                  onClick={() => router.push(`/business/${business.id}`)}
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredBusinesses.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">No businesses found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your search criteria</p>
            <Button 
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("All");
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default BusinessesPage;
