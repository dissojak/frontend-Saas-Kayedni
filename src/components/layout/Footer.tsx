import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Twitter, Facebook, Instagram, Github, Mail } from "lucide-react";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";

const Footer = () => {
	const currentYear = new Date().getFullYear();

	return (
		<footer className="relative bg-zinc-950 text-gray-200 overflow-hidden pt-20 pb-10">
			{/* Decorative elements */}
			<div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
			<div className="absolute -top-[300px] -left-[300px] w-[600px] h-[600px] rounded-full bg-primary/20 blur-[120px] pointer-events-none"></div>
            <div className="absolute -bottom-[300px] -right-[300px] w-[600px] h-[600px] rounded-full bg-brand-orange/10 blur-[120px] pointer-events-none"></div>

			<div className="container mx-auto px-6 relative z-10">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
					{/* Brand Column */}
					<div className="md:col-span-1 space-y-6">
						<Link href="/" className="inline-block">
                             <Image 
                                src="/assets/KayedniFullLogo-zain.png"
                                alt="kayedni"
                                width={160}
                                height={45}
                                className="brightness-0 invert" 
                            />
						</Link>
						<p className="text-gray-400 leading-relaxed text-sm">
                            Simplifying bookings for everyone. The all-in-one platform for modern businesses and clients.
                        </p>
						<div className="flex gap-4 pt-2">
							<a href="#" aria-label="Github" className="text-gray-400 hover:text-white transition-colors hover:scale-110 transform duration-200">
								<Github size={20} />
							</a>
							<a href="#" aria-label="Twitter" className="text-gray-400 hover:text-white transition-colors hover:scale-110 transform duration-200">
								<Twitter size={20} />
							</a>
							<a href="#" aria-label="Instagram" className="text-gray-400 hover:text-white transition-colors hover:scale-110 transform duration-200">
								<Instagram size={20} />
							</a>
							<a href="#" aria-label="Facebook" className="text-gray-400 hover:text-white transition-colors hover:scale-110 transform duration-200">
								<Facebook size={20} />
							</a>
						</div>
					</div>

                    {/* Links Columns */}
					<div className="md:col-span-2 grid grid-cols-2 gap-8 md:pl-12">
						<div>
							<h5 className="text-white font-bold mb-6 text-lg tracking-tight">Product</h5>
							<ul className="space-y-4 text-gray-400 text-sm">
								<li><Link href="/features" className="hover:text-primary transition-colors">Features</Link></li>
								<li><Link href="/pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
								<li><Link href="/businesses" className="hover:text-primary transition-colors">Find Services</Link></li>
                                <li><Link href="/integrations" className="hover:text-primary transition-colors">Integrations</Link></li>
							</ul>
						</div>
						<div>
							<h5 className="text-white font-bold mb-6 text-lg tracking-tight">Company</h5>
							<ul className="space-y-4 text-gray-400 text-sm">
								<li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
								<li><Link href="/careers" className="hover:text-primary transition-colors">Careers</Link></li>
								<li><Link href="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
								<li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
                                <li><Link href="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
							</ul>
						</div>
					</div>

					{/* Newsletter Column */}
					<div className="md:col-span-1">
                        <h5 className="text-white font-bold mb-6 text-lg tracking-tight">Stay Updated</h5>
                        <p className="text-gray-400 text-sm mb-4">Subscribe to our newsletter for the latest updates and offers.</p>
						<form onSubmit={(e)=>e.preventDefault()} className="flex flex-col gap-3">
							<Input 
                                type="email" 
                                placeholder="Enter your email" 
                                className="bg-zinc-900/50 border-zinc-800 text-white placeholder:text-gray-500 focus-visible:ring-primary/50" 
                            />
							<Button type="submit" variant="skeuo-primary" className="w-full">
                                Subscribe
                            </Button>
						</form>
					</div>
				</div>

				<div className="border-t border-zinc-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
                    <p>&copy; {currentYear} kayedni. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                        <Link href="/cookies" className="hover:text-white transition-colors">Cookie Settings</Link>
                    </div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;


