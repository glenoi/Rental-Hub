import React, { useState } from 'react';
import { MOCK_PROPERTIES, MOCK_REQUESTS } from './constants';
import { Property, RequestStatus, TenantProfile, BookingRequest, UserRole, PropertyType, Furnishing } from './types';
import PropertyCard from './components/PropertyCard';
import TenantProfileForm from './components/TenantProfileForm';
import OwnerDashboard from './components/OwnerDashboard';
import ChatInterface from './components/ChatInterface';
import { calculateTenantScore } from './services/geminiService';
import { Search, Map, User, Home, Menu, X, Building, CheckCircle, Filter } from 'lucide-react';

type ViewState = 'HOME' | 'SEARCH' | 'PROPERTY_DETAIL' | 'PROFILE_FORM' | 'OWNER_DASHBOARD' | 'CHAT';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('HOME');
  const [role, setRole] = useState<UserRole>(UserRole.TENANT);
  
  // State for the flow
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [myProfile, setMyProfile] = useState<TenantProfile | null>(null);
  const [myRequestStatus, setMyRequestStatus] = useState<RequestStatus | null>(null);
  
  // State for Owner Dashboard
  const [ownerRequests, setOwnerRequests] = useState<BookingRequest[]>(MOCK_REQUESTS);

  // Search Filters
  const [filterTypes, setFilterTypes] = useState<PropertyType[]>([]);
  const [filterFurnishing, setFilterFurnishing] = useState<Furnishing[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(15000);

  // Derived Filtered Properties
  const filteredProperties = MOCK_PROPERTIES.filter(p => {
    if (filterTypes.length > 0 && !filterTypes.includes(p.type)) return false;
    if (filterFurnishing.length > 0 && !filterFurnishing.includes(p.furnishing)) return false;
    if (p.price > maxPrice) return false;
    return true;
  });

  const toggleFilterType = (type: PropertyType) => {
    setFilterTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);
  };

  const toggleFurnishing = (item: Furnishing) => {
    setFilterFurnishing(prev => prev.includes(item) ? prev.filter(f => f !== item) : [...prev, item]);
  };

  const handlePropertySelect = (p: Property) => {
    setSelectedProperty(p);
    // If request already exists for this property, go to chat, else detail
    setView('PROPERTY_DETAIL');
  };

  const handleSubmitProfile = async (profile: TenantProfile) => {
    if (!selectedProperty) return;

    // Simulate API call to Gemini
    const { score, reasoning } = await calculateTenantScore(profile, selectedProperty.price);

    // Create a new request (Mock DB save)
    const newRequest: BookingRequest = {
      id: `req_${Date.now()}`,
      propertyId: selectedProperty.id,
      tenantId: 'me',
      tenantProfile: profile,
      status: RequestStatus.PENDING,
      aiScore: score,
      aiReasoning: reasoning,
      createdAt: new Date().toISOString()
    };

    // Update Local State for Owner View
    setOwnerRequests(prev => [newRequest, ...prev]);
    
    // Update Local State for Tenant View
    setMyProfile(profile);
    setMyRequestStatus(RequestStatus.PENDING);
    
    // Show success feedback then move to property detail/status view
    alert("Profile Submitted! The owner will review your score shortly.");
    setView('PROPERTY_DETAIL');
  };

  const handleOwnerUpdateStatus = (id: string, status: RequestStatus) => {
    setOwnerRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    // Sync with tenant view if it was the "me" request
    if (ownerRequests.find(r => r.id === id)?.tenantId === 'me') {
        setMyRequestStatus(status);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      
      {/* Navigation */}
      <nav className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('HOME')}>
            <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center text-white font-bold">R</div>
            <span className="text-xl font-bold tracking-tight text-slate-800">Rental<span className="text-teal-600">Hub</span></span>
          </div>

          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button onClick={() => setView('SEARCH')} className={`hover:text-teal-600 transition ${view === 'SEARCH' ? 'text-teal-600 font-bold' : ''}`}>Find a Home</button>
            <button className="hover:text-teal-600 transition">List Property</button>
            <div className="h-4 w-px bg-slate-300"></div>
            <button 
                onClick={() => {
                    const newRole = role === UserRole.TENANT ? UserRole.OWNER : UserRole.TENANT;
                    setRole(newRole);
                    setView(newRole === UserRole.OWNER ? 'OWNER_DASHBOARD' : 'HOME');
                }}
                className="bg-slate-100 px-3 py-1 rounded-full text-xs flex items-center gap-1 hover:bg-slate-200"
            >
                <User size={12} /> Switch to {role === UserRole.TENANT ? 'Owner' : 'Tenant'} View
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow">
        
        {/* Landing Page */}
        {view === 'HOME' && (
          <div className="relative">
            <div className="bg-teal-900 text-white py-20 px-4">
                <div className="container mx-auto max-w-4xl text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">Zero Deposit. Zero Friction. <br/><span className="text-teal-300">Trusted Tenants Only.</span></h1>
                    <p className="text-lg text-teal-100 mb-8 max-w-2xl mx-auto">Malaysia's first rental platform with mandatory AI pre-screening. We filter the noise so you can move in faster.</p>
                    <div className="flex justify-center gap-4">
                        <button onClick={() => setView('SEARCH')} className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg shadow-lg transition transform hover:-translate-y-1">
                            Start Searching
                        </button>
                    </div>
                </div>
            </div>
            {/* Features Strip */}
            <div className="container mx-auto py-12 px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { icon: <Map className="text-teal-600" size={32} />, title: 'Transit-First Search', desc: 'Find homes near LRT, MRT, and Monorail lines.' },
                    { icon: <CheckCircle className="text-teal-600" size={32} />, title: 'Verified Profiles', desc: 'Pre-screened tenants mean faster approvals from owners.' },
                    { icon: <Building className="text-teal-600" size={32} />, title: 'Direct to Owner', desc: 'No middleman fees. Direct chat after approval.' },
                ].map((f, i) => (
                    <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 text-center">
                        <div className="flex justify-center mb-4">{f.icon}</div>
                        <h3 className="font-bold text-lg mb-2">{f.title}</h3>
                        <p className="text-slate-500 text-sm">{f.desc}</p>
                    </div>
                ))}
            </div>
          </div>
        )}

        {/* Search Page */}
        {view === 'SEARCH' && (
          <div className="flex h-[calc(100vh-64px)]">
            {/* Sidebar Filters */}
            <div className="w-80 bg-white border-r p-6 hidden md:block overflow-y-auto shrink-0">
                <div className="flex items-center gap-2 mb-6 text-slate-800">
                    <Filter size={20} />
                    <h2 className="font-bold text-lg">Filters</h2>
                </div>
                
                <div className="space-y-8">
                    
                    {/* Price Range */}
                    <div>
                        <label className="text-sm font-bold text-slate-700 block mb-3">Max Price</label>
                        <input 
                            type="range" 
                            min="500" 
                            max="15000" 
                            step="500"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(Number(e.target.value))}
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600" 
                        />
                        <div className="flex justify-between text-sm font-medium text-slate-600 mt-2">
                            <span>RM 500</span>
                            <span className="text-teal-700">RM {maxPrice.toLocaleString()}</span>
                        </div>
                    </div>

                    {/* Property Type */}
                    <div>
                        <label className="text-sm font-bold text-slate-700 block mb-3">Property Type</label>
                        <div className="space-y-2">
                            {Object.values(PropertyType).map(type => (
                                <label key={type} className="flex items-center gap-3 text-sm text-slate-600 cursor-pointer hover:text-slate-900">
                                    <input 
                                        type="checkbox" 
                                        checked={filterTypes.includes(type)}
                                        onChange={() => toggleFilterType(type)}
                                        className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 border-slate-300" 
                                    /> 
                                    {type}
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Furnishing */}
                    <div>
                        <label className="text-sm font-bold text-slate-700 block mb-3">Furnishing</label>
                        <div className="space-y-2">
                             {Object.values(Furnishing).map(item => (
                                <label key={item} className="flex items-center gap-3 text-sm text-slate-600 cursor-pointer hover:text-slate-900">
                                    <input 
                                        type="checkbox" 
                                        checked={filterFurnishing.includes(item)}
                                        onChange={() => toggleFurnishing(item)}
                                        className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 border-slate-300" 
                                    /> 
                                    {item}
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Location (Static for now as per previous code, but good to keep) */}
                    <div>
                        <label className="text-sm font-bold text-slate-700 block mb-3">Highlights</label>
                        <div className="space-y-2">
                            <label className="flex items-center gap-3 text-sm text-slate-600 cursor-pointer">
                                <input type="checkbox" className="w-4 h-4 rounded text-teal-600 border-slate-300" /> 
                                Near LRT/MRT
                            </label>
                            <label className="flex items-center gap-3 text-sm text-slate-600 cursor-pointer">
                                <input type="checkbox" className="w-4 h-4 rounded text-teal-600 border-slate-300" /> 
                                Near University
                            </label>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Results */}
            <div className="flex-grow bg-slate-50 p-6 overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">Available Properties</h2>
                        <p className="text-sm text-slate-500">{filteredProperties.length} results found</p>
                    </div>
                    <div className="flex gap-2">
                        <button className="bg-white border hover:bg-slate-50 px-3 py-2 rounded-lg text-sm flex items-center gap-2 font-medium text-slate-700 transition">
                            <Map size={16}/> Map View
                        </button>
                    </div>
                </div>
                
                {filteredProperties.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProperties.map(p => (
                            <PropertyCard key={p.id} property={p} onViewDetails={handlePropertySelect} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <div className="inline-flex bg-slate-200 p-4 rounded-full mb-4">
                            <Search className="text-slate-400" size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-700">No properties found</h3>
                        <p className="text-slate-500">Try adjusting your filters to see more results.</p>
                        <button 
                            onClick={() => {
                                setFilterTypes([]);
                                setFilterFurnishing([]);
                                setMaxPrice(15000);
                            }}
                            className="mt-4 text-teal-600 font-medium hover:underline"
                        >
                            Clear all filters
                        </button>
                    </div>
                )}
            </div>
          </div>
        )}

        {/* ... Other Views ... */}
        {view === 'PROPERTY_DETAIL' && selectedProperty && (
          <div className="container mx-auto p-4 md:p-8 max-w-5xl">
            <button onClick={() => setView('SEARCH')} className="mb-4 text-slate-500 hover:text-slate-800 text-sm flex items-center gap-1">← Back to Search</button>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Images & Info */}
                <div className="md:col-span-2 space-y-6">
                    <img src={selectedProperty.images[0]} className="w-full h-80 object-cover rounded-xl shadow-sm" alt="Property" />
                    <div>
                        <div className="flex justify-between items-start">
                            <h1 className="text-2xl font-bold mb-2">{selectedProperty.title}</h1>
                            <span className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm font-bold">RM{selectedProperty.price}/mo</span>
                        </div>
                        <p className="text-slate-500 mb-4 flex items-center gap-1"><MapPin size={16} /> {selectedProperty.location}</p>
                        
                        <div className="flex gap-6 border-y py-4 mb-4">
                            <div className="text-center"><span className="block font-bold text-lg">{selectedProperty.rooms}</span><span className="text-xs text-slate-500">Bed</span></div>
                            <div className="text-center"><span className="block font-bold text-lg">{selectedProperty.bathrooms}</span><span className="text-xs text-slate-500">Bath</span></div>
                            <div className="text-center"><span className="block font-bold text-lg">{selectedProperty.sqft}</span><span className="text-xs text-slate-500">Sqft</span></div>
                            <div className="text-center"><span className="block font-bold text-lg text-teal-600">{selectedProperty.furnishing}</span><span className="text-xs text-slate-500">Type</span></div>
                        </div>

                        <div className="prose text-slate-600">
                            <h3 className="font-bold text-slate-800 mb-2">Description</h3>
                            <p>{selectedProperty.description}</p>
                        </div>
                    </div>
                </div>

                {/* Booking / Profile Action Box */}
                <div className="md:col-span-1">
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100 sticky top-24">
                        <h3 className="font-bold text-lg mb-4">Interested?</h3>
                        
                        {!myRequestStatus ? (
                            <div className="space-y-4">
                                <p className="text-sm text-slate-500">To maintain trust, Rental Hub requires a mandatory tenant profile before you can contact the owner.</p>
                                <button 
                                    onClick={() => setView('PROFILE_FORM')}
                                    className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg transition"
                                >
                                    Submit Tenant Profile
                                </button>
                                <p className="text-xs text-center text-slate-400">Takes 2 minutes • PDPA Protected</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className={`p-4 rounded-lg text-center ${
                                    myRequestStatus === RequestStatus.APPROVED ? 'bg-green-50 border border-green-200' :
                                    myRequestStatus === RequestStatus.REJECTED ? 'bg-red-50 border border-red-200' :
                                    'bg-yellow-50 border border-yellow-200'
                                }`}>
                                    <h4 className="font-bold mb-1">Status: {myRequestStatus}</h4>
                                    <p className="text-xs text-slate-600">
                                        {myRequestStatus === RequestStatus.PENDING ? 'Waiting for owner review.' :
                                         myRequestStatus === RequestStatus.APPROVED ? 'Owner accepted! You can now chat.' :
                                         'Profile declined by owner.'}
                                    </p>
                                </div>
                                
                                <button 
                                    onClick={() => setView('CHAT')}
                                    disabled={myRequestStatus !== RequestStatus.APPROVED}
                                    className={`w-full py-3 font-bold rounded-lg transition flex items-center justify-center gap-2 ${
                                        myRequestStatus === RequestStatus.APPROVED 
                                        ? 'bg-teal-600 text-white hover:bg-teal-700' 
                                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                    }`}
                                >
                                    Open Chat
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
          </div>
        )}

        {/* Profile Form */}
        {view === 'PROFILE_FORM' && (
          <div className="py-12 px-4">
             <TenantProfileForm 
                onSubmit={handleSubmitProfile} 
                isSubmitting={false}
                initialData={myProfile || undefined}
             />
             <div className="text-center mt-6">
                <button onClick={() => setView('PROPERTY_DETAIL')} className="text-slate-500 underline">Cancel</button>
             </div>
          </div>
        )}

        {/* Owner Dashboard */}
        {view === 'OWNER_DASHBOARD' && (
            <OwnerDashboard requests={ownerRequests} onRequestUpdate={handleOwnerUpdateStatus} />
        )}

        {/* Chat */}
        {view === 'CHAT' && selectedProperty && (
            <div className="container mx-auto p-4 md:p-8 max-w-3xl">
                <button onClick={() => setView('PROPERTY_DETAIL')} className="mb-4 text-slate-500 hover:text-slate-800 text-sm flex items-center gap-1">← Back to Property</button>
                <h2 className="text-xl font-bold mb-4">Chat with Owner</h2>
                <ChatInterface isLocked={myRequestStatus !== RequestStatus.APPROVED} ownerName="Owner (Mr. Lim)" />
            </div>
        )}

      </main>
    </div>
  );
};

const MapPin = ({size, className}: {size?:number, className?: string}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
);

export default App;