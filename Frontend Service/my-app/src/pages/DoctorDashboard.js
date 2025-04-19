import React, { useState, useEffect } from 'react';
import { FiUser, FiAward, FiBriefcase, FiDollarSign, FiMapPin, FiPhone, FiMail, FiLogOut } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const DoctorDashboard = () => {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const data = localStorage.getItem('userData');
    if (!data) {
      navigate('/login');
      return;
    }
    setUserData(JSON.parse(data));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('userData');
    navigate('/login');
    toast.success('Logged out successfully');
  };

  if (!userData) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <FiUser className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <div className="text-lg font-medium text-gray-900">Dr. {userData.name}</div>
                <div className="text-sm text-gray-500">{userData.department}</div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              <FiLogOut className="mr-2 h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
            {/* Experience Card */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <FiBriefcase className="h-6 w-6 text-blue-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Experience</dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {userData.experienceYears} Years
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            {/* Rating Card */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <FiAward className="h-6 w-6 text-yellow-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Rating</dt>
                      <dd className="text-lg font-medium text-gray-900">{userData.rating} ⭐</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            {/* Consultation Fee Card */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <FiDollarSign className="h-6 w-6 text-green-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Consultation Fee</dt>
                      <dd className="text-lg font-medium text-gray-900">₹{userData.consultationFee}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {/* Professional Details */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Professional Details</h3>
                <div className="mt-5 space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-2 w-2 bg-blue-400 rounded-full"></div>
                    <span className="text-gray-700">License: {userData.licenseNumber}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="h-2 w-2 bg-blue-400 rounded-full"></div>
                    <span className="text-gray-700">Qualification: {userData.qualification}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="h-2 w-2 bg-blue-400 rounded-full"></div>
                    <span className="text-gray-700">Department: {userData.department}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Hospital Information */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Hospital Information</h3>
                <div className="mt-5 space-y-4">
                  <div className="flex items-center space-x-3">
                    <FiMapPin className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-700">{userData.hospitalName}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FiMapPin className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-700">{userData.address}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FiMapPin className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-700">{userData.city}, {userData.state}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white overflow-hidden shadow rounded-lg sm:col-span-2">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Contact Information</h3>
                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="flex items-center space-x-3">
                    <FiPhone className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-700">{userData.phNumber}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FiMail className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-700">{userData.email}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DoctorDashboard;