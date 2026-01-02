export const isToday = (dateString: string, currentTime: Date = new Date()): boolean => {
  const bookingDate = new Date(dateString);
  return bookingDate.toDateString() === currentTime.toDateString();
};
