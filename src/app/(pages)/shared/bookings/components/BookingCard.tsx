import React from 'react';
import { Badge } from '@components/ui/badge';
import { Button } from '@components/ui/button';
import { 
  Clock, 
  Bell,
  CheckCircle, 
  UserCheck, 
  Ban, 
  XCircle, 
  Phone, 
  Mail,
  AlertCircle,
  DollarSign 
} from 'lucide-react';
import type { Booking } from '../types/Booking';
import type { BookingCardProps } from '../types/BookingCardProps';
import { isToday, isCurrentlyActive, isUpNext, formatTime, getStatusColor } from '../utils';

const getStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case 'confirmed': return <CheckCircle className="w-3.5 h-3.5" />;
    case 'pending': return <AlertCircle className="w-3.5 h-3.5" />;
    case 'completed': return <CheckCircle className="w-3.5 h-3.5" />;
    case 'cancelled': return <XCircle className="w-3.5 h-3.5" />;
    case 'rejected': return <XCircle className="w-3.5 h-3.5" />;
    default: return null;
  }
};

export const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  variant = 'default',
  currentTime = new Date(),
  onStatusUpdate,
  onCancel,
  onMarkNoShow,
  onSendReminderNow
}) => {
  const bookingIsToday = isToday(booking.date, currentTime);
  const isActive = isCurrentlyActive(booking, currentTime);
  const isNext = isUpNext(booking, currentTime);
  const bookingStartDateTime = new Date(`${booking.date}T${booking.startTime}`);
  const canSendComeNowReminder =
    bookingIsToday &&
    booking.status.toLowerCase() === 'confirmed' &&
    bookingStartDateTime.getTime() > currentTime.getTime();
  
  let cardStyle = 'bg-card border-border';
  if (variant === 'cancelled') {
    cardStyle = 'bg-red-50/50 dark:bg-red-950/20 border-red-200/50 dark:border-red-900/30 opacity-75';
  } else if (variant === 'past') {
    cardStyle = 'bg-muted/30 dark:bg-muted/20 border-border opacity-75';
  } else if (isActive) {
    cardStyle = 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-700 ring-2 ring-emerald-500/20';
  } else if (isNext) {
    cardStyle = 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-700';
  } else if (bookingIsToday) {
    cardStyle = 'bg-primary/5 dark:bg-primary/10 border-primary/20 dark:border-primary/30';
  }

  return (
    <div className={`rounded-2xl border-2 shadow-sm hover:shadow-lg transition-all duration-200 ${cardStyle}`}>
      <div className="p-5 sm:p-6">
        {/* Status Indicator for Active/Next */}
        {isActive && variant === 'default' && (
          <div className="flex items-center gap-2 mb-4 bg-emerald-500 text-white px-4 py-2 rounded-xl w-fit">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            <span className="font-bold text-sm uppercase tracking-wider">In Session Now</span>
          </div>
        )}
        {isNext && variant === 'default' && (
          <div className="flex items-center gap-2 mb-4 bg-amber-500/20 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-xl w-fit">
            <Clock className="w-4 h-4" />
            <span className="font-bold text-sm uppercase tracking-wider">Up Next</span>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-5">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-lg shrink-0 ${
              variant === 'cancelled' 
                ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                : variant === 'past'
                ? 'bg-muted text-muted-foreground'
                : isActive
                ? 'bg-emerald-500 text-white'
                : isNext
                ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                : bookingIsToday 
                ? 'bg-primary/10 dark:bg-primary/20 text-primary' 
                : 'bg-muted text-muted-foreground'
            }`}>
              {booking.clientName.charAt(0)}
            </div>
            <div className="min-w-0">
              <h3 className={`text-lg sm:text-xl font-bold ${
                variant === 'cancelled' ? 'line-through text-muted-foreground' : 'text-foreground'
              }`}>
                {booking.clientName}
              </h3>
              <p className="text-muted-foreground">{booking.serviceName}</p>
            </div>
          </div>
          <Badge className={`${getStatusColor(booking.status)} text-sm font-semibold px-3 py-1.5 flex items-center gap-1.5 w-fit`}>
            {getStatusIcon(booking.status)}
            {booking.status}
          </Badge>
        </div>
        
        {/* Info Grid */}
        <div className="grid grid-cols-4 gap-4 sm:gap-6 mb-6 p-4 bg-muted/30 dark:bg-muted/10 rounded-xl">
          <div className="col-span-2 sm:col-span-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Client</p>
            <p className={`text-sm font-semibold truncate ${variant === 'past' || variant === 'cancelled' ? 'text-muted-foreground' : 'text-foreground'}`}>
              {booking.clientName}
            </p>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Contact</p>
            <p className="text-xs text-muted-foreground truncate">{booking.clientEmail}</p>
            {booking.clientPhone && (
              <a href={`tel:${booking.clientPhone}`} className="text-xs text-primary hover:underline flex items-center gap-1 mt-0.5">
                <Phone className="w-3 h-3" />
                {booking.clientPhone}
              </a>
            )}
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Date</p>
            <p className={`text-sm font-semibold ${
              bookingIsToday && variant === 'default' ? 'text-primary' : variant === 'past' || variant === 'cancelled' ? 'text-muted-foreground' : 'text-foreground'
            }`}>
              {bookingIsToday ? 'Today' : new Date(booking.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Time</p>
            <p className={`text-sm font-semibold ${
              isActive ? 'text-emerald-600 dark:text-emerald-400' : bookingIsToday && variant === 'default' ? 'text-primary' : variant === 'past' || variant === 'cancelled' ? 'text-muted-foreground' : 'text-foreground'
            }`}>
              {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
            </p>
          </div>
          <div className="col-span-2 sm:col-span-4 lg:col-span-4 flex items-center justify-between pt-3 sm:pt-0 border-t sm:border-t-0 border-border/50">
            <div className="sm:hidden">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Price</p>
            </div>
            <p className={`text-lg font-bold ${variant === 'past' || variant === 'cancelled' ? 'text-muted-foreground' : 'text-emerald-600 dark:text-emerald-400'}`}>
              ${booking.price.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Actions */}
        {variant === 'default' && (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {booking.status.toLowerCase() === 'pending' && (
              <Button
                size="lg"
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl h-12 text-base"
                onClick={() => onStatusUpdate(booking.id, 'CONFIRMED')}
              >
                <UserCheck className="w-5 h-5 mr-2" />
                Confirm Booking
              </Button>
            )}
            {booking.status.toLowerCase() === 'confirmed' && (
              <div className="flex flex-col sm:flex-row gap-3 flex-1">
                <Button
                  size="lg"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl h-12 text-base"
                  onClick={() => onStatusUpdate(booking.id, 'COMPLETED')}
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Mark Complete
                </Button>
                {canSendComeNowReminder && onSendReminderNow && (
                  <Button
                    variant="outline"
                    size="lg"
                    className="flex-1 border-2 border-amber-300 text-amber-700 hover:bg-amber-50 dark:border-amber-700 dark:text-amber-300 dark:hover:bg-amber-900/20 font-semibold rounded-xl h-12 text-base"
                    onClick={() => onSendReminderNow(booking.id)}
                  >
                    <Bell className="w-4 h-4 mr-2" />
                    Call Client Now
                  </Button>
                )}
              </div>
            )}
            {!['cancelled', 'rejected', 'completed', 'no_show'].includes(booking.status.toLowerCase()) && (
              <div className="flex gap-3 flex-1 sm:flex-none">
                <Button
                  variant="outline"
                  size="lg"
                  className="flex-1 border-2 border-border hover:bg-muted text-muted-foreground font-semibold rounded-xl h-12 text-base"
                  onClick={() => onMarkNoShow(booking.id, booking.clientName)}
                >
                  <Ban className="w-4 h-4 mr-2" />
                  No Show
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="flex-1 border-2 border-border hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50 text-muted-foreground font-semibold rounded-xl h-12 text-base"
                  onClick={() => onCancel(booking.id, booking.clientName, booking.status)}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  {booking.status.toUpperCase() === 'PENDING' ? 'Reject' : 'Cancel'}
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Notes */}
        {booking.notes && (
          <div className={`mt-5 pt-4 border-t ${variant === 'cancelled' ? 'border-red-200/50 dark:border-red-900/30' : 'border-border'}`}>
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">Notes:</span> {booking.notes}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
