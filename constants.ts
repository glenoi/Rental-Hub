import { Property, PropertyType, Furnishing, BookingRequest, RequestStatus, TenantProfile } from './types';

export const MOCK_PROPERTIES: Property[] = [
  {
    id: 'prop_1',
    title: 'Modern Zen Condo @ Mont Kiara',
    location: 'Mont Kiara, Kuala Lumpur',
    price: 3500,
    type: PropertyType.CONDO,
    furnishing: Furnishing.FULLY,
    rooms: 3,
    bathrooms: 2,
    sqft: 1200,
    images: [
      'https://picsum.photos/800/600?random=1',
      'https://picsum.photos/800/600?random=2',
    ],
    tags: ['Walking to Int School', 'Bathtub', 'High Floor'],
    ownerId: 'owner_1',
    description: 'Beautifully renovated unit facing the palace. Quiet environment.'
  },
  {
    id: 'prop_2',
    title: 'Cozy Room near LRT Bangsar',
    location: 'Bangsar, Kuala Lumpur',
    price: 900,
    type: PropertyType.ROOM,
    furnishing: Furnishing.PARTIALLY,
    rooms: 1,
    bathrooms: 1,
    sqft: 150,
    images: [
      'https://picsum.photos/800/600?random=3',
    ],
    tags: ['Near LRT', 'Female Only', 'Wifi Included'],
    ownerId: 'owner_1',
    description: 'Middle room in a landed house. 5 mins walk to Bangsar LRT.'
  },
  {
    id: 'prop_3',
    title: 'Luxury Studio @ TRX',
    location: 'Tun Razak Exchange, KL',
    price: 4200,
    type: PropertyType.ENTIRE_UNIT,
    furnishing: Furnishing.FULLY,
    rooms: 1,
    bathrooms: 1,
    sqft: 600,
    images: [
      'https://picsum.photos/800/600?random=4',
    ],
    tags: ['MRT Access', 'City View', 'Gym'],
    ownerId: 'owner_2',
    description: 'Right above the TRX mall. Perfect for professionals.'
  }
];

export const MOCK_TENANT_PROFILE: TenantProfile = {
  id: 'tenant_1',
  fullName: 'Ahmad bin Razak',
  nricOrPassport: '950101-14-XXXX',
  gender: 'Male',
  nationality: 'Malaysian',
  race: 'Malay',
  occupation: 'Software Engineer',
  companyName: 'Grab Malaysia',
  officeLocation: 'First Avenue, Bandar Utama',
  monthlyIncome: 8500,
  paxAdults: 2,
  paxKids: 0,
  moveInDate: '2023-11-01',
  contractPeriod: 12,
  depositAgreed: true,
  bio: 'Quiet professional couple, clean and responsible.'
};

export const MOCK_REQUESTS: BookingRequest[] = [
  {
    id: 'req_1',
    propertyId: 'prop_1',
    tenantId: 'tenant_x',
    tenantProfile: { ...MOCK_TENANT_PROFILE, fullName: 'Sarah Lee', race: 'Chinese', occupation: 'Marketing Manager', monthlyIncome: 5500 },
    status: RequestStatus.PENDING,
    aiScore: 85,
    aiReasoning: 'Strong income-to-rent ratio. Stable employment in reputable industry.',
    createdAt: '2023-10-24T10:00:00Z'
  },
  {
    id: 'req_2',
    propertyId: 'prop_1',
    tenantId: 'tenant_y',
    tenantProfile: { ...MOCK_TENANT_PROFILE, fullName: 'John Doe', nationality: 'UK', occupation: 'Freelancer', monthlyIncome: 4000 },
    status: RequestStatus.REJECTED,
    aiScore: 45,
    aiReasoning: 'Income is borderline for this rental price. Freelance status poses higher risk.',
    createdAt: '2023-10-23T14:30:00Z'
  }
];
