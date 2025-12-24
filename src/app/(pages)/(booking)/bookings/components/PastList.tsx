"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@components/ui/card';
import { Button } from '@components/ui/button';
import { createBusinessSlug } from '@global/lib/businessSlug';
import type { Booking } from '../types';

type Props = {
  items: Booking[];
  getService: (id: string) => any;
  getBusinessName: (id: string) => string;
  getStaffName: (id: string) => string;
  formatDate: (d: Date | string) => string;
  formatTime: (d: Date | string) => string;
};

export default function PastList({ items, getService, getBusinessName, getStaffName, formatDate, formatTime }: Props) {
  const router = useRouter();

  return (
    <div className="space-y-4">
      {items.map((booking) => {
        const service = getService(booking.serviceId);
        const businessName = getBusinessName(booking.businessId);
        const businessSlug = createBusinessSlug(businessName, booking.businessId);
        return (
          <Card key={booking.id} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row justify-between">
                <div className="mb-4 md:mb-0">
                  <h3 className="font-bold text-lg">{businessName}</h3>
                  <p>{service.name} with {getStaffName(booking.staffId)}</p>
                  <div className="flex flex-col md:flex-row md:items-center mt-2 md:space-x-4">
                    <p className="text-gray-600">{formatDate(booking.date)}</p>
                    <p className="text-gray-600">{formatTime(booking.startTime)} - {formatTime(booking.endTime)}</p>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${booking.status === 'completed' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-lg font-semibold mb-2">${service.price.toFixed(2)}</p>
                  <div className="flex space-x-3">
                    {booking.status === 'completed' && <Button variant="outline" size="sm">Leave Review</Button>}
                    <Button variant="secondary" size="sm" onClick={() => router.push(`/business/${businessSlug}`)}>Book Again</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
