"use client";

import React from 'react';
import { Card, CardContent } from '@components/ui/card';
import { Button } from '@components/ui/button';
import type { Booking } from '../types';

type Props = {
  items: Booking[];
  getService: (id: string) => any;
  getBusinessName: (id: string) => string;
  getStaffName: (id: string) => string;
  formatDate: (d: Date | string) => string;
  formatTime: (d: Date | string) => string;
  cancellingId: string | null;
  onCancel: (id: string) => void;
};

export default function UpcomingList({ items, getService, getBusinessName, getStaffName, formatDate, formatTime, cancellingId, onCancel }: Props) {
  return (
    <div className="space-y-4">
      {items.map((booking) => {
        const service = getService(booking.serviceId);
        return (
          <Card key={booking.id} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row justify-between">
                <div className="mb-4 md:mb-0">
                  <h3 className="font-bold text-lg">{getBusinessName(booking.businessId)}</h3>
                  <p>{service.name} with {getStaffName(booking.staffId)}</p>
                  <div className="flex flex-col md:flex-row md:items-center mt-2 md:space-x-4">
                    <p className="text-gray-600">{formatDate(booking.date)}</p>
                    <p className="text-gray-600">{formatTime(booking.startTime)} - {formatTime(booking.endTime)}</p>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-lg font-semibold mb-2">${service.price.toFixed(2)}</p>
                  <div className="flex space-x-3">
                    <Button variant="outline" size="sm">Reschedule</Button>
                    <Button variant="destructive" size="sm" disabled={cancellingId === booking.id} onClick={() => onCancel(booking.id)}>
                      {cancellingId === booking.id ? 'Cancelling...' : 'Cancel'}
                    </Button>
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
