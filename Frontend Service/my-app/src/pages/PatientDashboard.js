import React, { useState, useEffect } from 'react';
import { FiUser, FiHeart, FiActivity, FiAlertCircle, FiPhone, FiMail, FiLogOut } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const PatientDashboard = () => {
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

  const getBMICategory = (bmi) => {
    if (bmi < 18.5) return { label: 'Underweight', color: 'text-blue-500', bg: 'bg-blue-50' };
    if (bmi < 25) return { label: 'Normal', color: 'text-green-500', bg: 'bg-green-50' };
    if (bmi < 30) return { label: 'Overweight', color: 'text-yellow-500', bg: 'bg-yellow-50' };
    return { label: 'Obese', color: 'text-red-500', bg: 'bg-red-50' };
  };

  const bmiInfo = getBMICategory(userData.bmi);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                <FiUser className="h-6 w-6 text-gray-600" />
              </div>
              <div className="ml-4">
                <div className="text-lg font-medium text-gray-900">{userData.name}</div>
                <div className="text-sm text-gray-500">{userData.email}</div>
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
          {/* Health Stats Grid */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
            {/* BMI Card */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <FiActivity className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">BMI</dt>
                      <dd className={`text-lg font-medium ${bmiInfo.color}`}>
                        {userData.bmi.toFixed(1)} - {bmiInfo.label}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className={`bg-gray-50 px-5 py-3`}>
                <div className="text-sm">
                  Height: {userData.height} cm | Weight: {userData.weight} kg
                </div>
              </div>
            </div>

            {/* Blood Group Card */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <FiHeart className="h-6 w-6 text-red-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Blood Group</dt>
                      <dd className="text-lg font-medium text-gray-900">{userData.bloodGroup}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            {/* Medical Conditions Card */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <FiAlertCircle className="h-6 w-6 text-yellow-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Medical Conditions</dt>
                      <dd className="text-lg font-medium text-gray-900">{userData.diseases.length}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Medical Details Grid */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {/* Medical History */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Medical History</h3>
                <div className="mt-5 space-y-2">
                  {userData.diseases.map((disease, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <span className="h-2 w-2 bg-red-400 rounded-full"></span>
                      <span className="text-gray-700">{disease}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Allergies */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Allergies</h3>
                <div className="mt-5 flex flex-wrap gap-2">
                  {userData.allergies.map((allergy, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-red-100 text-red-800"
                    >
                      {allergy}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Family History */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Family History</h3>
                <div className="mt-5 space-y-2">
                  {userData.familyDiseases.map((disease, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <span className="h-2 w-2 bg-blue-400 rounded-full"></span>
                      <span className="text-gray-700">{disease}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Contact Information</h3>
                <div className="mt-5 space-y-4">
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

export default PatientDashboard;