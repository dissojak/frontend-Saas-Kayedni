export interface Booking {
  id: number;
  serviceName: string;
  clientName: string;
  staffName?: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  price: number;
}
