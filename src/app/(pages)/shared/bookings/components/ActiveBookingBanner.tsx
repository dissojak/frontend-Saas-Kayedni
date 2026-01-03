import React from 'react';
import { Button } from '@components/ui/button';
import { 
  Clock, 
  CheckCircle, 
  UserCheck, 
  Ban, 
  XCircle, 
  Phone, 
  Mail,
  DollarSign 
} from 'lucide-react';
import type { Booking } from '../types/Booking';
import type { ActiveBookingBannerProps } from '../types/ActiveBookingBannerProps';
import { formatTime } from '../utils';

export const ActiveBookingBanner: React.FC<ActiveBookingBannerProps> = ({
  booking,
  onStatusUpdate,
  onCancel,
  onMarkNoShow
}) => {
  return (
    <div className="relative">
      {/* Glow effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 via-primary to-emerald-500 rounded-3xl blur-lg opacity-30 animate-pulse"></div>
      
      <div className="relative bg-gradient-to-br from-emerald-500 to-emerald-600 dark:from-emerald-600 dark:to-emerald-700 rounded-2xl shadow-2xl overflow-hidden">
        {/* Live indicator bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-white/30">
          <div className="h-full bg-white animate-pulse"></div>
        </div>
        
        <div className="p-6 sm:p-8">
          {/* NOW Badge */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
              </span>
              <span className="text-white font-bold text-sm uppercase tracking-wider">In Session Now</span>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center gap-6">
            {/* Client Info - Large & Clear */}
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <span className="text-2xl sm:text-3xl font-bold text-white">{booking.clientName.charAt(0)}</span>
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white">{booking.clientName}</h2>
                  <p className="text-white/80 text-lg">{booking.serviceName}</p>
                </div>
              </div>
              
              {/* Contact Quick Actions */}
              <div className="flex flex-wrap gap-3 mb-4">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2">
                  <Mail className="w-4 h-4 text-white/70" />
                  <span className="text-white/90 text-sm">{booking.clientEmail}</span>
                </div>
                {booking.clientPhone && (
                  <a 
                    href={`tel:${booking.clientPhone}`} 
                    className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 hover:bg-white/20 transition-colors cursor-pointer"
                  >
                    <Phone className="w-4 h-4 text-white/70" />
                    <span className="text-white/90 text-sm">{booking.clientPhone}</span>
                  </a>
                )}
              </div>
              
              {/* Time & Price */}
              <div className="flex flex-wrap items-center gap-4 text-white/90">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span className="text-lg font-semibold">{formatTime(booking.startTime)} - {formatTime(booking.endTime)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  <span className="text-lg font-semibold">${booking.price.toFixed(2)}</span>
                </div>
              </div>
              
              {booking.notes && (
                <p className="mt-4 text-white/70 text-sm bg-white/10 rounded-xl px-4 py-2">
                  <span className="font-medium text-white/90">Note:</span> {booking.notes}
                </p>
              )}
            </div>

            {/* Action Buttons - Big & Clear */}
            <div className="flex flex-col gap-3 lg:min-w-[200px]">
              <Button
                size="lg"
                className="w-full bg-white hover:bg-white/90 text-emerald-600 font-bold text-base h-14 rounded-xl shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98]"
                onClick={() => onStatusUpdate(booking.id, 'COMPLETED')}
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                Complete Session
              </Button>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  size="lg"
                  className="bg-white/10 border-white/30 hover:bg-white/20 text-white font-semibold h-12 rounded-xl"
                  onClick={() => onMarkNoShow(booking.id, booking.clientName)}
                >
                  <Ban className="w-4 h-4 mr-1" />
                  No Show
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="bg-white/10 border-white/30 hover:bg-red-500/30 text-white font-semibold h-12 rounded-xl"
                  onClick={() => onCancel(booking.id, booking.clientName)}
                >
                  <XCircle className="w-4 h-4 mr-1" />
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
