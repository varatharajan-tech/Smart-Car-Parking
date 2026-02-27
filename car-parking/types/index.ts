export type UserRole = 'driver' | 'owner' | 'admin';

export interface User {
  id: string;
  name: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  verified: boolean;
}

export interface ParkingSpace {
  id: string;
  ownerId: string;
  ownerName: string;
  title: string;
  address: string;
  latitude: number;
  longitude: number;
  pricePerHour: number;
  pricePerDay: number;
  rating: number;
  reviewCount: number;
  photos: string[];
  rules: string[];
  amenities: string[];
  available: boolean;
  availableFrom: string;
  availableTo: string;
  distance?: string;
  totalSpots?: number;
  availableSpots?: number;
}

export interface Booking {
  id: string;
  parkingId: string;
  parkingTitle: string;
  parkingAddress: string;
  userId: string;
  date: string;
  startTime: string;
  endTime: string;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  avatar?: string;
  rating: number;
  comment: string;
  date: string;
}

export interface OwnerEarnings {
  today: number;
  thisWeek: number;
  thisMonth: number;
  total: number;
  weeklyData: number[];
}
