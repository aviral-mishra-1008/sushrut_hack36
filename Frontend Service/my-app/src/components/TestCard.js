import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

export const TestCard = ({ test, onTestUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [summary, setSummary] = useState(test.summary || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleVerify = async () => {
    setIsSubmitting(true);
    try {
      const response = await axios.put(
        `http://localhost:8080/api/tests/${test.TestId}/verify-summary`,
        { summary }
      );
      toast.success('Test summary verified successfully');
      onTestUpdate(response.data);
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to verify test summary');
      console.error('Error verifying test:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-medium text-gray-800">{test.name}</h3>
          <p className="text-sm text-gray-500">Patient: {test.patient.name}</p>
          <p className="text-sm text-gray-500">Type: {test.testType}</p>
          <p className="text-sm text-gray-500">Created: {new Date(test.createdAt).toLocaleString()}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm ${
          test.summaryStatus === 'VERIFIED' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-yellow-100 text-yellow-800'
        }`}>
          {test.summaryStatus}
        </span>
      </div>
      
      <div className="mt-4">
        <h4 className="text-sm font-medium text-gray-700">Summary:</h4>
        {isEditing ? (
          <textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            className="mt-1 w-full h-32 p-2 border border-gray-200 rounded-md focus:outline-none 
                     focus:ring-2 focus:ring-purple-500"
            placeholder="Enter test summary..."
          />
        ) : (
          <p className="mt-1 text-gray-600">{test.summary || 'No summary available'}</p>
        )}
      </div>

      <div className="mt-4 flex gap-2">
        {isEditing ? (
          <>
            <button
              onClick={handleVerify}
              disabled={isSubmitting}
              className={`px-4 py-2 text-sm text-white rounded
                       ${isSubmitting ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'}
                       transition-colors duration-300`}
            >
              {isSubmitting ? 'Saving...' : 'Save & Verify'}
            </button>
            <button
              onClick={() => setIsEditing(false)}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200
                       transition-colors duration-300"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 text-sm bg-purple-50 text-purple-700 rounded hover:bg-purple-100
                       transition-colors duration-300"
            >
              Edit & Verify
            </button>
            <button
              onClick={() => navigate(`/moderator/test/${test.TestId}`)}
              className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200
                       transition-colors duration-300"
            >
              View Details
            </button>
          </>
        )}
      </div>
    </div>
  );
};