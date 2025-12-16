import React from 'react';
import { Property } from '../types';
import { MapPin, BedDouble, Bath, Square, Train } from 'lucide-react';

interface Props {
  property: Property;
  onViewDetails: (property: Property) => void;
}

const PropertyCard: React.FC<Props> = ({ property, onViewDetails }) => {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition border border-slate-100 flex flex-col h-full group">
      <div className="relative h-48 overflow-hidden">
        <img src={property.images[0]} alt={property.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-md">
          {property.type}
        </div>
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-slate-800 line-clamp-1">{property.title}</h3>
            <p className="font-bold text-teal-600 text-lg">RM{property.price}</p>
        </div>
        
        <div className="flex items-center text-slate-500 text-sm mb-4">
          <MapPin size={14} className="mr-1" />
          <span className="truncate">{property.location}</span>
        </div>

        <div className="flex gap-4 mb-4 text-slate-600 text-sm">
            <div className="flex items-center gap-1">
                <BedDouble size={16} /> {property.rooms}
            </div>
            <div className="flex items-center gap-1">
                <Bath size={16} /> {property.bathrooms}
            </div>
            <div className="flex items-center gap-1">
                <Square size={16} /> {property.sqft} sqft
            </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
            {property.tags.slice(0, 2).map(tag => (
                <span key={tag} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded flex items-center">
                   {tag.includes('LRT') || tag.includes('MRT') ? <Train size={10} className="mr-1" /> : null} {tag}
                </span>
            ))}
        </div>

        <div className="mt-auto">
            <button 
                onClick={() => onViewDetails(property)}
                className="w-full py-2 border border-teal-600 text-teal-600 hover:bg-teal-50 font-semibold rounded-lg transition"
            >
                View Details
            </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;