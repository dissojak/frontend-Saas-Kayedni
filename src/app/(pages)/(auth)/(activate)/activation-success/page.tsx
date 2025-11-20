"use client";

import React from 'react';
import Link from 'next/link';
import Layout from '@components/layout/Layout';
import { Button } from '@components/ui/button';

export default function ActivationSuccess() {
	return (
		<Layout>
			<div className="min-h-[60vh] flex items-center justify-center">
				<div className="max-w-xl w-full bg-white shadow-md rounded-lg p-10 text-center">
					<div className="mx-auto inline-flex items-center justify-center h-24 w-24 rounded-full bg-green-50 mb-6">
						<svg className="h-12 w-12 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
							<path d="M20 6L9 17l-5-5" />
						</svg>
					</div>
					<h1 className="text-2xl font-semibold mb-2">Account Activated</h1>
					<p className="text-gray-600 mb-6">Your account has been successfully activated. You can now log in and start booking services.</p>

					<div className="flex flex-col sm:flex-row gap-3 justify-center">
						<Link href="/login" className="w-full sm:w-auto">
							<Button className="w-full">Go to Login</Button>
						</Link>
						<Link href="/" className="w-full sm:w-auto">
							<Button variant="outline" className="w-full">Return Home</Button>
						</Link>
					</div>
				</div>
			</div>
		</Layout>
	);
}
