import React, { useState } from 'react';
import PatientSidebar from './PatientSidebar';

const PatientDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Sidebar Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 p-2 bg-blue-600 text-white rounded-md"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isSidebarOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Sidebar */}
      <PatientSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <div className={`flex-1 p-4 md:p-8 transition-all duration-300 ${isSidebarOpen ? 'ml-0 md:ml-64' : 'ml-0'}`}>
        <div className="flex items-center mb-6 flex-wrap">
          <img src="https://via.placeholder.com/50" alt="Profile" className="w-12 h-12 rounded-full mr-4" />
          <div>
            <h1 className="text-xl md:text-2xl font-bold">Welcome Back, MAXI</h1>
            <p className="text-gray-600 text-sm md:text-base">Manage your health and appointments efficiently.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {/* Today's Appointments */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Today's Appointments</h2>
            <p className="text-3xl md:text-4xl font-bold text-gray-800">2</p>
            <p className="text-gray-600 text-sm md:text-base">1 new, 1 follow-up</p>
            <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 w-full sm:w-auto">
              View Schedule
            </button>
          </div>

          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <button className="w-full border border-gray-300 text-gray-700 py-2 rounded-md mb-2 hover:bg-gray-100 text-sm md:text-base">
              Book Appointment
            </button>
            <button className="w-full border border-gray-300 text-gray-700 py-2 rounded-md mb-2 hover:bg-gray-100 text-sm md:text-base">
              View Health Reports
            </button>
            <button className="w-full border border-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-100 text-sm md:text-base">
              Update Profile
            </button>
          </div>

          {/* Patient Stats */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Health Stats</h2>
            <p className="text-3xl md:text-4xl font-bold text-gray-800">15</p>
            <p className="text-gray-600 text-sm md:text-base">Total visits this month</p>
            <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 w-full sm:w-auto">
              View Records
            </button>
          </div>
        </div>

        {/* Recent Doctors */}
        <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
          <h2 className="text-lg font-semibold mb-4">Recent Doctors</h2>
          <table className="w-full text-left text-sm md:text-base">
            <thead>
              <tr className="text-gray-600">
                <th className="pb-2">Name</th>
                <th className="pb-2">Last Visit</th>
                <th className="pb-2">Specialty</th>
                <th className="pb-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t">
                <td className="py-2">Dr. John Smith</td>
                <td className="py-2">2025-05-27</td>
                <td className="py-2">
                  <span className="text-green-600 bg-green-100 px-2 py-1 rounded-full text-xs md:text-sm">Cardiologist</span>
                </td>
                <td className="py-2 flex gap-2 flex-wrap">
                  <button className="text-blue-600 hover:underline text-xs md:text-sm">Book Again</button>
                  <button className="text-gray-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-3-3v6m-9 3h18a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </button>
                </td>
              </tr>
              <tr className="border-t">
                <td className="py-2">Dr. Emily Brown</td>
                <td className="py-2">2025-05-26</td>
                <td className="py-2">
                  <span className="text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full text-xs md:text-sm">Pediatrician</span>
                </td>
                <td className="py-2 flex gap-2 flex-wrap">
                  <button className="text-blue-600 hover:underline text-xs md:text-sm">Book Again</button>
                  <button className="text-gray-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-3-3v6m-9 3h18a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;