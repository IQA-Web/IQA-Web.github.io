import React, { useState } from 'react';
import { ZoomIn, ZoomOut, RotateCw, Maximize2 } from 'lucide-react';

interface ImageViewerProps {
  imageUrl: string;
  imageName: string;
  className?: string;
}

export const ImageViewer: React.FC<ImageViewerProps> = ({ imageUrl, imageName, className = '' }) => {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.25));
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);
  const handleFullscreen = () => setIsFullscreen(!isFullscreen);

  return (
    <div className={`relative bg-gray-50 rounded-xl overflow-hidden ${className}`}>
      <div className="absolute top-4 right-4 z-10 flex space-x-2">
        <button
          onClick={handleZoomOut}
          className="p-2 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomIn}
          className="p-2 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={handleRotate}
          className="p-2 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors"
          title="Rotate"
        >
          <RotateCw className="w-4 h-4" />
        </button>
        <button
          onClick={handleFullscreen}
          className="p-2 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors"
          title="Fullscreen"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center justify-center h-full min-h-[400px] p-4">
        <img
          src={imageUrl}
          alt={imageName}
          className="max-w-full max-h-full object-contain transition-transform duration-200"
          style={{
            transform: `scale(${zoom}) rotate(${rotation}deg)`,
          }}
        />
      </div>

      <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 rounded-lg px-3 py-2">
        <p className="text-sm font-medium text-gray-800 truncate max-w-[200px]">
          {imageName}
        </p>
        <p className="text-xs text-gray-600">Zoom: {Math.round(zoom * 100)}%</p>
      </div>

      {isFullscreen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
          <div className="relative max-w-full max-h-full">
            <button
              onClick={handleFullscreen}
              className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-70 transition-colors"
            >
              ×
            </button>
            <img
              src={imageUrl}
              alt={imageName}
              className="max-w-full max-h-full object-contain"
              style={{
                transform: `scale(${zoom}) rotate(${rotation}deg)`,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};