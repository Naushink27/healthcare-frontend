import React from 'react';
import { Link } from 'react-router-dom';
import { X, Calendar, Users, User, LogOut } from 'lucide-react';

const DoctorSidebar = ({ isSidebarOpen, toggleSidebar, handleLogout }) => {
  return (
    <div
      className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 lg:static lg:inset-0`}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-blue-700">Doctor Dashboard</h2>
        <button className="lg:hidden text-gray-600" onClick={toggleSidebar}>
          <X className="w-6 h-6" />
        </button>
      </div>
      <nav className="flex flex-col p-4 space-y-2">
        <Link
          to="/doctor/dashboard"
          className="flex items-center p-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-md transition-colors"
        >
          <Calendar className="w-5 h-5 mr-3" />
          Dashboard
        </Link>
        <Link
          to="/doctor/appointments"
          className="flex items-center p-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-md transition-colors"
        >
          <Calendar className="w-5 h-5 mr-3" />
          Appointments
        </Link>
        <Link
          to="/doctor/patients"
          className="flex items-center p-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-md transition-colors"
        >
          <Users className="w-5 h-5 mr-3" />
         Feedbacks from patients
        </Link>
        <Link
          to="/doctor/profile"
          className="flex items-center p-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-md transition-colors"
        >
          <User className="w-5 h-5 mr-3" />
          Profile
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center p-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-md transition-colors"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </button>
      </nav>
    </div>
  );
};

export default DoctorSidebar;