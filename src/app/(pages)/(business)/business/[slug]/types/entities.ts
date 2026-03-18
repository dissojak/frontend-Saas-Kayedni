import type { Business } from "@/(pages)/(business)/businesses/types/business";
import type {
  Service,
  Staff,
  TimeSlot,
} from "@global/types";

export type EntityId = string | number;

export type BusinessStaff = Staff;
export type BusinessService = Service;
export type BusinessTimeSlot = TimeSlot;

export interface StaffAvailabilityEntry {
  date: string;
  status?: string;
}

export interface BusinessImage {
  id?: EntityId;
  imageUrl: string;
  displayOrder?: number;
}

export type BusinessDetailBusiness = Business;
