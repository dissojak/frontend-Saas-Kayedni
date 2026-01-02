import { useState, useEffect } from 'react';
import { Booking, SortOption, StatusFilter } from '../types';
import { filterBookings } from '../utils';
import { sortBookings } from '../utils';

export const useBookingFilters = (bookings: Booking[]) => {
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [sortBy, setSortBy] = useState<SortOption>('date');

  useEffect(() => {
    let result = filterBookings(bookings, searchTerm, statusFilter);
    result = sortBookings(result, sortBy);
    setFilteredBookings(result);
  }, [bookings, searchTerm, statusFilter, sortBy]);

  return {
    filteredBookings,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    sortBy,
    setSortBy
  };
};
