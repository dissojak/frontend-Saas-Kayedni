
"use client";

import React from "react";
import Layout from "@components/layout/Layout";
import ClientDashboard from "@components/dashboard/client/ClientDashboard";
import { useAuth } from "@/(pages)/(auth)/context/AuthContext";
import TelegramOnboardingPrompt from "@components/telegram/TelegramOnboardingPrompt";

const ClientDashboardPage = () => {
  const { user } = useAuth();

  return (
    <Layout>
      <div className="container mx-auto px-4 pt-6">
        <TelegramOnboardingPrompt
          audience="client"
          userId={user?.id}
          phone={user?.phone}
          botLabel="KayedniBot"
          botUrl="https://t.me/KayedniBot"
          firstPromptStorageKey={`telegram_onboarding:client:${user?.id}:first-booking-prompt`}
        />
      </div>
      <ClientDashboard />
    </Layout>
  );
};

export default ClientDashboardPage;
