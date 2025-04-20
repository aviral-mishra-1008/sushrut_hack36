import React, { useState, useEffect } from 'react';
import { FiUser, FiClock, FiUserCheck, FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const BookTest = () => {
  const [userData, setUserData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const currentDateTime = "2025-04-20 04:08:32";
  const userLogin = "Ayushman444";

  const [formData, setFormData] = useState({
    patientId: '',
    email: '',
    name: '',
  });

  const testTypes = [
    'PATHOLOGY',
    'RADIOLOGY'
  ];

  useEffect(() => {
    const data = localStorage.getItem('userData');
    if (!data) {
      navigate('/login');
      return;
    }
    const parsedData = JSON.parse(data);
    setUserData(parsedData);
    setFormData(prev => ({
      ...prev,
      patientId: parsedData.userId,
      email: parsedData.email
    }));
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
        console.log(formData);
      const response = await axios.post(
        'http://localhost:8080/api/tests/book',
        formData
      );
      console.log("Booked test successfully")
      toast.success('Test booked successfully!');
      navigate('/patient/dashboard');
    } catch (error) {
      toast.error('Failed to book test. Please try again.');
      console.error('Booking error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!userData) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/patient/dashboard')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200"
              >
                <FiArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                <div className="flex items-center">
                  <FiClock className="mr-2" />
                  {currentDateTime}
                </div>
                <div className="flex items-center">
                  <FiUserCheck className="mr-2" />
                  {userLogin}
                </div>
              </div>
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                  <FiUser className="h-5 w-5 text-gray-600" />
                </div>
                <span className="ml-2 text-sm font-medium text-gray-900">{userData.name}</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow px-5 py-6 sm:px-6">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Book a New Test</h2>
            <p className="text-gray-600">Please fill in the test details below</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Test Name */}
            <div>
              <label htmlFor="testName" className="block text-sm font-medium text-gray-700">
                Test Name
              </label>
              <input
                type="text"
                id="testName"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter test name"
              />
            </div>

            {/* Test Type */}
            <div>
              <label htmlFor="testType" className="block text-sm font-medium text-gray-700">
                Test Type
              </label>
              <select
                id="testType"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                value={formData.testType}
                onChange={(e) => setFormData({ ...formData, testType: e.target.value })}
              >
                <option value="">Select test type</option>
                {testTypes.map((type) => (
                  <option key={type} value={type}>
                    {type.replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>

            {/* Patient Information */}
            <div className="bg-gray-50 rounded-md p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Patient Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500">Name</label>
                  <p className="text-sm text-gray-900">{userData.name}</p>
                </div>
                <div>
                  <label className="block text-xs text-gray-500">Email</label>
                  <p className="text-sm text-gray-900">{userData.email}</p>
                </div>
                <div>
                  <label className="block text-xs text-gray-500">Contact</label>
                  <p className="text-sm text-gray-900">{userData.phNumber}</p>
                </div>
                <div>
                  <label className="block text-xs text-gray-500">Patient ID</label>
                  <p className="text-sm text-gray-900">{userData.userId}</p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full inline-flex justify-center items-center px-6 py-3 border border-transparent 
                  text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500
                  ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Booking Test...
                  </>
                ) : (
                  'Book Test'
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default BookTest;