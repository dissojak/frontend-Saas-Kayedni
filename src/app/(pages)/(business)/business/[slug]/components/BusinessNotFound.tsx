import React from "react";
import { Button } from "@components/ui/button";
import { useLocale } from "@global/hooks/useLocale";
import { businessDetailT } from "../i18n";

interface BusinessNotFoundProps {
  onBack: () => void;
}

const BusinessNotFound: React.FC<BusinessNotFoundProps> = ({ onBack }) => {
  const { locale } = useLocale();
  const t = (key: Parameters<typeof businessDetailT>[1], params?: Record<string, string | number>) =>
    businessDetailT(locale, key, params);

  return (
    <div className="container mx-auto px-4 py-12 text-center">
      <h1 className="text-3xl font-bold mb-4">{t("business_not_found_title")}</h1>
      <p className="text-gray-600 mb-8">{t("business_not_found_desc")}</p>
      <Button onClick={onBack}>{t("back_to_businesses")}</Button>
    </div>
  );
};

export default BusinessNotFound;
