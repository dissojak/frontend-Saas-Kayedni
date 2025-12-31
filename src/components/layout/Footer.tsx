import React from "react";
import Link from "next/link";
import { Twitter, Facebook, Instagram, Github, Mail } from "lucide-react";

const Footer = () => {
	const currentYear = new Date().getFullYear();

	return (
		<footer className="relative bg-zinc-900 text-gray-200 overflow-hidden">
			{/* Decorative arcs - positioned to the right */}
			<div className="pointer-events-none absolute -right-40 -top-40 w-[900px] h-[900px] rounded-full bg-gradient-to-br from-zinc-800/60 to-zinc-700/30 opacity-60"></div>
			<div className="pointer-events-none absolute -right-20 top-20 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-zinc-800/40 to-transparent opacity-40"></div>

			<div className="container mx-auto px-6 py-16 relative z-10">
				<div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
					{/* Left column: brand + vertical social */}
					<div className="md:col-span-4 flex flex-col md:flex-row md:items-start">
						<div className="flex-shrink-0">
							<Link href="/" className="inline-block">
								<span className="text-3xl font-extrabold text-white">Bookify</span>
							</Link>
							<p className="mt-4 text-gray-300 max-w-[220px]">A modern booking platform designed for great user experiences.</p>
						</div>

						<div className="mt-6 md:mt-0 md:ml-6 flex md:flex-col items-center md:items-start space-x-4 md:space-x-0 md:space-y-4">
							<a href="#" aria-label="GitHub" className="p-2 rounded-full bg-zinc-800 hover:bg-zinc-700 transition-colors">
								<Github size={18} />
							</a>
							<a href="#" aria-label="Twitter" className="p-2 rounded-full bg-zinc-800 hover:bg-zinc-700 transition-colors">
								<Twitter size={18} />
							</a>
							<a href="#" aria-label="Instagram" className="p-2 rounded-full bg-zinc-800 hover:bg-zinc-700 transition-colors">
								<Instagram size={18} />
							</a>
							<a href="#" aria-label="Facebook" className="p-2 rounded-full bg-zinc-800 hover:bg-zinc-700 transition-colors">
								<Facebook size={18} />
							</a>
						</div>
					</div>

					{/* Middle columns: For Clients & For Businesses */}
					<div className="md:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-8">
						<div>
							<h5 className="text-white font-semibold mb-3">For Clients</h5>
							<ul className="space-y-2 text-gray-300">
								<li><Link href="/businesses" className="hover:text-white">Find services</Link></li>
								<li><Link href="/client/bookings" className="hover:text-white">My bookings</Link></li>
								<li><Link href="/help" className="hover:text-white">Help center</Link></li>
								<li><Link href="/how-it-works" className="hover:text-white">How it works</Link></li>
								<li><Link href="/reviews" className="hover:text-white">Reviews & ratings</Link></li>
							</ul>
						</div>

						<div>
							<h5 className="text-white font-semibold mb-3">For Businesses</h5>
							<ul className="space-y-2 text-gray-300">
								<li><Link href="/business/register" className="hover:text-white">Register your business</Link></li>
								<li><Link href="/business/pricing" className="hover:text-white">Pricing & plans</Link></li>
								<li><Link href="/business/resources" className="hover:text-white">Resources</Link></li>
								<li><Link href="/business/features" className="hover:text-white">Point of sale</Link></li>
								<li><Link href="/business/integrations" className="hover:text-white">Integrations</Link></li>
							</ul>
						</div>
					</div>

					{/* Right column: Business pricing snippet + newsletter */}
					<div className="md:col-span-3 flex flex-col items-start md:items-end">
						<div className="w-full md:w-72 text-left md:text-right">
							<div className="bg-zinc-800/40 rounded-lg p-4">
								<h6 className="text-white font-semibold">Business plan</h6>
								<p className="text-gray-300 mt-2 text-sm">Start taking bookings, manage staff and payments.</p>
								<div className="mt-4 flex items-baseline justify-between">
									<div>
										<div className="text-2xl font-bold">Free</div>
										<div className="text-xs text-gray-400">Forever plan for basic businesses</div>
									</div>
									<div>
										<Link href="/business/pricing" className="inline-block px-3 py-2 bg-primary rounded-md text-white">See plans</Link>
									</div>
								</div>
							</div>

							<div className="mt-6">
								<h5 className="text-white font-semibold mb-3">Stay connected</h5>
								<form onSubmit={(e)=>e.preventDefault()} className="flex gap-2">
									<input aria-label="Email" type="email" placeholder="Email address" className="flex-1 px-3 py-2 rounded-lg bg-zinc-800 text-gray-200 placeholder-gray-400 outline-none" />
									<button className="px-4 py-2 rounded-lg bg-primary text-white hover:opacity-95">Join</button>
								</form>

								<div className="mt-4 flex items-center justify-end gap-3">
									<button className="text-sm text-white font-semibold">En</button>
									<button className="text-sm text-gray-400">Es</button>
									<button className="text-sm text-gray-400">Fr</button>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="mt-12 border-t border-zinc-800 pt-6 text-sm text-gray-500 flex flex-col md:flex-row items-center justify-between">
					<div>© {currentYear} Bookify. All rights reserved.</div>
					<div className="mt-3 md:mt-0 flex gap-6">
						<Link href="#" className="hover:text-white">Privacy</Link>
						<Link href="#" className="hover:text-white">Terms</Link>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;

