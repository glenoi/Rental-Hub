import React, { useState } from 'react';
import { BookingRequest, RequestStatus } from '../types';
import { CheckCircle, XCircle, User, Activity, Clock, Home, Users, Calendar } from 'lucide-react';

interface Props {
  requests: BookingRequest[];
  onRequestUpdate: (id: string, status: RequestStatus) => void;
}

const OwnerDashboard: React.FC<Props> = ({ requests, onRequestUpdate }) => {
  const [filter, setFilter] = useState<RequestStatus | 'ALL'>('ALL');

  const filtered = requests.filter(r => filter === 'ALL' || r.status === filter);

  // Computed Metrics
  const totalSubmissions = requests.length;
  const pendingCount = requests.filter(r => r.status === RequestStatus.PENDING).length;
  
  // Mock Metrics (In a real app, these would come from the backend)
  const activeListings = 3;
  const avgResponseTime = "2.5 Hours";
  const upcomingViewings = 4;

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Owner Dashboard</h1>
          <p className="text-slate-500">Overview of your property performance and incoming leads.</p>
      </div>

      {/* Metrics Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <MetricCard 
            label="Active Listings" 
            value={activeListings} 
            icon={<Home size={20} className="text-blue-600" />}
            bg="bg-blue-50"
        />
        <MetricCard 
            label="Tenant Submissions" 
            value={totalSubmissions} 
            subValue={`${pendingCount} Pending Review`}
            icon={<Users size={20} className="text-teal-600" />}
            bg="bg-teal-50"
        />
        <MetricCard 
            label="Avg. Response Time" 
            value={avgResponseTime} 
            icon={<Clock size={20} className="text-orange-600" />}
            bg="bg-orange-50"
        />
        <MetricCard 
            label="Upcoming Viewings" 
            value={upcomingViewings} 
            subValue="Next: Tomorrow, 10 AM"
            icon={<Calendar size={20} className="text-purple-600" />}
            bg="bg-purple-50"
        />
      </div>

      {/* Applications Management Section */}
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-6 border-t border-slate-200 pt-8">
        <div>
            <h2 className="text-xl font-bold text-slate-800">Tenant Applications</h2>
            <p className="text-sm text-slate-500">Review AI scores and approve viewing requests.</p>
        </div>
        
        <div className="bg-white border rounded-lg p-1 flex mt-4 md:mt-0 shadow-sm">
            {([
                'ALL', 
                RequestStatus.PENDING, 
                RequestStatus.APPROVED, 
                RequestStatus.REJECTED
            ]).map(s => (
                <button
                    key={s}
                    onClick={() => setFilter(s as any)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition ${filter === s ? 'bg-teal-600 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                    {s}
                </button>
            ))}
        </div>
      </div>

      <div className="grid gap-6">
        {filtered.map(req => (
          <div key={req.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row gap-6 hover:shadow-md transition">
            
            {/* Left: Tenant Snapshot */}
            <div className="md:w-1/3 border-b md:border-b-0 md:border-r pr-0 md:pr-6 border-slate-100 pb-4 md:pb-0">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 border border-slate-200">
                        <User size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg">{req.tenantProfile.fullName}</h3>
                        <span className="text-xs bg-slate-100 border px-2 py-1 rounded text-slate-600">{req.tenantProfile.nationality}</span>
                    </div>
                </div>
                <div className="space-y-2 text-sm text-slate-600 mt-4">
                    <p><span className="font-semibold text-slate-900">Job:</span> {req.tenantProfile.occupation}</p>
                    <p><span className="font-semibold text-slate-900">Company:</span> {req.tenantProfile.companyName}</p>
                    <p><span className="font-semibold text-slate-900">Income:</span> RM{req.tenantProfile.monthlyIncome}/mo</p>
                    <p><span className="font-semibold text-slate-900">Pax:</span> {req.tenantProfile.paxAdults} Adult, {req.tenantProfile.paxKids} Kid</p>
                </div>
            </div>

            {/* Middle: AI Analysis */}
            <div className="md:w-1/3 flex flex-col justify-center">
                <div className="mb-2 flex items-center gap-2">
                    <Activity size={18} className="text-teal-600" />
                    <span className="font-bold text-slate-700">Rental Hub AI Score</span>
                </div>
                <div className="flex items-center gap-4 mb-3">
                    <div className={`text-4xl font-extrabold ${req.aiScore >= 70 ? 'text-green-600' : req.aiScore >= 50 ? 'text-orange-500' : 'text-red-600'}`}>
                        {req.aiScore}
                    </div>
                    <div className="text-xs text-slate-500 bg-slate-50 border p-2 rounded max-w-[200px]">
                        "{req.aiReasoning}"
                    </div>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div 
                        className={`h-full ${req.aiScore >= 70 ? 'bg-green-500' : 'bg-orange-500'}`} 
                        style={{ width: `${req.aiScore}%` }}
                    />
                </div>
            </div>

            {/* Right: Actions */}
            <div className="md:w-1/3 flex flex-col items-end justify-center gap-3 pl-0 md:pl-6 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0">
                {req.status === RequestStatus.PENDING ? (
                    <>
                        <button 
                            onClick={() => onRequestUpdate(req.id, RequestStatus.APPROVED)}
                            className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition shadow-sm"
                        >
                            <CheckCircle size={18} /> Approve & Unlock Chat
                        </button>
                        <button 
                            onClick={() => onRequestUpdate(req.id, RequestStatus.REJECTED)}
                            className="w-full py-2.5 bg-white border border-red-200 text-red-600 hover:bg-red-50 rounded-lg font-medium flex items-center justify-center gap-2 transition"
                        >
                            <XCircle size={18} /> Decline
                        </button>
                    </>
                ) : (
                    <div className={`flex items-center gap-2 font-bold px-4 py-2 rounded-lg ${req.status === RequestStatus.APPROVED ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {req.status === RequestStatus.APPROVED ? <CheckCircle size={20} /> : <XCircle size={20} />}
                        {req.status}
                    </div>
                )}
                
                {req.status === RequestStatus.APPROVED && (
                    <button className="text-sm text-teal-600 font-medium hover:underline mt-2 flex items-center gap-1">
                        View Chat History
                    </button>
                )}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
            <div className="text-center py-16 bg-white rounded-xl border border-dashed border-slate-300">
                <div className="mx-auto w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                    <Users className="text-slate-400" />
                </div>
                <h3 className="text-lg font-medium text-slate-900">No applications found</h3>
                <p className="text-slate-500">There are no requests matching this filter.</p>
            </div>
        )}
      </div>
    </div>
  );
};

// Internal Metric Card Component
interface MetricCardProps {
    label: string;
    value: string | number;
    subValue?: string;
    icon: React.ReactNode;
    bg: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ label, value, subValue, icon, bg }) => (
    <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-start justify-between hover:shadow-md transition">
        <div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wide mb-1">{label}</p>
            <h3 className="text-2xl font-extrabold text-slate-800">{value}</h3>
            {subValue && <p className="text-xs text-slate-400 mt-1 font-medium">{subValue}</p>}
        </div>
        <div className={`p-3 rounded-lg ${bg}`}>
            {icon}
        </div>
    </div>
);

export default OwnerDashboard;