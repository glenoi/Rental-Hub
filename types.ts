export enum PropertyType {
  CONDO = 'Condominium',
  LANDED = 'Landed House',
  ROOM = 'Room',
  ENTIRE_UNIT = 'Entire Unit'
}

export enum Furnishing {
  FULLY = 'Fully Furnished',
  PARTIALLY = 'Partially Furnished',
  UNFURNISHED = 'Unfurnished'
}

export enum RequestStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export enum UserRole {
  TENANT = 'TENANT',
  OWNER = 'OWNER'
}

export interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  type: PropertyType;
  furnishing: Furnishing;
  rooms: number;
  bathrooms: number;
  sqft: number;
  images: string[];
  tags: string[]; // e.g., "Near LRT", "Pet Friendly"
  ownerId: string;
  description: string;
}

// The "Golden List" for PDPA compliant pre-screening
export interface TenantProfile {
  id: string;
  fullName: string;
  nricOrPassport: string;
  gender: 'Male' | 'Female' | 'Other';
  nationality: string;
  race: string; // Required for cultural fit filtering context
  occupation: string;
  companyName: string;
  officeLocation: string; // For commute verification
  monthlyIncome: number;
  paxAdults: number;
  paxKids: number;
  moveInDate: string;
  contractPeriod: number; // Months
  depositAgreed: boolean; // 2+1 Structure
  bio: string;
}

export interface BookingRequest {
  id: string;
  propertyId: string;
  tenantId: string;
  tenantProfile: TenantProfile;
  status: RequestStatus;
  aiScore: number;
  aiReasoning: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
}