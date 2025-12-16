import React, { useState } from 'react';
import { MOCK_PROPERTIES, MOCK_REQUESTS } from './constants';
import { Property, RequestStatus, TenantProfile, BookingRequest, UserRole } from './types';
import PropertyCard from './components/PropertyCard';
import TenantProfileForm from './components/TenantProfileForm';
import OwnerDashboard from './components/OwnerDashboard';
import ChatInterface from './components/ChatInterface';
import { calculateTenantScore } from './services/geminiService';
import { Search, Map, User, Home, Menu, X, Building, CheckCircle } from 'lucide-react';

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
            <button onClick={() => setView('SEARCH')} className="hover:text-teal-600 transition">Find a Home</button>
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
            <div className="w-80 bg-white border-r p-6 hidden md:block overflow-y-auto">
                <h2 className="font-bold text-lg mb-4">Filters</h2>
                <div className="space-y-6">
                    <div>
                        <label className="text-sm font-semibold text-slate-700 block mb-2">Location Type</label>
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm text-slate-600"><input type="checkbox" className="rounded text-teal-600" /> Near LRT/MRT</label>
                            <label className="flex items-center gap-2 text-sm text-slate-600"><input type="checkbox" className="rounded text-teal-600" /> Near University</label>
                        </div>
                    </div>
                    <div>
                        <label className="text-sm font-semibold text-slate-700 block mb-2">Price Range (RM)</label>
                        <input type="range" min="500" max="5000" className="w-full accent-teal-600" />
                        <div className="flex justify-between text-xs text-slate-500 mt-1"><span>500</span><span>5000+</span></div>
                    </div>
                </div>
            </div>
            
            {/* Results */}
            <div className="flex-grow bg-slate-50 p-6 overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Klang Valley Properties</h2>
                    <div className="flex gap-2">
                        <button className="bg-white border px-3 py-1 rounded-lg text-sm flex items-center gap-1"><Map size={14}/> Map View</button>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {MOCK_PROPERTIES.map(p => (
                        <PropertyCard key={p.id} property={p} onViewDetails={handlePropertySelect} />
                    ))}
                </div>
            </div>
          </div>
        )}

        {/* Property Detail / Booking Flow */}
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

// Simple Icon component wrapper for lucide-react just in case, but direct usage is better.
const MapPin = ({size, className}: {size?:number, className?: string}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
);

export default App;