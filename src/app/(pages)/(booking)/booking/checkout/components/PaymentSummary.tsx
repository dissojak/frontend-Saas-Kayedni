"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@components/ui/card';
import { Separator } from '@components/ui/separator';
import { Button } from '@components/ui/button';

type Props = {
  service: any;
  loading?: boolean;
  onConfirm: () => void;
};

export default function PaymentSummary({ service, loading, onConfirm }: Props) {
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
        <CardContent className="pt-6">
          <Button className="w-full" disabled={loading} onClick={onConfirm}>
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
