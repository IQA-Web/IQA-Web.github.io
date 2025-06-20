import React, { useState, useCallback } from 'react';
import { Eye, Upload, BarChart3, Home } from 'lucide-react';
import { ImageUpload } from './components/ImageUpload';
import { ImageViewer } from './components/ImageViewer';
import { AssessmentForm } from './components/AssessmentForm';
import { AssessmentResults } from './components/AssessmentResults';
import { ImageAssessment } from './types';

type AppState = 'home' | 'assess' | 'results';

function App() {
  const [currentState, setCurrentState] = useState<AppState>('home');
  const [selectedImage, setSelectedImage] = useState<{ url: string; name: string } | null>(null);
  const [assessments, setAssessments] = useState<ImageAssessment[]>([]);

  const handleImageSelect = useCallback((file: File) => {
    const url = URL.createObjectURL(file);
    setSelectedImage({ url, name: file.name });
    setCurrentState('assess');
  }, []);

  const handleSaveAssessment = useCallback((assessment: Omit<ImageAssessment, 'id' | 'timestamp'>) => {
    const newAssessment: ImageAssessment = {
      ...assessment,
      id: crypto.randomUUID(),
      timestamp: new Date()
    };
    setAssessments(prev => [...prev, newAssessment]);
    setCurrentState('results');
    
    // Clean up the object URL
    if (selectedImage) {
      URL.revokeObjectURL(selectedImage.url);
    }
    setSelectedImage(null);
  }, [selectedImage]);

  const handleDeleteAssessment = useCallback((id: string) => {
    setAssessments(prev => prev.filter(assessment => assessment.id !== id));
  }, []);

  const handleStartNew = useCallback(() => {
    setCurrentState('home');
    if (selectedImage) {
      URL.revokeObjectURL(selectedImage.url);
      setSelectedImage(null);
    }
  }, [selectedImage]);

  const renderNavigation = () => (
    <nav className="bg-white shadow-lg mb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
              <Eye className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-800">Image Quality Assessment</h1>
          </div>
          
          <div className="flex space-x-4">
            <button
              onClick={handleStartNew}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                currentState === 'home' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>New Assessment</span>
            </button>
            
            <button
              onClick={() => setCurrentState('results')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                currentState === 'results'
                  ? 'bg-green-100 text-green-700'
                  : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Results ({assessments.length})</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );

  const renderContent = () => {
    switch (currentState) {
      case 'home':
        return (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                Subjective Image Quality Assessment
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Upload images and evaluate their quality across multiple criteria with our comprehensive assessment tool.
              </p>
              <div className="grid md:grid-cols-3 gap-6 mb-12">
                <div className="bg-white p-6 rounded-xl shadow-lg text-center">
                  <div className="bg-blue-100 p-3 rounded-full w-fit mx-auto mb-4">
                    <Upload className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">Upload Image</h3>
                  <p className="text-sm text-gray-600">Select or drag & drop your image to begin assessment</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-lg text-center">
                  <div className="bg-green-100 p-3 rounded-full w-fit mx-auto mb-4">
                    <Eye className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">Rate Quality</h3>
                  <p className="text-sm text-gray-600">Evaluate across 6 quality criteria with detailed scales</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-lg text-center">
                  <div className="bg-purple-100 p-3 rounded-full w-fit mx-auto mb-4">
                    <BarChart3 className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">View Results</h3>
                  <p className="text-sm text-gray-600">Analyze ratings and export data for further analysis</p>
                </div>
              </div>
            </div>
            
            <ImageUpload onImageSelect={handleImageSelect} />
          </div>
        );
        
      case 'assess':
        if (!selectedImage) {
          setCurrentState('home');
          return null;
        }
        return (
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8">
            <ImageViewer 
              imageUrl={selectedImage.url} 
              imageName={selectedImage.name}
              className="h-fit"
            />
            <AssessmentForm
              onSave={handleSaveAssessment}
              imageUrl={selectedImage.url}
              imageName={selectedImage.name}
              className="h-fit"
            />
          </div>
        );
        
      case 'results':
        return (
          <div className="max-w-6xl mx-auto">
            <AssessmentResults
              assessments={assessments}
              onDeleteAssessment={handleDeleteAssessment}
            />
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {renderNavigation()}
      <div className="px-4 sm:px-6 lg:px-8 pb-12">
        {renderContent()}
      </div>
    </div>
  );
}

export default App;