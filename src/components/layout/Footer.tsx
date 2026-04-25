import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { t } from "@global/lib/dictionaryService";
import { useLocale } from "@global/hooks/useLocale";

const Footer = () => {
	const currentYear = new Date().getFullYear();
	const { locale } = useLocale();
	const translated = (key: Parameters<typeof t>[1]) => t("generic", key, locale);

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
                                src="/assets/KayedniFullLogo-Zain.png"
                                alt="kayedni"
                                width={160}
                                height={45}
                                className="brightness-0 invert" 
                            />
						</Link>
						<p className="text-gray-400 leading-relaxed text-sm">
							{translated("footer_brand_tagline")}
                        </p>
						<div className="flex gap-4 pt-2">
							<a href="https://github.com" target="_blank" rel="noreferrer" aria-label="Github" className="text-gray-400 hover:text-white transition-colors hover:scale-110 transform duration-200">
								<span className="text-xs font-semibold tracking-wide">GH</span>
							</a>
							<a href="https://x.com" target="_blank" rel="noreferrer" aria-label="Twitter" className="text-gray-400 hover:text-white transition-colors hover:scale-110 transform duration-200">
								<span className="text-xs font-semibold tracking-wide">X</span>
							</a>
							<a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="text-gray-400 hover:text-white transition-colors hover:scale-110 transform duration-200">
								<span className="text-xs font-semibold tracking-wide">IG</span>
							</a>
							<a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook" className="text-gray-400 hover:text-white transition-colors hover:scale-110 transform duration-200">
								<span className="text-xs font-semibold tracking-wide">FB</span>
							</a>
						</div>
					</div>

                    {/* Links Columns */}
					<div className="md:col-span-2 grid grid-cols-2 gap-8 md:pl-12">
						<div>
							<h5 className="text-white font-bold mb-6 text-lg tracking-tight">{translated("footer_product")}</h5>
							<ul className="space-y-4 text-gray-400 text-sm">
								<li><Link href="/features" className="hover:text-primary transition-colors">{translated("footer_features")}</Link></li>
								<li><Link href="/pricing" className="hover:text-primary transition-colors">{translated("footer_pricing")}</Link></li>
								<li><Link href="/businesses" className="hover:text-primary transition-colors">{translated("footer_find_services")}</Link></li>
								<li><Link href="/integrations" className="hover:text-primary transition-colors">{translated("footer_integrations")}</Link></li>
							</ul>
						</div>
						<div>
							<h5 className="text-white font-bold mb-6 text-lg tracking-tight">{translated("footer_company")}</h5>
							<ul className="space-y-4 text-gray-400 text-sm">
								<li><Link href="/about" className="hover:text-primary transition-colors">{translated("footer_about_us")}</Link></li>
								<li><Link href="/careers" className="hover:text-primary transition-colors">{translated("footer_careers")}</Link></li>
								<li><Link href="/blog" className="hover:text-primary transition-colors">{translated("footer_blog")}</Link></li>
								<li><Link href="/contact" className="hover:text-primary transition-colors">{translated("footer_contact")}</Link></li>
								<li><Link href="/faq" className="hover:text-primary transition-colors">{translated("footer_faq")}</Link></li>
							</ul>
						</div>
					</div>

					{/* Newsletter Column */}
					<div className="md:col-span-1">
						<h5 className="text-white font-bold mb-6 text-lg tracking-tight">{translated("footer_stay_updated")}</h5>
						<p className="text-gray-400 text-sm mb-4">{translated("footer_subscribe_desc")}</p>
						<form onSubmit={(e)=>e.preventDefault()} className="flex flex-col gap-3">
							<Input 
                                type="email" 
                                placeholder={translated("footer_email_placeholder")}
                                className="bg-zinc-900/50 border-zinc-800 text-white placeholder:text-gray-500 focus-visible:ring-primary/50" 
                            />
							<Button type="submit" variant="skeuo-primary" className="w-full">
                                {translated("footer_subscribe")}
                            </Button>
						</form>
					</div>
				</div>

				<div className="border-t border-zinc-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
					<p>&copy; {currentYear} kayedni. {translated("footer_all_rights_reserved")}</p>
                    <div className="flex gap-6">
						<Link href="/privacy" className="hover:text-white transition-colors">{translated("footer_privacy_policy")}</Link>
						<Link href="/terms" className="hover:text-white transition-colors">{translated("footer_terms_of_service")}</Link>
						<Link href="/cookies" className="hover:text-white transition-colors">{translated("footer_cookie_settings")}</Link>
                    </div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;


