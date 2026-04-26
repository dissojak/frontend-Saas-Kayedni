import { createBusinessSlug } from './businessSlug';

export interface BusinessQrShareParams {
  businessName: string;
  businessUrl: string;
}

export function resolveBusinessQrTargetUrl(
  business: { id: string | number; name: string },
  fallbackOrigin?: string,
): string {
  const origin = fallbackOrigin ?? (typeof globalThis !== 'undefined' && globalThis.location ? globalThis.location.origin : '');
  const normalizedOrigin = origin.replace(/\/$/, '');
  return `${normalizedOrigin}/business/${createBusinessSlug(business.name, business.id)}`;
}

export function buildBusinessQrShareText({ businessName, businessUrl }: BusinessQrShareParams): string {
  return `${businessName} - ${businessUrl}`;
}

export function buildBusinessQrShareLinks({ businessName, businessUrl }: BusinessQrShareParams) {
  const caption = buildBusinessQrShareText({ businessName, businessUrl });
  const encodedUrl = encodeURIComponent(businessUrl);
  const encodedCaption = encodeURIComponent(caption);

  return {
    whatsapp: `https://wa.me/?text=${encodedCaption}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    x: `https://twitter.com/intent/tweet?text=${encodedCaption}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedCaption}`,
  } as const;
}

export async function copyBusinessLinkToClipboard(businessUrl: string): Promise<void> {
  if (!businessUrl) {
    throw new Error('Missing business URL');
  }

  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(businessUrl);
    return;
  }

  throw new Error('Clipboard API is unavailable');
}

export async function downloadImageFromUrl(imageUrl: string, fileName: string): Promise<void> {
  const response = await fetch(imageUrl, { mode: 'cors' });
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.status}`);
  }

  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = objectUrl;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(objectUrl);
}

export function printImageFromUrl(imageUrl: string, title: string): void {
  const printWindow = globalThis.open('', '_blank', 'noopener,noreferrer,width=900,height=700');
  if (!printWindow) {
    throw new Error('Could not open print window');
  }

  const escapedTitle = title.replaceAll('<', '&lt;').replaceAll('>', '&gt;');
  const printDocument = printWindow.document;
  printDocument.title = escapedTitle;

  const style = printDocument.createElement('style');
  style.textContent = 'body { margin: 0; display: grid; place-items: center; min-height: 100vh; background: #fff; } img { max-width: 90vw; max-height: 90vh; object-fit: contain; }';
  printDocument.head.appendChild(style);

  const image = printDocument.createElement('img');
  image.id = 'qr-image';
  image.src = imageUrl;
  image.alt = escapedTitle;
  printDocument.body.appendChild(image);

  const triggerPrint = () => {
    printWindow.focus();
    printWindow.print();
  };

  if (image && !image.complete) {
    image.onload = triggerPrint;
    image.onerror = () => {
      throw new Error('Could not load image for printing');
    };
  } else {
    triggerPrint();
  }
}