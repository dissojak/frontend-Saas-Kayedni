import React from "react";
import { Button } from "@components/ui/button";

interface BusinessNotFoundProps {
  onBack: () => void;
}

const BusinessNotFound: React.FC<BusinessNotFoundProps> = ({ onBack }) => (
  <div className="container mx-auto px-4 py-12 text-center">
    <h1 className="text-3xl font-bold mb-4">Business Not Found</h1>
    <p className="text-gray-600 mb-8">The business you're looking for doesn't exist or has been removed.</p>
    <Button onClick={onBack}>Back to Businesses</Button>
  </div>
);

export default BusinessNotFound;
