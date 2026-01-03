import type { Booking, ServiceBreakdown } from '../types';

/**
 * Calculate service breakdown (top services by completed bookings)
 */
export function calculateServiceBreakdown(bookings: Booking[], topN: number = 5): ServiceBreakdown[] {
  const services: Record<string, number> = {};
  
  bookings.forEach(b => {
    if (b.status === 'COMPLETED') {
      services[b.serviceName] = (services[b.serviceName] || 0) + 1;
    }
  });
  
  return Object.entries(services)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, topN);
}
