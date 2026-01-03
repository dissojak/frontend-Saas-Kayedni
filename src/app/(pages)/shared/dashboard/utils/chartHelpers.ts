import type { MonthlyData, ServiceBreakdown } from '../types';

/**
 * Get max value from monthly data for chart scaling
 */
export function getMaxMonthlyValue(monthlyData: MonthlyData[]): number {
  return Math.max(...monthlyData.map(m => m.total), 1);
}

/**
 * Get max value from service breakdown for chart scaling
 */
export function getMaxServiceCount(serviceBreakdown: ServiceBreakdown[]): number {
  return Math.max(...serviceBreakdown.map(s => s.count), 1);
}
