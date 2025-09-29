import React, { useState, useEffect } from 'react';
import { Clock, Users, AlertCircle } from 'lucide-react';

const TimeEstimate = ({ productType, specifications, onEstimateReceived }) => {
  const [estimate, setEstimate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (productType && specifications) {
      fetchEstimate();
    }
  }, [productType, specifications]);

  const fetchEstimate = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/design/estimate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_type: productType,
          specifications: specifications
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setEstimate(data);
        if (onEstimateReceived) {
          onEstimateReceived(data);
        }
      } else {
        setError(data.error || 'Failed to get estimate');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    if (seconds < 60) {
      return `${seconds} seconds`;
    } else if (seconds < 3600) {
      const minutes = Math.round(seconds / 60);
      return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
    } else {
      const hours = Math.round(seconds / 3600 * 10) / 10;
      return `${hours} hour${hours !== 1 ? 's' : ''}`;
    }
  };

  if (loading) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <Clock className="h-5 w-5 text-blue-600 animate-spin" />
          <span className="text-blue-800">Calculating estimate...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <span className="text-red-800">{error}</span>
        </div>
      </div>
    );
  }

  if (!estimate) {
    return null;
  }

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-3">
      <div className="flex items-center space-x-2">
        <Clock className="h-5 w-5 text-green-600" />
        <h3 className="font-semibold text-green-800">Time Estimate</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Design Generation:</span>
            <span className="font-medium text-green-800">
              {estimate.estimate.human_readable}
            </span>
          </div>
          
          {estimate.queue.queue_position > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-600">Queue Wait:</span>
              <span className="font-medium text-orange-600">
                {formatTime(estimate.queue.estimated_wait_seconds)}
              </span>
            </div>
          )}
          
          <div className="flex justify-between border-t pt-2">
            <span className="font-medium text-gray-700">Total Time:</span>
            <span className="font-bold text-green-800">
              {formatTime(estimate.total_estimated_time)}
            </span>
          </div>
        </div>
        
        <div className="space-y-2">
          {estimate.queue.queue_position > 0 && (
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-orange-600" />
              <span className="text-sm text-orange-600">
                Position {estimate.queue.queue_position} in queue
              </span>
            </div>
          )}
          
          <div className="text-xs text-gray-500">
            Complexity Score: {estimate.estimate.complexity_score.toFixed(1)}x
          </div>
          
          {estimate.queue.queue_position === 0 && (
            <div className="text-xs text-green-600 font-medium">
              ✓ Starting immediately
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimeEstimate;

