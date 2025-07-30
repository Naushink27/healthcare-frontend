import React, { useEffect, useState } from 'react';
import PatientSidebar from './PatientSidebar';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { BASE_URL } from '../utils/Constants';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Menu, FileText, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { removeUser } from '../utils/userSlice';
import Chatbot from './Chatbot';

const PatientDashboard = () => {
  const user = useSelector((store) => store.user.user);
  console.log(user);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = async () => {
    try {
      await axios.post(BASE_URL + '/logout', {}, { withCredentials: true });
    } catch (error) {
      console.error('Logout failed:', error);
    }
    dispatch(removeUser());
    navigate('/login');
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      const res = await axios.get(BASE_URL + '/get/appointments/' + user._id, { withCredentials: true });
      console.log('Appointments fetched:', res.data.appointments);
      setAppointments(res.data.appointments);
    };

    fetchAppointments();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 flex">
      {/* Sidebar */}
      <PatientSidebar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        handleLogout={handleLogout}
      />
      <div className="flex-1 p-6 lg:p-8">
        {/* Sidebar Toggle Button */}
        <button
          className="lg:hidden p-3 rounded-full bg-blue-100 text-blue-600 mb-8 shadow-md hover:bg-blue-200 transition-all"
          onClick={toggleSidebar}
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Header Section */}
        <div className="mb-10">
          <div className="flex items-center justify-between flex-wrap gap-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
                Welcome Back, {user.firstName.toUpperCase()}
              </h1>
              <p className="text-gray-600 mt-3 text-lg">Manage your health with ease.</p>
            </div>
            <img
              src={user.profilePicture}
              alt="Profile"
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-blue-200 shadow-lg hover:shadow-xl transition-shadow"
            />
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Appointments Card */}
          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-blue-700">Total Appointments</h2>
              <Calendar className="w-6 h-6 text-blue-500" />
            </div>
            <p className="text-5xl font-extrabold text-gray-800 mb-6">{appointments.length}</p>
            <Link
              to="/patient/appointments"
              className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-lg hover:from-blue-700 hover:to-teal-600 transition-all"
            >
              View Schedule
            </Link>
          </div>

          {/* Quick Actions Card */}
          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <h2 className="text-xl font-semibold text-blue-700 mb-6">Quick Actions</h2>
            <div className="space-y-4">
              <Link to="/patient/appointment">
                <button className="w-full px-6 py-3 bg-blue-50 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-100 transition-all text-lg">
                  Schedule Appointment
                </button>
              </Link>
              <Link to="/patient/profile">
                <button className="w-full px-6 py-3 bg-blue-50 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-100 transition-all text-lg">
                  Update Profile
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Chatbot Sidebar */}
        <div className="mt-8 lg:mt-0 lg:ml-8">
          <div className="bg-white rounded-xl p-4 shadow-lg hover:shadow-xl transition-shadow h-[600px]">
            <Chatbot />
          </div>
        </div>
      </div>

      {/* Overlay for Mobile Sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  );
};

export default PatientDashboard;