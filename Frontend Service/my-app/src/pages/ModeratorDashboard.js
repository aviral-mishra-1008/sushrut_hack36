import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const ModeratorDashboard = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/moderator/tests', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('moderatorToken')}`
        }
      });
      setTests(response.data);
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('moderatorToken');
        navigate('/moderator/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('moderatorToken');
    navigate('/moderator/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-800">Test Reports Dashboard</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
          >
            Logout
          </button>
        </div>

        <div className="grid gap-6">
          {tests.map((test) => (
            <div
              key={test.TestId}
              className="bg-white p-6 rounded-lg shadow-sm"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-gray-800">{test.name}</h3>
                  <p className="text-sm text-gray-500">Patient: {test.patient.name}</p>
                  <p className="text-sm text-gray-500">Type: {test.testType}</p>
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
                <p className="mt-1 text-gray-600">{test.summary}</p>
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => navigate(`/moderator/test/${test.TestId}`)}
                  className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};