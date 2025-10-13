import type { TimeSlot } from './types';

export const generateTimeSlots = (staffId: string): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const today = new Date();
  
  for (let day = 0; day < 7; day++) {
    const date = new Date(today);
    date.setDate(today.getDate() + day);
    
    for (let hour = 9; hour < 17; hour++) {
      const startTime = new Date(date);
      startTime.setHours(hour, 0, 0, 0);
      
      const endTime = new Date(date);
      endTime.setHours(hour + 1, 0, 0, 0);
      
      const isAvailable = Math.random() > 0.3;
      
      slots.push({
        id: `slot-${staffId}-${startTime.getTime()}`,
        staffId,
        startTime,
        endTime,
        isAvailable
      });
    }
  }
  
  return slots;
};
