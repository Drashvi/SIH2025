import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  IoVideocamOutline, 
  IoWarningOutline, 
  IoRefreshOutline,
  IoEyeOutline,
  IoEyeOffOutline
} from 'react-icons/io5';
import { Button, Card, CardContent } from '../ui';
import { attendanceApi } from '../../services';

interface VideoStreamProps {
  isActive: boolean;
  onError?: (error: string) => void;
  onStreamLoad?: () => void;
}

export default function VideoStream({ isActive, onError, onStreamLoad }: VideoStreamProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [retryCount, setRetryCount] = useState(0);
  const imgRef = useRef<HTMLImageElement>(null);

  const maxRetries = 3;
  const videoStreamUrl = attendanceApi.getVideoStreamUrl();

  useEffect(() => {
    if (isActive) {
      loadStream();
    } else {
      setHasError(false);
      setErrorMessage('');
      setRetryCount(0);
    }
  }, [isActive]);

  const loadStream = () => {
    if (!isActive) return;

    setIsLoading(true);
    setHasError(false);
    setErrorMessage('');

    if (imgRef.current) {
      // Add timestamp to prevent caching issues
      const timestampUrl = `${videoStreamUrl}?t=${Date.now()}`;
      imgRef.current.src = timestampUrl;
    }
  };

  const handleImageLoad = () => {
    setIsLoading(false);
    setHasError(false);
    setRetryCount(0);
    onStreamLoad?.();
  };

  const handleImageError = () => {
    setIsLoading(false);
    const error = 'Failed to load video stream. Please check if the Flask server is running.';
    setErrorMessage(error);
    setHasError(true);
    onError?.(error);

    // Auto-retry with exponential backoff
    if (retryCount < maxRetries && isActive) {
      const delay = Math.min(1000 * Math.pow(2, retryCount), 10000);
      setTimeout(() => {
        setRetryCount(prev => prev + 1);
        loadStream();
      }, delay);
    }
  };

  const handleManualRetry = () => {
    setRetryCount(0);
    loadStream();
  };

  if (!isActive) {
    return (
      <Card className="w-full max-w-4xl mx-auto shadow-lg">
        <CardContent className="p-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6"
          >
            <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
              <IoEyeOffOutline className="w-12 h-12 text-gray-400" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Camera Inactive
              </h3>
              <p className="text-gray-500">
                Click "Start Camera" to begin face detection and attendance tracking
              </p>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg border-2 border-green-200">
      <CardContent className="p-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          {/* Video Stream Header */}
          <div className="bg-gradient-to-r from-green-500 to-teal-600 text-white p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <IoVideocamOutline className="w-6 h-6" />
                <span className="font-semibold">Live Face Detection</span>
              </div>
              <div className="flex items-center gap-2">
                <IoEyeOutline className="w-5 h-5" />
                <span className="text-sm">Monitoring Active</span>
              </div>
            </div>
          </div>

          {/* Video Stream Content */}
          <div className="relative bg-black">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center space-y-4"
                >
                  <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <div className="text-white">
                    <p className="font-semibold">Loading video stream...</p>
                    <p className="text-sm text-gray-300 mt-1">
                      Connecting to camera feed
                    </p>
                  </div>
                </motion.div>
              </div>
            )}

            {hasError ? (
              <div className="aspect-video flex items-center justify-center bg-gray-900">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center space-y-4 p-8"
                >
                  <IoWarningOutline className="w-16 h-16 text-red-400 mx-auto" />
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Video Stream Error
                    </h3>
                    <p className="text-gray-300 text-sm max-w-md mx-auto leading-relaxed">
                      {errorMessage}
                    </p>
                    {retryCount >= maxRetries && (
                      <p className="text-red-400 text-sm mt-2">
                        Maximum retry attempts reached
                      </p>
                    )}
                  </div>
                  <Button
                    onClick={handleManualRetry}
                    className="bg-green-600 hover:bg-green-700"
                    size="sm"
                  >
                    <IoRefreshOutline className="w-4 h-4 mr-2" />
                    Retry Connection
                  </Button>
                </motion.div>
              </div>
            ) : (
              <img
                ref={imgRef}
                alt="Face Detection Video Stream"
                className="w-full h-auto max-h-96 object-contain bg-black"
                onLoad={handleImageLoad}
                onError={handleImageError}
                style={{ display: isLoading ? 'none' : 'block' }}
              />
            )}
          </div>

          {/* Status Bar */}
          {!hasError && !isLoading && (
            <div className="bg-gray-800 text-white px-4 py-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Stream Active</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Face Detection On</span>
                  </div>
                </div>
                <div className="text-gray-300">
                  Resolution: Auto • FPS: ~30
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </CardContent>
    </Card>
  );
}
