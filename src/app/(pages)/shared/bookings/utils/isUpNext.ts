import { Booking } from '../types/Booking';
import { isToday } from './isToday';
import { isCurrentlyActive } from './isCurrentlyActive';

export const isUpNext = (booking: Booking, currentTime: Date = new Date()): boolean => {
  if (!isToday(booking.date, currentTime) || isCurrentlyActive(booking, currentTime)) return false;
  
  const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
  
  const [startHour, startMin] = booking.startTime.split(':').map(Number);
  const startMinutes = startHour * 60 + startMin;
  
  const diff = startMinutes - currentMinutes;
  return diff > 0 && diff <= 30;
};
