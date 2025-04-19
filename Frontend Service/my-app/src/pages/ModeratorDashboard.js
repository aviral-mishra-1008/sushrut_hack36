import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { TestCard } from '../components/TestCard';

export const ModeratorDashboard = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const moderatorUsername = localStorage.getItem('moderatorUsername');
  const timestamp = localStorage.getItem('timestamp');

  useEffect(() => {
    if (!moderatorUsername) {
      navigate('/moderator/login');
      return;
    }
    fetchTests();
  }, [navigate, moderatorUsername]);

  const fetchTests = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/tests/pending-summaries');
      setTests(response.data);
    } catch (error) {
      toast.error('Failed to fetch tests');
      console.error('Error fetching tests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTestUpdate = (updatedTest) => {
    setTests(currentTests => 
      currentTests.map(test => 
        test.TestId === updatedTest.TestId ? updatedTest : test
      )
    );
  };

  const handleLogout = () => {
    localStorage.removeItem('moderatorUsername');
    localStorage.removeItem('timestamp');
    toast.success('Logged out successfully');
    navigate('/moderator/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">Test Reports Dashboard</h1>
            <div className="mt-2 text-sm text-gray-600">
              <p>Moderator: {moderatorUsername}</p>
              <p>Session started: {timestamp}</p>
              <p>Current time: {new Date().toLocaleString()}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 
                     transition-colors duration-300"
          >
            Logout
          </button>
        </div>

        <div className="grid gap-6">
          {tests.map((test) => (
            <TestCard 
              key={test.TestId} 
              test={test} 
              onTestUpdate={handleTestUpdate}
            />
          ))}

          {tests.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No pending test reports found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};