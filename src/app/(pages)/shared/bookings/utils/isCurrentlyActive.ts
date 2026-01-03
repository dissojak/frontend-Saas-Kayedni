import { Booking } from '../types/Booking';
import { isToday } from './isToday';

export const isCurrentlyActive = (booking: Booking, currentTime: Date = new Date()): boolean => {
  if (!isToday(booking.date, currentTime)) return false;
  
  const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
  
  const [startHour, startMin] = booking.startTime.split(':').map(Number);
  const [endHour, endMin] = booking.endTime.split(':').map(Number);
  
  const startMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;
  
  const endWithGrace = endMinutes + 10;
  
  return currentMinutes >= startMinutes && currentMinutes <= endWithGrace;
};
