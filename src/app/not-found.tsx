"use client";

import Link from 'next/link';

export default function Custom404() {
  // Simpler, project-consistent 404: link to the app root and provide contact info
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-primary/5 via-primary/3 to-white dark:from-slate-900 dark:via-slate-800 p-6">
      <div className="relative mb-8">
        <div className="mb-6">
          <h1 className="text-7xl md:text-9xl font-extrabold text-primary">404</h1>
        </div>
        <p className="text-xl md:text-2xl font-semibold text-muted-foreground">Page not found</p>
      </div>

      <div className="max-w-xl text-center">
        <h2 className="text-2xl font-bold mb-2">We couldn't find that page.</h2>
        <p className="text-gray-600 mb-6">The link may be broken or the page may have been removed. Try going back to the home page or contact support.</p>

        <div className="flex justify-center gap-4">
          <Link href="/" className="inline-block bg-primary text-white font-semibold py-2 px-6 rounded shadow hover:opacity-95">Home</Link>
          <Link href="/contact" className="inline-block border border-primary text-primary font-semibold py-2 px-6 rounded hover:bg-primary/5">Contact</Link>
        </div>

        <p className="text-sm text-gray-500 mt-6">If you think this is an error, email <a href="mailto:contact@kayedni.com" className="underline">contact@kayedni.com</a></p>
      </div>
    </div>
  );
}
