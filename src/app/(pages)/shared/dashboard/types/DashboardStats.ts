export interface DashboardStats {
  completed: number;
  cancelled: number;
  noShow: number;
  pending: number;
  confirmed: number;
  total: number;
  totalRevenue: number;
  completionRate: number;
  cancellationRate: number;
  upcoming: number;
}

export interface StaffStats {
  totalBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  noShowBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
}

export interface BusinessStats {
  totalBookings: number;
  upcomingBookings: number;
  completedBookings: number;
  totalStaff: number;
  totalServices: number;
  monthlyRevenue: number;
}
