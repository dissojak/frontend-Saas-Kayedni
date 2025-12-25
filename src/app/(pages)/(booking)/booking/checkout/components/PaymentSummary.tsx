"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@components/ui/card';
import { Separator } from '@components/ui/separator';
import { Button } from '@components/ui/button';
import { RadioGroup, RadioGroupItem } from '@components/ui/radio-group';
import { Label } from '@components/ui/label';
import { Badge } from '@components/ui/badge';

type Props = {
  service: any;
  loading?: boolean;
  onConfirm: (paymentMethod: string) => void;
};

export default function PaymentSummary({ service, loading, onConfirm }: Props) {
  const [paymentMethod, setPaymentMethod] = useState<string>('pay_on_place');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Payment Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between">
            <span>{service.name}</span>
            <span>${service.price.toFixed(2)}</span>
          </div>
        </CardContent>
        <Separator className="my-2" />
        <CardFooter className="flex justify-between pt-4">
          <span className="font-bold">Total</span>
          <span className="font-bold">${service.price.toFixed(2)}</span>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
            <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50 cursor-pointer">
              <RadioGroupItem value="pay_on_place" id="pay_on_place" />
              <Label htmlFor="pay_on_place" className="flex-1 cursor-pointer">
                <div className="font-medium">Pay on Place</div>
                <div className="text-sm text-gray-500">Pay when you arrive at the location</div>
              </Label>
            </div>

            <div className="flex items-center space-x-3 p-3 rounded-lg border bg-gray-50 opacity-60">
              <RadioGroupItem value="stripe" id="stripe" disabled />
              <Label htmlFor="stripe" className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Credit/Debit Card</span>
                  <Badge variant="secondary" className="text-xs">Coming Soon</Badge>
                </div>
                <div className="text-sm text-gray-500">Pay securely with Stripe</div>
              </Label>
            </div>

            <div className="flex items-center space-x-3 p-3 rounded-lg border bg-gray-50 opacity-60">
              <RadioGroupItem value="flouci" id="flouci" disabled />
              <Label htmlFor="flouci" className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Flouci</span>
                  <Badge variant="secondary" className="text-xs">Coming Soon</Badge>
                </div>
                <div className="text-sm text-gray-500">Pay with Flouci mobile wallet</div>
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <Button className="w-full" disabled={loading} onClick={() => onConfirm(paymentMethod)}>
            {loading ? 'Processing...' : 'Confirm Booking'}
          </Button>
          <p className="text-sm text-gray-500 text-center mt-4">
            By confirming, you agree to our <a href="/terms" className="text-primary">Terms of Service</a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
