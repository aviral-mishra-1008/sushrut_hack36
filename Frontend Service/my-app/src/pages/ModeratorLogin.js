import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

// Hardcoded moderator credentials
const MODERATORS = {
  'moderator1': 'pass123',
  'moderator2': 'pass456',
  'moderator3': 'pass789'
};

export const ModeratorLogin = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    const moderator = localStorage.getItem('moderatorUsername');
    if (moderator) {
      navigate('/moderator/dashboard');
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    const { username, password } = credentials;
    
    if (MODERATORS[username] === password) {
      localStorage.setItem('moderatorUsername', username);
      localStorage.setItem('timestamp', '2025-04-19 21:12:22');
      toast.success('Login successful!');
      navigate('/moderator/dashboard');
    } else {
      setError('Invalid credentials');
      toast.error('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50 flex items-center justify-center">
      <div className="w-full max-w-md">
        <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-8 space-y-6">
          <h2 className="text-2xl font-medium text-gray-800 text-center">
            Moderator Access
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                name="username"
                placeholder="Enter moderator username"
                value={credentials.username}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="Enter password"
                value={credentials.password}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {error && (
            <div className="text-sm text-red-500 text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-purple-600 rounded-md hover:bg-purple-700 
                     focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
                     transition-colors duration-300"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};