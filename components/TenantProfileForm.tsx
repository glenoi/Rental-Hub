import React, { useState } from 'react';
import { TenantProfile } from '../types';
import { ShieldCheck, Loader2 } from 'lucide-react';

interface Props {
  onSubmit: (profile: TenantProfile) => void;
  initialData?: Partial<TenantProfile>;
  isSubmitting: boolean;
}

const TenantProfileForm: React.FC<Props> = ({ onSubmit, initialData, isSubmitting }) => {
  const [formData, setFormData] = useState<Partial<TenantProfile>>({
    fullName: '',
    nricOrPassport: '',
    gender: 'Male',
    nationality: 'Malaysian',
    race: '',
    occupation: '',
    companyName: '',
    officeLocation: '',
    monthlyIncome: 0,
    paxAdults: 1,
    paxKids: 0,
    moveInDate: '',
    contractPeriod: 12,
    depositAgreed: false,
    bio: '',
    ...initialData
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    let val: any = value;

    if (type === 'number') val = Number(value);
    if (type === 'checkbox') val = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.depositAgreed) {
      alert("You must agree to the deposit structure to proceed.");
      return;
    }
    onSubmit(formData as TenantProfile);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6 border-b pb-4">
        <div className="p-2 bg-teal-100 rounded-full text-teal-700">
          <ShieldCheck size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">Tenant Risk Profile</h2>
          <p className="text-sm text-slate-500">Mandatory pre-screening to protect both parties.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Section 1: Identity */}
        <div>
          <h3 className="text-sm font-semibold text-teal-700 uppercase tracking-wider mb-3">1. Identity (PDPA Protected)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <input required name="fullName" value={formData.fullName} onChange={handleChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" placeholder="As per IC/Passport" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">IC / Passport No.</label>
              <input required name="nricOrPassport" value={formData.nricOrPassport} onChange={handleChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" placeholder="e.g. 95XXXX-XX-XXXX" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nationality</label>
              <select name="nationality" value={formData.nationality} onChange={handleChange} className="w-full p-2 border rounded-lg outline-none bg-white">
                <option value="Malaysian">Malaysian</option>
                <option value="Expatriate">Expatriate (Visa Required)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Race / Ethnicity</label>
              <input required name="race" value={formData.race} onChange={handleChange} className="w-full p-2 border rounded-lg outline-none" placeholder="For cultural fit pref." />
            </div>
          </div>
        </div>

        {/* Section 2: Employment */}
        <div>
          <h3 className="text-sm font-semibold text-teal-700 uppercase tracking-wider mb-3">2. Employment & Income</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Occupation</label>
              <input required name="occupation" value={formData.occupation} onChange={handleChange} className="w-full p-2 border rounded-lg outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Monthly Income (RM)</label>
              <input required type="number" name="monthlyIncome" value={formData.monthlyIncome} onChange={handleChange} className="w-full p-2 border rounded-lg outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Office Location</label>
              <input required name="officeLocation" value={formData.officeLocation} onChange={handleChange} className="w-full p-2 border rounded-lg outline-none" placeholder="Area (e.g., Bangsar South) - For commute verification" />
            </div>
          </div>
        </div>

        {/* Section 3: Occupancy */}
        <div>
          <h3 className="text-sm font-semibold text-teal-700 uppercase tracking-wider mb-3">3. Living Arrangement</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Adults</label>
              <input required type="number" name="paxAdults" value={formData.paxAdults} onChange={handleChange} className="w-full p-2 border rounded-lg outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Kids</label>
              <input required type="number" name="paxKids" value={formData.paxKids} onChange={handleChange} className="w-full p-2 border rounded-lg outline-none" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Target Move-in</label>
              <input required type="date" name="moveInDate" value={formData.moveInDate} onChange={handleChange} className="w-full p-2 border rounded-lg outline-none" />
            </div>
          </div>
        </div>

        {/* Section 4: Commitment */}
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
          <div className="flex items-start gap-3">
            <input 
              type="checkbox" 
              name="depositAgreed" 
              checked={formData.depositAgreed} 
              onChange={handleChange}
              className="mt-1 h-4 w-4 text-teal-600 rounded border-gray-300 focus:ring-teal-500"
            />
            <div>
              <label className="block text-sm font-medium text-slate-900">
                I agree to the Standard Deposit Structure (2 Months Security + 0.5 Month Utility + 1 Month Advance).
              </label>
              <p className="text-xs text-slate-500 mt-1">
                By checking this, you consent to Rental Hub processing your personal data for credit assessment in accordance with the PDPA.
              </p>
            </div>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg transition shadow-lg flex justify-center items-center gap-2"
        >
          {isSubmitting ? <Loader2 className="animate-spin" /> : 'Submit Profile & Request Viewing'}
        </button>
      </form>
    </div>
  );
};

export default TenantProfileForm;