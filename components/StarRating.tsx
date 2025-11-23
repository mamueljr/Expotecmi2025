import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
  description?: string;
}

export const StarRating: React.FC<StarRatingProps> = ({ label, value, onChange, description }) => {
  const [hover, setHover] = useState(0);

  return (
    <div className="w-full">
      <div className="mb-4">
        <label className="block text-xl font-bold text-slate-800 tracking-tight">{label}</label>
        {description && <p className="text-base text-slate-500 mt-1 font-medium">{description}</p>}
      </div>
      
      <div className="flex justify-between items-center max-w-sm sm:justify-start sm:gap-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            onClick={() => onChange(star)}
            className={`p-1 rounded-full transition-all duration-200 transform focus:outline-none ${
              star <= (hover || value) ? 'scale-110' : 'scale-100 hover:scale-110'
            }`}
          >
            <Star 
              className={`w-10 h-10 sm:w-12 sm:h-12 transition-all duration-300 ${
                star <= (hover || value)
                  ? 'text-yellow-400 fill-yellow-400 drop-shadow-sm' 
                  : 'text-slate-200 fill-slate-50'
              }`} 
              strokeWidth={star <= (hover || value) ? 0 : 2}
            />
          </button>
        ))}
      </div>
      
      <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-300 mt-3 px-2 max-w-sm">
        <span>Malo</span>
        <span>Excelente</span>
      </div>
    </div>
  );
};