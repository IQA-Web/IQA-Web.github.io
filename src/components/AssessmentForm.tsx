import React, { useState } from 'react';
import { Save, MessageSquare } from 'lucide-react';
import { RatingSlider } from './RatingSlider';
import { AssessmentCriteria, ImageAssessment } from '../types';

interface AssessmentFormProps {
  onSave: (assessment: Omit<ImageAssessment, 'id' | 'timestamp'>) => void;
  imageUrl: string;
  imageName: string;
  className?: string;
}

const assessmentCriteria: AssessmentCriteria[] = [
  {
    name: 'Overall Quality',
    key: 'overall',
    description: 'General impression of image quality',
    scale: ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent']
  },
  {
    name: 'Sharpness',
    key: 'sharpness',
    description: 'How clear and well-defined the details appear',
    scale: ['Blurry', 'Soft', 'Adequate', 'Sharp', 'Very Sharp']
  },
  {
    name: 'Brightness',
    key: 'brightness',
    description: 'Overall brightness and exposure level',
    scale: ['Too Dark', 'Dark', 'Good', 'Bright', 'Too Bright']
  },
  {
    name: 'Contrast',
    key: 'contrast',
    description: 'Difference between light and dark areas',
    scale: ['Very Low', 'Low', 'Moderate', 'High', 'Very High']
  },
  {
    name: 'Color Accuracy',
    key: 'colorAccuracy',
    description: 'How natural and accurate the colors appear',
    scale: ['Poor', 'Unrealistic', 'Acceptable', 'Good', 'Natural']
  },
  {
    name: 'Noise Level',
    key: 'noise',
    description: 'Amount of visual noise or grain (1=very noisy, 5=no noise)',
    scale: ['Very Noisy', 'Noisy', 'Some Noise', 'Low Noise', 'No Noise']
  }
];

const criteriaColors = ['blue', 'green', 'purple', 'orange', 'red', 'indigo'];

export const AssessmentForm: React.FC<AssessmentFormProps> = ({
  onSave,
  imageUrl,
  imageName,
  className = ''
}) => {
  const [ratings, setRatings] = useState({
    overall: 3,
    sharpness: 3,
    brightness: 3,
    contrast: 3,
    colorAccuracy: 3,
    noise: 3
  });
  const [comments, setComments] = useState('');

  const handleRatingChange = (key: keyof typeof ratings, value: number) => {
    setRatings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    onSave({
      imageUrl,
      imageName,
      ratings,
      comments
    });
  };

  const averageRating = Object.values(ratings).reduce((sum, rating) => sum + rating, 0) / Object.values(ratings).length;

  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Quality Assessment</h2>
        <div className="text-right">
          <p className="text-sm text-gray-600">Average Score</p>
          <p className="text-2xl font-bold text-blue-600">{averageRating.toFixed(1)}/5</p>
        </div>
      </div>

      <div className="space-y-6">
        {assessmentCriteria.map((criteria, index) => (
          <div key={criteria.key} className="p-4 bg-gray-50 rounded-lg">
            <RatingSlider
              label={criteria.name}
              description={criteria.description}
              value={ratings[criteria.key]}
              onChange={(value) => handleRatingChange(criteria.key, value)}
              scale={criteria.scale}
              color={criteriaColors[index]}
            />
          </div>
        ))}

        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2 mb-3">
            <MessageSquare className="w-5 h-5 text-gray-600" />
            <h3 className="font-semibold text-gray-800">Additional Comments</h3>
          </div>
          <textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Add any additional observations or comments about the image quality..."
            className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={4}
          />
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg"
        >
          <Save className="w-5 h-5" />
          <span>Save Assessment</span>
        </button>
      </div>
    </div>
  );
};