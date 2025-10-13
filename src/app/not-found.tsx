"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Custom404() {
  const [homeUrl, setHomeUrl] = useState(
    process.env.NODE_ENV === "production" ? "https://stoonproduction.com" : "/", // fallback until window is available
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      const origin = window.location.origin.replace("admin.", "");
      setHomeUrl(origin);
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-100 via-gray-200 to-gray-300 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
      <div className="relative mb-10 mt-40 ">
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-teal-400 rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-purple-500 rounded-full opacity-30 animate-pulse"></div>
        <h1 className="text-9xl font-extrabold text-teal-600 dark:text-teal-400 z-10">404</h1>
      </div>

      <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">
        Oops! Page Not Found
      </h2>
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-md text-center">
        The page you&apos;re looking for doesn&apos;t exist or may have moved. Try heading back to
        the home page.
      </p>

      <Link href={homeUrl}>
        <span className="inline-block bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 cursor-pointer">
          Go Home
        </span>
      </Link>

      <div className="mt-12 text-gray-400 dark:text-gray-500 text-sm">
        If you think this is an error, contact us at{" "}
        <a href="mailto:contact@stoonproduction.com" className="underline hover:text-teal-600">
          contact@stoonproduction.com
        </a>
      </div>
    </div>
  );
}
