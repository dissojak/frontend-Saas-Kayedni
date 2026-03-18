export type BookingCalendarDisabledDay = { before: Date } | { after: Date };

export type NullableSelectionSetter<T> = (value: T | null) => void;
