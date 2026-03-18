export const toDate = (value: Date | string) => (value instanceof Date ? value : new Date(value));

export const isSameLocalDate = (a: Date, b: Date) => (
  a.getFullYear() === b.getFullYear()
  && a.getMonth() === b.getMonth()
  && a.getDate() === b.getDate()
);

export const formatDateKey = (d: Date) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const formatTimeSlot = (date: Date | string) => toDate(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
