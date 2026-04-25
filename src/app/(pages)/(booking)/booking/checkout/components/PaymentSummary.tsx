"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@components/ui/card';
import { Separator } from '@components/ui/separator';
import { Button } from '@components/ui/button';
import { RadioGroup, RadioGroupItem } from '@components/ui/radio-group';
import { Label } from '@components/ui/label';
import { Badge } from '@components/ui/badge';
import { useLocale } from '@global/hooks/useLocale';
import { bookingT } from '@/(pages)/(booking)/i18n';

type Props = {
  service: any;
  loading?: boolean;
  onConfirm: (paymentMethod: string) => void;
};

export default function PaymentSummary({ service, loading, onConfirm }: Readonly<Props>) {
  const [paymentMethod, setPaymentMethod] = useState<string>('pay_on_place');
  const { locale } = useLocale();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{bookingT(locale, 'checkout_payment_summary')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between">
            <span>{service.name}</span>
            <span>${service.price.toFixed(2)}</span>
          </div>
        </CardContent>
        <Separator className="my-2" />
        <CardFooter className="flex justify-between pt-4">
          <span className="font-bold">{bookingT(locale, 'checkout_total')}</span>
          <span className="font-bold">${service.price.toFixed(2)}</span>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{bookingT(locale, 'checkout_payment_method')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
            <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50 cursor-pointer">
              <RadioGroupItem value="pay_on_place" id="pay_on_place" />
              <Label htmlFor="pay_on_place" className="flex-1 cursor-pointer">
                <div className="font-medium">{bookingT(locale, 'checkout_pay_on_place')}</div>
                <div className="text-sm text-gray-500">{bookingT(locale, 'checkout_pay_on_place_desc')}</div>
              </Label>
            </div>

            <div className="flex items-center space-x-3 p-3 rounded-lg border bg-gray-50 opacity-60">
              <RadioGroupItem value="stripe" id="stripe" disabled />
              <Label htmlFor="stripe" className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{bookingT(locale, 'checkout_card')}</span>
                  <Badge variant="secondary" className="text-xs">{bookingT(locale, 'checkout_coming_soon')}</Badge>
                </div>
                <div className="text-sm text-gray-500">{bookingT(locale, 'checkout_card_desc')}</div>
              </Label>
            </div>

            <div className="flex items-center space-x-3 p-3 rounded-lg border bg-gray-50 opacity-60">
              <RadioGroupItem value="flouci" id="flouci" disabled />
              <Label htmlFor="flouci" className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Flouci</span>
                  <Badge variant="secondary" className="text-xs">{bookingT(locale, 'checkout_coming_soon')}</Badge>
                </div>
                <div className="text-sm text-gray-500">{bookingT(locale, 'checkout_flouci_desc')}</div>
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <Button className="w-full" disabled={loading} onClick={() => onConfirm(paymentMethod)}>
            {loading ? bookingT(locale, 'checkout_processing') : bookingT(locale, 'checkout_confirm_booking')}
          </Button>
          <p className="text-sm text-gray-500 text-center mt-4">
            {bookingT(locale, 'checkout_terms_prefix')} <a href="/terms" className="text-primary">{bookingT(locale, 'checkout_terms_link')}</a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
