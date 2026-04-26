"use client";

import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@components/ui/dialog';
import { Button } from '@components/ui/button';
import { useLocale } from '@global/hooks/useLocale';
import { useToast } from '@global/hooks/use-toast';
import type { Business } from '@/(pages)/(business)/businesses/types/business';
import {
	buildBusinessQrShareLinks,
	copyBusinessLinkToClipboard,
	downloadImageFromUrl,
	printImageFromUrl,
	resolveBusinessQrTargetUrl,
} from '@global/lib/businessQr';
import { businessQrT } from '@global/lib/i18n/businessQr';
import {
	Copy,
	Download,
	ExternalLink,
	MessageCircle,
	Printer,
	QrCode,
	Send,
	Share2,
} from 'lucide-react';

interface BusinessQrDialogProps {
	readonly open: boolean;
	readonly onOpenChange: (open: boolean) => void;
	readonly business: Pick<Business, 'id' | 'name' | 'qrCodeUrl' | 'qrUpdatedAt'> | null;
}

function buildQrFileName(businessName: string): string {
	const slug = businessName
		.toLowerCase()
		.trim()
		.replaceAll(/[^a-z0-9]+/g, '-')
		.replaceAll(/-+/g, '-')
		.replace(/^-/, '')
		.replace(/-$/, '');

	return `${slug || 'business'}-qr.png`;
}

export default function BusinessQrDialog({ open, onOpenChange, business }: BusinessQrDialogProps) {
	const { locale } = useLocale();
	const { toast } = useToast();

	const qrTitle = businessQrT(locale, 'dialog_title');
	const qrDescription = businessQrT(locale, 'dialog_description');
	const qrUnavailable = businessQrT(locale, 'dialog_unavailable');
	const targetLabel = businessQrT(locale, 'dialog_target_label');
	const updatedLabel = businessQrT(locale, 'dialog_updated_label');
	const imageAlt = businessQrT(locale, 'dialog_image_alt', { name: business?.name ?? '' });

	const businessUrl = business ? resolveBusinessQrTargetUrl(business) : '';
	const shareLinks = business && businessUrl
		? buildBusinessQrShareLinks({ businessName: business.name, businessUrl })
		: null;

	const qrAvailable = Boolean(business?.qrCodeUrl);
	const canUseBusinessUrl = Boolean(businessUrl);

	const handleCopyLink = async () => {
		if (!businessUrl) {
			return;
		}

		try {
			await copyBusinessLinkToClipboard(businessUrl);
			toast({ title: businessQrT(locale, 'toast_link_copied') });
		} catch (error) {
			console.error('Business QR copy failed:', error);
			toast({ title: businessQrT(locale, 'toast_link_copy_failed'), variant: 'destructive' });
		}
	};

	const handleDownload = async () => {
		if (!business?.qrCodeUrl) {
			return;
		}

		try {
			await downloadImageFromUrl(business.qrCodeUrl, buildQrFileName(business.name));
		} catch (error) {
			console.error('Business QR download failed:', error);
			toast({ title: businessQrT(locale, 'toast_download_failed'), variant: 'destructive' });
		}
	};

	const handlePrint = () => {
		if (!business?.qrCodeUrl) {
			return;
		}

		try {
			printImageFromUrl(business.qrCodeUrl, business.name);
		} catch (error) {
			console.error('Business QR print failed:', error);
			toast({ title: businessQrT(locale, 'toast_print_failed'), variant: 'destructive' });
		}
	};

	const openShareLink = (url: string) => {
		const shareWindow = globalThis.open(url, '_blank', 'noopener,noreferrer');
		if (!shareWindow) {
			toast({ title: businessQrT(locale, 'toast_share_failed'), variant: 'destructive' });
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-3xl">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2 text-xl">
						<QrCode className="h-5 w-5 text-primary" />
						{qrTitle}
					</DialogTitle>
					<DialogDescription>{qrDescription}</DialogDescription>
				</DialogHeader>

				{business ? (
					<div className="grid gap-6 md:grid-cols-[240px_1fr]">
						<div className="rounded-3xl border border-border bg-gradient-to-b from-background to-muted/30 p-4 shadow-sm">
							<div className="rounded-2xl border border-border/60 bg-white p-4 shadow-inner">
								{qrAvailable ? (
									<img
										src={business.qrCodeUrl}
										alt={imageAlt}
										className="aspect-square w-full rounded-xl object-contain"
									/>
								) : (
									<div className="flex aspect-square items-center justify-center rounded-xl border border-dashed border-border bg-muted/40 text-center">
										<div className="space-y-2 px-4">
											<QrCode className="mx-auto h-10 w-10 text-muted-foreground/70" />
											<p className="text-sm font-medium text-foreground">{qrUnavailable}</p>
										</div>
									</div>
								)}
							</div>
							{business.qrUpdatedAt && (
								<p className="mt-3 text-xs text-muted-foreground">
									{updatedLabel}: {new Date(business.qrUpdatedAt).toLocaleString(locale)}
								</p>
							)}
						</div>

						<div className="space-y-5">
							<div className="rounded-3xl border border-border bg-muted/20 p-4">
								<div className="flex items-center gap-2 text-sm font-semibold text-foreground">
									<Share2 className="h-4 w-4 text-primary" />
									{business.name}
								</div>
								<p className="mt-2 text-sm text-muted-foreground">{targetLabel}</p>
								<p className="mt-1 break-all rounded-2xl bg-background px-3 py-2 text-sm text-foreground shadow-sm">
									{businessUrl || qrUnavailable}
								</p>
							</div>

							<div className="grid gap-3 sm:grid-cols-2">
								<Button variant="outline" className="h-11 justify-start rounded-xl" onClick={handleCopyLink} disabled={!canUseBusinessUrl}>
									<Copy className="h-4 w-4" />
									{businessQrT(locale, 'action_copy_link')}
								</Button>
								<Button variant="outline" className="h-11 justify-start rounded-xl" onClick={handleDownload} disabled={!qrAvailable}>
									<Download className="h-4 w-4" />
									{businessQrT(locale, 'action_download')}
								</Button>
								<Button variant="outline" className="h-11 justify-start rounded-xl" onClick={handlePrint} disabled={!qrAvailable}>
									<Printer className="h-4 w-4" />
									{businessQrT(locale, 'action_print')}
								</Button>
								<Button variant="outline" className="h-11 justify-start rounded-xl" asChild disabled={!canUseBusinessUrl}>
									<a href={businessUrl || '#'} target="_blank" rel="noreferrer">
										<ExternalLink className="h-4 w-4" />
										{businessQrT(locale, 'action_open_link')}
									</a>
								</Button>
							</div>

							{shareLinks && (
								<div className="space-y-3">
									<p className="text-sm font-semibold text-foreground">{businessQrT(locale, 'action_share_business')}</p>
									<div className="flex flex-wrap gap-2">
										<Button type="button" variant="secondary" size="sm" className="rounded-full" onClick={() => openShareLink(shareLinks.whatsapp)}>
											<MessageCircle className="h-4 w-4" />
											{businessQrT(locale, 'share_whatsapp')}
										</Button>
										<Button type="button" variant="secondary" size="sm" className="rounded-full" onClick={() => openShareLink(shareLinks.facebook)}>
											<Share2 className="h-4 w-4" />
											{businessQrT(locale, 'share_facebook')}
										</Button>
										<Button type="button" variant="secondary" size="sm" className="rounded-full" onClick={() => openShareLink(shareLinks.x)}>
											<Share2 className="h-4 w-4" />
											{businessQrT(locale, 'share_x')}
										</Button>
										<Button type="button" variant="secondary" size="sm" className="rounded-full" onClick={() => openShareLink(shareLinks.telegram)}>
											<Send className="h-4 w-4" />
											{businessQrT(locale, 'share_telegram')}
										</Button>
									</div>
								</div>
							)}
						</div>
					</div>
				) : (
					<div className="rounded-2xl border border-dashed border-border bg-muted/20 p-6 text-sm text-muted-foreground">
						{qrUnavailable}
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
}
