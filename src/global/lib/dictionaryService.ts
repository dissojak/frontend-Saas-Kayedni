import type { SliceKey } from '@global/lib/slices';

export type DictionaryKey =
  | 'nav_services'
  | 'nav_bookings';

const DEFAULT_DICTIONARY: Record<DictionaryKey, string> = {
  nav_services: 'Services',
  nav_bookings: 'Bookings',
};

const SLICE_DICTIONARY: Record<string, Partial<Record<DictionaryKey, string>>> = {
  barber: {
    nav_services: 'Services',
    nav_bookings: 'Appointments',
  },
  'nail-salon': {
    nav_services: 'Services',
    nav_bookings: 'Appointments',
  },
  salon: {
    nav_services: 'Treatments',
    nav_bookings: 'Appointments',
  },
  'health&care': {
    nav_services: 'Treatments',
    nav_bookings: 'Consultations',
  },
  'beauty&hairstyling': {
    nav_services: 'Services',
    nav_bookings: 'Appointments',
  },
};

export function t(sliceKey: SliceKey, key: DictionaryKey): string {
  const sliceDictionary = SLICE_DICTIONARY[sliceKey] ?? {};
  return sliceDictionary[key] ?? DEFAULT_DICTIONARY[key];
}
