import React, { useEffect, useState } from 'react';
import PatientSidebar from './PatientSidebar';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { BASE_URL } from '../utils/Constants';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Menu, Calendar } from 'lucide-react';
import { removeUser } from '../utils/userSlice';
import Chatbot from './Chatbot';

const PatientDashboard = () => {
  const user = useSelector((store) => store.user.user);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

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
      const res = await axios.get(BASE_URL + '/get/appointments/' + user._id, {
        withCredentials: true,
      });
      setAppointments(res.data.appointments);
    };
    fetchAppointments();
  }, [user._id]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex relative">
      {/* Sidebar */}
      <PatientSidebar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        handleLogout={handleLogout}
      />

      {/* Main Content */}
      <div className="flex-1 p-4 lg:p-8">
        {/* Sidebar Toggle */}
        <button
          className="lg:hidden p-3 rounded-full bg-purple-100 text-purple-600 mb-8 shadow-md hover:bg-purple-200 transition-all"
          onClick={toggleSidebar}
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center justify-between flex-wrap gap-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-tight sm:text-3xl">
                Welcome Back, {user.firstName.toUpperCase()}
              </h1>
              <p className="text-gray-600 mt-3 text-lg sm:text-base">
                Manage your health with ease.
              </p>
            </div>
            <img
              src={user.profilePicture}
              alt="Profile"
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-purple-200 shadow-lg hover:shadow-xl transition-shadow"
            />
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Total Appointments + Quick Actions stacked */}
          <div className="flex flex-col gap-6 lg:col-span-2">
            {/* Total Appointments */}
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow h-[200px]">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-purple-700 sm:text-lg">
                  Total Appointments
                </h2>
                <Calendar className="w-6 h-6 text-purple-500" />
              </div>
              <p className="text-5xl font-extrabold text-gray-800 mb-4 sm:text-4xl">
                {appointments.length}
              </p>
              <Link
                to="/patient/appointments"
                className="inline-block px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg hover:from-purple-700 hover:to-pink-600 transition-all"
              >
                View Schedule
              </Link>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow h-[200px]">
              <h2 className="text-xl font-semibold text-purple-700 mb-4 sm:text-lg">
                Quick Actions
              </h2>
              <div className="space-y-3">
                <Link to="/patient/appointment">
                  <button className="w-full px-4 py-2 bg-purple-50 text-purple-600 border border-purple-200 rounded-lg hover:bg-purple-100 transition-all text-base">
                    Schedule Appointment
                  </button>
                </Link>
                <Link to="/patient/profile">
                  <button className="w-full px-4 py-2 bg-purple-50 text-purple-600 border border-purple-200 rounded-lg hover:bg-purple-100 transition-all text-base">
                    Update Profile
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* Right: Chatbot (conditional) */}
          {isChatOpen && (
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow h-[416px] lg:col-span-1">
              <h2 className="text-xl font-semibold text-purple-700 mb-4 sm:text-lg">
                Chatbot 🤖
              </h2>
              <Chatbot onClose={() => setIsChatOpen(false)} />
            </div>
          )}
        </div>
      </div>

      {/* Chat Icon */}
      <div className="fixed bottom-4 right-4 z-30">
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="bg-gradient-to-br from-purple-500 to-pink-500 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all"
          title="Ask AI"
        >
          🤖
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
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
