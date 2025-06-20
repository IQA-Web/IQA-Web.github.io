import React from 'react';

interface RatingSliderProps {
  label: string;
  description: string;
  value: number;
  onChange: (value: number) => void;
  scale: string[];
  color?: string;
}

export const RatingSlider: React.FC<RatingSliderProps> = ({
  label,
  description,
  value,
  onChange,
  scale,
  color = 'blue'
}) => {
  const getColorClasses = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      purple: 'bg-purple-500',
      orange: 'bg-orange-500',
      red: 'bg-red-500',
      indigo: 'bg-indigo-500'
    };
    return colorMap[color] || colorMap.blue;
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-gray-800">{label}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
        <span className="text-lg font-bold text-gray-900 min-w-[3rem] text-right">
          {value}/5
        </span>
      </div>
      
      <div className="space-y-2">
        <div className="relative">
          <input
            type="range"
            min="1"
            max="5"
            step="1"
            value={value}
            onChange={(e) => onChange(parseInt(e.target.value))}
            className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, ${getColorClasses(color).replace('bg-', '')} 0%, ${getColorClasses(color).replace('bg-', '')} ${((value - 1) / 4) * 100}%, #e5e7eb ${((value - 1) / 4) * 100}%, #e5e7eb 100%)`
            }}
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1 px-1">
            {scale.map((label, index) => (
              <span key={index} className="text-center flex-1">
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};