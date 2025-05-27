import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { removeUser } from '../utils/userSlice';
import { Menu, X, Calendar, Users, User, FileText, LogOut } from 'lucide-react';

const DoctorDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${BASE_URL}/logout`, {}, { withCredentials: true });
    } catch (error) {
      console.error('Logout failed:', error);
    }
    dispatch(removeUser());
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
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
            Patients
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
      <div className="flex-1 p-4 sm:p-6 lg:p-8">
        <button
          className="lg:hidden p-2 rounded-md bg-gray-200 text-gray-600 mb-4"
          onClick={toggleSidebar}
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Welcome, Dr. Smith</h1>
          <p className="text-gray-600 mt-1">Manage your appointments and patients efficiently.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-lg font-semibold text-blue-700 mb-2">Today's Appointments</h2>
            <p className="text-3xl sm:text-4xl font-bold text-gray-800">12</p>
            <p className="text-gray-600 mt-1">3 new, 9 follow-ups</p>
            <div className="mt-4">
              <Link
                to="/doctor/appointments"
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                View Schedule
              </Link>
            </div>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-lg font-semibold text-blue-700 mb-2">Quick Actions</h2>
            <div className="space-y-2">
              <button className="w-full px-4 py-2 bg-transparent border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors">
                Schedule Appointment
              </button>
              <button className="w-full px-4 py-2 bg-transparent border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors">
                View Patient Reports
              </button>
              <button className="w-full px-4 py-2 bg-transparent border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors">
                Update Profile
              </button>
            </div>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-lg font-semibold text-blue-700 mb-2">Patient Statistics</h2>
            <p className="text-3xl sm:text-4xl font-bold text-gray-800">245</p>
            <p className="text-gray-600 mt-1">Total patients this month</p>
            <div className="mt-4">
              <Link
                to="/doctor/patients"
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                View Patients
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-6 sm:mt-8 bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-blue-700 mb-4">Recent Patients</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-3 px-4 text-gray-700 font-medium">Name</th>
                    <th className="py-3 px-4 text-gray-700 font-medium">Last Visit</th>
                    <th className="py-3 px-4 text-gray-700 font-medium">Status</th>
                    <th className="py-3 px-4 text-gray-700 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-700">John Doe</td>
                    <td className="py-3 px-4 text-gray-600">2025-05-27</td>
                    <td className="py-3 px-4">
                      <span className="inline-block px-2 py-1 text-sm text-green-700 bg-green-100 rounded-full">
                        Stable
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button className="text-blue-600 hover:text-blue-800">
                        <FileText className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-700">Jane Smith</td>
                    <td className="py-3 px-4 text-gray-600">2025-05-26</td>
                    <td className="py-3 px-4">
                      <span className="inline-block px-2 py-1 text-sm text-yellow-700 bg-yellow-100 rounded-full">
                        Follow-up
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button className="text-blue-600 hover:text-blue-800">
                        <FileText className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-700">Michael Brown</td>
                    <td className="py-3 px-4 text-gray-600">2025-05-25</td>
                    <td className="py-3 px-4">
                      <span className="inline-block px-2 py-1 text-sm text-green-700 bg-green-100 rounded-full">
                        Stable
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button className="text-blue-600 hover:text-blue-800">
                        <FileText className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  );
};

export default DoctorDashboard;