import type { Business, Staff, Service } from '@global/types';
import type { HomeKey } from '@global/lib/i18n/home';

export const mockBusinesses: Business[] = [
  {
    id: 'biz-1',
    name: 'Style Studio',
    description: 'Premium hair salon with expert stylists',
    category: 'Barber',
    address: '123 Main St, Anytown',
    logo: 'https://images.unsplash.com/photo-1600948836101-f9ffda59d250?q=80&w=200&auto=format&fit=crop',
    rating: 4.8,
  },
  {
    id: 'biz-2',
    name: 'Tech Tutors',
    description: 'Professional coding and tech education',
    category: 'Education',
    address: '456 Oak Ave, Techville',
    logo: 'https://images.unsplash.com/photo-1610563166150-b34df4f3bcd6?q=80&w=200&auto=format&fit=crop',
    rating: 4.9,
  },
  {
    id: 'biz-3',
    name: 'GameZone',
    description: 'Ultimate gaming experience center',
    category: 'Gaming',
    address: '789 Pixel Lane, Gamerton',
    logo: 'https://images.unsplash.com/photo-1586182987320-4f376d39d787?q=80&w=200&auto=format&fit=crop',
    rating: 4.7,
  },
];

export const mockStaff: Staff[] = [
  {
    id: 'staff-1',
    businessId: 'biz-1',
    name: 'Alex Morgan',
    role: 'Senior Stylist',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    bio: '10+ years experience in cutting-edge hair styling',
  },
  {
    id: 'staff-2',
    businessId: 'biz-1',
    name: 'Jamie Lee',
    role: 'Color Specialist',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    bio: 'Expert in hair coloring and treatments',
  },
  {
    id: 'staff-3',
    businessId: 'biz-2',
    name: 'Taylor Swift',
    role: 'Lead Instructor',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    bio: 'Full-stack developer with 8 years teaching experience',
  },
  {
    id: 'staff-4',
    businessId: 'biz-3',
    name: 'Chris Evans',
    role: 'Game Master',
    avatar: 'https://randomuser.me/api/portraits/men/91.jpg',
    bio: 'Professional e-sports coach and gaming enthusiast',
  },
];

export const mockServices: Service[] = [
  {
    id: 'service-1',
    businessId: 'biz-1',
    name: 'Haircut & Styling',
    description: 'Full service haircut with styling',
    duration: 60,
    price: 65,
  },
  {
    id: 'service-2',
    businessId: 'biz-1',
    name: 'Hair Coloring',
    description: 'Full or partial hair coloring service',
    duration: 120,
    price: 120,
  },
  {
    id: 'service-3',
    businessId: 'biz-2',
    name: 'Private Coding Lesson',
    description: 'One-on-one programming tutoring',
    duration: 60,
    price: 85,
  },
  {
    id: 'service-4',
    businessId: 'biz-3',
    name: 'VR Gaming Session',
    description: '1-hour session with latest VR equipment',
    duration: 60,
    price: 45,
  },
];

export const mockCategories: string[] = [
  'All',
  'Barber',
  'Education',
  'Gaming',
  'Fitness',
  'Spa',
  'Therapy',
];

export interface MockHomeTestimonialSeed {
  clientName: string;
  serviceCommentKey?: HomeKey;
  businessCommentKey?: HomeKey;
  serviceRating?: number;
  businessRating?: number;
  serviceNameKey?: HomeKey;
  businessNameKey?: HomeKey;
  businessId?: number;
}

export const mockBusinessReviewCountById: Record<string, number> = {
  'biz-1': 128,
  'biz-2': 93,
  'biz-3': 85,
};

export const mockHomeTestimonialSeeds: MockHomeTestimonialSeed[] = [
  {
    clientName: 'Sarah Johnson',
    serviceCommentKey: 'testimonials_fallback_comment_1',
    serviceRating: 5,
    businessNameKey: 'testimonials_fallback_business_style_studio',
  },
  {
    clientName: 'Mike Chen',
    businessCommentKey: 'testimonials_fallback_comment_2',
    businessRating: 5,
    serviceNameKey: 'testimonials_fallback_service_tech_support',
  },
  {
    clientName: 'Emma Davis',
    serviceCommentKey: 'testimonials_fallback_comment_3',
    serviceRating: 5,
    businessNameKey: 'testimonials_fallback_business_gamezone',
  },
];
