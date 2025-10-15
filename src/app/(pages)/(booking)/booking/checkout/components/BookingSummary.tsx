"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { TimeSlot } from '../types';
import { formatTimeSlot } from '../utils/format';

type Props = {
  business: any;
  service: any;
  staff: any;
  date: Date;
  timeSlot: TimeSlot;
};

export default function BookingSummary({ business, service, staff, date, timeSlot }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Booking Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center">
          <div className="w-16 h-16 rounded overflow-hidden mr-4">
            <img src={business.logo} alt={business.name} className="w-full h-full object-cover" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">{business.name}</h3>
            <p className="text-gray-500">{business.address}</p>
          </div>
        </div>

        <Separator />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-gray-500">Service</h4>
            <p>{service.name}</p>
            <p className="text-sm">{service.duration} minutes</p>
          </div>

          <div>
            <h4 className="font-medium text-gray-500">Staff</h4>
            <div className="flex items-center">
              <img src={staff.avatar} alt={staff.name} className="w-8 h-8 rounded-full mr-2" />
              <span>{staff.name}</span>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-500">Date</h4>
            <p>{date.toDateString()}</p>
          </div>

          <div>
            <h4 className="font-medium text-gray-500">Time</h4>
            <p>{formatTimeSlot(timeSlot.startTime)} - {formatTimeSlot(timeSlot.endTime)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
