import React, { useState, useEffect } from 'react';

const Agent = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Sample JSON response data , just writing like this for now
  const sampleResponse = {
    department: "Pulmonology",
    description: "The symptoms given by you indicate that you are most likely suffering from common cough and cold, there is nothing to worry about as of now, the lack of fever and persistent cough indicates the effect of changing seasons is taking its toll on you",
    doctors: [
      {
        id: 1,
        name: "Dr. Sarah Johnson",
        fee: 1500,
        clinicDistance: "2.3 km",
        department: "Pulmonology"
      },
      {
        id: 2,
        name: "Dr. Michael Chen",
        fee: 1800,
        clinicDistance: "3.1 km",
        department: "Pulmonology"
      },
      {
        id: 3,
        name: "Dr. Rajiv Sharma",
        fee: 1200,
        clinicDistance: "1.5 km",
        department: "Pulmonology"
      },
      {
        id: 4,
        name: "Dr. Lisa Patel",
        fee: 2000,
        clinicDistance: "4.0 km",
        department: "Pulmonology"
      },
      {
        id: 5,
        name: "Dr. Amir Khan",
        fee: 1700,
        clinicDistance: "2.8 km",
        department: "Pulmonology"
      }
    ],
    totalResults: 5
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setSearchResults(sampleResponse);
      setIsLoading(false);
    }, 1000);
  };

  // Recent chats data for sidebar
  const recentChats = [
    { id: 1, title: "Persistent Cough" },
    { id: 2, title: "Headache and Fatigue" },
    { id: 3, title: "Back Pain" },
    { id: 4, title: "Allergic Reaction" },
    { id: 5, title: "Insomnia Issues" },
    { id: 6, title: "Digestive Problems" },
  ];

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className={`bg-gray-900 ${isSidebarCollapsed ? 'w-16' : 'w-64'} flex flex-col transition-all duration-300 ease-in-out`}>
        {/* Logo/Brand at top */}
        <div className="p-4 flex items-center border-b border-gray-800">
          {!isSidebarCollapsed && (
            <span className="text-white font-semibold text-xl">SUSHRUT</span>
          )}
          {isSidebarCollapsed && (
            <span className="text-white font-semibold text-xl">S</span>
          )}
        </div>
        
        {/* New Chat Button */}
        <div className="p-4">
          <button className={`flex items-center px-3 py-2 bg-white text-black rounded-lg font-medium hover:bg-gray-100 w-full ${isSidebarCollapsed ? 'justify-center' : ''}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            {!isSidebarCollapsed && <span className="ml-2">New chat</span>}
          </button>
        </div>
        
        {/* Recent Chats */}
        <div className="flex-1 overflow-y-auto">
          <div className={`${isSidebarCollapsed ? 'py-2' : 'p-4'}`}>
            {!isSidebarCollapsed && <p className="text-gray-500 text-xs uppercase font-medium mb-2">Recents</p>}
            <div className="space-y-1">
              {recentChats.map(chat => (
                <button 
                  key={chat.id}
                  className={`flex items-center ${isSidebarCollapsed ? 'justify-center px-2 py-2' : 'px-3 py-2'} text-gray-300 hover:bg-gray-800 rounded-lg w-full text-left`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  {!isSidebarCollapsed && <span className="ml-3 truncate">{chat.title}</span>}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* User settings at bottom */}
        <div className="p-4 border-t border-gray-800">
          <button className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : ''} text-gray-300 hover:bg-gray-800 px-3 py-2 rounded-lg w-full text-left`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {!isSidebarCollapsed && <span className="ml-3">Settings</span>}
          </button>
        </div>
        
        {/* Collapse button */}
        <div className="p-4 border-t border-gray-800">
          <button 
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : ''} text-gray-300 hover:bg-gray-800 px-3 py-2 rounded-lg w-full text-left`}
          >
            {isSidebarCollapsed ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            ) : (
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                </svg>
                <span className="ml-3">Collapse</span>
              </div>
            )}
          </button>
        </div>
      </div>
      
      {/* Main Content - keeping everything the same */}
      <div className="flex-1 overflow-auto">
        <div className="min-h-screen flex flex-col bg-gradient-to-r from-purple-900 via-purple-800 to-pink-700">
          <div className="px-6 pt-8 pb-4">
            <h1 className="text-4xl font-bold tracking-wider text-white">SUSHRUT</h1>
          </div>
          
          {searchResults ? (
            <div className="flex flex-col px-4 sm:px-8 pb-12">
              {/* Results container */}
              <div className="bg-black bg-opacity-40 rounded-xl p-6 mb-8 max-w-4xl mx-auto w-full">
                <p className="text-white text-lg mb-4">
                  {searchResults.description}
                </p>
                <p className="text-white text-lg mb-6">
                  You are recommended to choose any one of the doctors listed below and accordingly book your appointment for further examination
                </p>
                
                {/* Doctor cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                  {searchResults.doctors.map((doctor) => (
                    <div 
                      key={doctor.id} 
                      className="bg-black bg-opacity-50 rounded-lg p-4 flex flex-col items-center cursor-pointer hover:bg-opacity-70 transition-all duration-300"
                    >
                      <div className="w-16 h-16 bg-red-900 rounded-full mb-3 flex items-center justify-center">
                        <span className="text-white text-xs">Profile Photo</span>
                      </div>
                      <div className="text-center">
                        <h3 className="text-white text-sm font-medium">{doctor.name}</h3>
                        <p className="text-gray-300 text-sm">₹{doctor.fee}</p>
                        <p className="text-gray-300 text-xs">{doctor.clinicDistance}</p>
                        <p className="text-gray-300 text-xs">{doctor.department}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Search field moved below results */}
              <div className="max-w-2xl mx-auto w-full">
                <div className="mb-2 text-white text-sm ml-1">Search</div>
                <form onSubmit={handleSearch}>
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Type Your Symptoms!" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-black bg-opacity-50 text-white px-5 py-3 rounded-full border border-gray-600 shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <button 
                      type="submit"
                      className="absolute right-3 top-2.5 bg-transparent text-gray-300 hover:text-white p-1 rounded-full"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="text-center mb-12">
                <p className="text-white text-lg opacity-80">Your Health Assistant</p>
              </div>
              
              <div className="w-full max-w-xl px-4">
                <div className="mb-2 text-white text-sm ml-1">Search</div>
                <form onSubmit={handleSearch}>
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Type Your Symptoms!" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-black bg-opacity-50 text-white px-5 py-4 rounded-full border border-gray-600 shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <button 
                      type="submit"
                      className="absolute right-3 top-3.5 bg-transparent text-gray-300 hover:text-white p-1 rounded-full"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </form>
              </div>

              <div className="mt-16 w-full max-w-2xl px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-black bg-opacity-30 rounded-lg p-6 border border-gray-700 hover:bg-opacity-40 transition-all duration-300 cursor-pointer">
                    <div className="text-purple-300 mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <h3 className="text-white text-lg font-medium mb-1">Medical Records</h3>
                    <p className="text-gray-300 text-sm">Access and manage your medical history</p>
                  </div>
                  
                  <div className="bg-black bg-opacity-30 rounded-lg p-6 border border-gray-700 hover:bg-opacity-40 transition-all duration-300 cursor-pointer">
                    <div className="text-purple-300 mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-white text-lg font-medium mb-1">Appointments</h3>
                    <p className="text-gray-300 text-sm">Schedule and track your appointments</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-auto py-4 flex justify-center space-x-6 text-white opacity-70">
            <a href="#" className="hover:text-purple-300 text-sm">About</a>
            <a href="#" className="hover:text-purple-300 text-sm">Privacy</a>
            <a href="#" className="hover:text-purple-300 text-sm">Contact</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Agent;