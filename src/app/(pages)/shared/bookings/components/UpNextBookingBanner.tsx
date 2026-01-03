import React from 'react';
import { Button } from '@components/ui/button';
import { Clock, UserCheck } from 'lucide-react';
import type { Booking } from '../types/Booking';
import type { UpNextBookingBannerProps } from '../types/UpNextBookingBannerProps';
import { formatTime } from '../utils';

export const UpNextBookingBanner: React.FC<UpNextBookingBannerProps> = ({
  booking,
  onStatusUpdate
}) => {
  return (
    <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 dark:from-amber-500/20 dark:via-orange-500/20 dark:to-amber-500/20 border-2 border-amber-500/30 rounded-2xl p-6 sm:p-8">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400 animate-pulse" />
        <span className="text-amber-600 dark:text-amber-400 font-bold text-sm uppercase tracking-wider">Up Next</span>
        <span className="bg-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-bold px-2 py-1 rounded-full">
          Starting Soon
        </span>
      </div>
      
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
        <div className="flex items-center gap-4 flex-1">
          <div className="w-14 h-14 rounded-xl bg-amber-500/20 flex items-center justify-center">
            <span className="text-xl font-bold text-amber-600 dark:text-amber-400">{booking.clientName.charAt(0)}</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">{booking.clientName}</h3>
            <p className="text-muted-foreground">{booking.serviceName}</p>
            <p className="text-amber-600 dark:text-amber-400 font-semibold">{formatTime(booking.startTime)} - {formatTime(booking.endTime)}</p>
          </div>
        </div>
        
        {booking.status.toLowerCase() === 'pending' && (
          <Button
            size="lg"
            className="bg-amber-500 hover:bg-amber-600 text-white font-bold h-12 px-6 rounded-xl"
            onClick={() => onStatusUpdate(booking.id, 'CONFIRMED')}
          >
            <UserCheck className="w-5 h-5 mr-2" />
            Confirm Booking
          </Button>
        )}
      </div>
    </div>
  );
};
