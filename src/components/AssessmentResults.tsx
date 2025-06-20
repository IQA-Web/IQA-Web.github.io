import React from 'react';
import { BarChart3, Download, Trash2, Calendar } from 'lucide-react';
import { ImageAssessment } from '../types';

interface AssessmentResultsProps {
  assessments: ImageAssessment[];
  onDeleteAssessment: (id: string) => void;
  className?: string;
}

export const AssessmentResults: React.FC<AssessmentResultsProps> = ({
  assessments,
  onDeleteAssessment,
  className = ''
}) => {
  const exportResults = () => {
    const csvContent = [
      'Image Name,Overall,Sharpness,Brightness,Contrast,Color Accuracy,Noise,Average,Comments,Date',
      ...assessments.map(assessment => {
        const avg = Object.values(assessment.ratings).reduce((sum, rating) => sum + rating, 0) / Object.values(assessment.ratings).length;
        return [
          assessment.imageName,
          assessment.ratings.overall,
          assessment.ratings.sharpness,
          assessment.ratings.brightness,
          assessment.ratings.contrast,
          assessment.ratings.colorAccuracy,
          assessment.ratings.noise,
          avg.toFixed(2),
          `"${assessment.comments.replace(/"/g, '""')}"`,
          assessment.timestamp.toISOString()
        ].join(',');
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `image_quality_assessments_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (assessments.length === 0) {
    return (
      <div className={`bg-white rounded-xl shadow-lg p-8 text-center ${className}`}>
        <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-600 mb-2">No Assessments Yet</h3>
        <p className="text-gray-500">Start by uploading and rating some images to see results here.</p>
      </div>
    );
  }

  const overallStats = {
    total: assessments.length,
    averageOverall: assessments.reduce((sum, a) => sum + a.ratings.overall, 0) / assessments.length,
    averageSharpness: assessments.reduce((sum, a) => sum + a.ratings.sharpness, 0) / assessments.length,
    averageBrightness: assessments.reduce((sum, a) => sum + a.ratings.brightness, 0) / assessments.length,
    averageContrast: assessments.reduce((sum, a) => sum + a.ratings.contrast, 0) / assessments.length,
    averageColorAccuracy: assessments.reduce((sum, a) => sum + a.ratings.colorAccuracy, 0) / assessments.length,
    averageNoise: assessments.reduce((sum, a) => sum + a.ratings.noise, 0) / assessments.length
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Statistics Overview */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center space-x-2">
            <BarChart3 className="w-6 h-6" />
            <span>Assessment Results</span>
          </h2>
          <button
            onClick={exportResults}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold text-blue-600">{overallStats.total}</p>
            <p className="text-sm text-blue-800">Total Images</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold text-green-600">{overallStats.averageOverall.toFixed(1)}</p>
            <p className="text-sm text-green-800">Avg Overall</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold text-purple-600">{overallStats.averageSharpness.toFixed(1)}</p>
            <p className="text-sm text-purple-800">Avg Sharpness</p>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold text-orange-600">{overallStats.averageNoise.toFixed(1)}</p>
            <p className="text-sm text-orange-800">Avg Noise</p>
          </div>
        </div>
      </div>

      {/* Individual Assessments */}
      <div className="space-y-4">
        {assessments.map((assessment) => {
          const avgRating = Object.values(assessment.ratings).reduce((sum, rating) => sum + rating, 0) / Object.values(assessment.ratings).length;
          return (
            <div key={assessment.id} className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-start space-x-4">
                <img
                  src={assessment.imageUrl}
                  alt={assessment.imageName}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">{assessment.imageName}</h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-blue-600">{avgRating.toFixed(1)}/5</span>
                      <button
                        onClick={() => onDeleteAssessment(assessment.id)}
                        className="text-red-500 hover:text-red-700 p-1"
                        title="Delete Assessment"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mb-3">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Overall</p>
                      <p className="font-semibold text-blue-600">{assessment.ratings.overall}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Sharpness</p>
                      <p className="font-semibold text-green-600">{assessment.ratings.sharpness}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Brightness</p>
                      <p className="font-semibold text-purple-600">{assessment.ratings.brightness}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Contrast</p>
                      <p className="font-semibold text-orange-600">{assessment.ratings.contrast}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Color</p>
                      <p className="font-semibold text-red-600">{assessment.ratings.colorAccuracy}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Noise</p>
                      <p className="font-semibold text-indigo-600">{assessment.ratings.noise}</p>
                    </div>
                  </div>

                  {assessment.comments && (
                    <div className="bg-gray-50 p-3 rounded-lg mb-3">
                      <p className="text-sm text-gray-700">{assessment.comments}</p>
                    </div>
                  )}

                  <div className="flex items-center text-xs text-gray-500">
                    <Calendar className="w-3 h-3 mr-1" />
                    <span>{assessment.timestamp.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};