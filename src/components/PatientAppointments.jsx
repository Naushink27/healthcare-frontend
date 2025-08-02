import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import axios from 'axios';
import { BASE_URL } from '../utils/Constants';
import PatientSidebar from './PatientSidebar';
import { Menu, Loader2 } from 'lucide-react';
import { removeUser } from '../utils/userSlice';

const PatientAppointments = () => {
  const user = useSelector((store) => store.user.user);
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState({}); // Store doctor profiles by doctorId
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${BASE_URL}/logout`, {}, { withCredentials: true });
      dispatch(removeUser());
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Failed to logout');
      setToast(true);
      setTimeout(() => setToast(false), 5000);
    }
  };

  useEffect(() => {
    const fetchAppointmentsAndDoctors = async () => {
      if (!user?._id) {
        setError('Please log in to view appointments');
        setToast(true);
        setTimeout(() => {
          setToast(false);
          navigate('/login');
        }, 5000);
        return;
      }

      try {
        setLoading(true);
        // Fetch appointments
        const appointmentResponse = await axios.get(`${BASE_URL}/get/appointments/${user._id}`, {
          withCredentials: true,
        });
        const appointmentsData = appointmentResponse.data?.appointments || [];
        setAppointments(appointmentsData);

        // Get unique doctor IDs
        const doctorIds = [...new Set(appointmentsData.map((appt) => 
          typeof appt.doctorId === 'string' ? appt.doctorId : appt.doctorId?._id
        ))];

        // Fetch doctor profiles concurrently
        const doctorPromises = doctorIds.map((doctorId) =>
          axios.get(`${BASE_URL}/doctor/get/profile/${doctorId}`, { withCredentials: true })
            .then((response) => ({ doctorId, data: response.data?.doctor }))
            .catch(() => ({ doctorId, data: null }))
        );

        const doctorResponses = await Promise.all(doctorPromises);
        const doctorMap = doctorResponses.reduce((acc, { doctorId, data }) => {
          acc[doctorId] = data ? { firstName: data.firstName, lastName: data.lastName } : null;
          return acc;
        }, {});

        setDoctors(doctorMap);
        setError('');
      } catch (err) {
        setError(
          err.response?.status === 404
            ? 'No appointments found'
            : err.response?.data?.message || err.message || 'Failed to fetch appointments'
        );
        setToast(true);
        setTimeout(() => setToast(false), 5000);
        if (err.response?.status === 401 || err.response?.status === 403) {
          dispatch(removeUser());
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAppointmentsAndDoctors();
  }, [user, navigate, dispatch]);

  const getAppointmentTime = (appt) => {
    if (appt.appointmentTime) {
      
      return appt.appointmentTime.split(':').slice(0, 2).join(':');
    }
    return format(parseISO(appt.appointmentDate), 'HH:mm');
  };

  const getDoctorName = (appt) => {
    const doctorId = typeof appt.doctorId === 'string' ? appt.doctorId : appt.doctorId?._id;
    return doctors[doctorId]
      ? `Dr. ${doctors[doctorId].firstName} ${doctors[doctorId].lastName}`
      : 'Unknown Doctor';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <>
      {toast && (
        <div
          className="fixed top-6 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg text-white z-50 transition-all duration-300"
          style={{ backgroundColor: error ? '#ef4444' : '#10b981' }}
        >
          {error || 'Appointments fetched successfully!'}
        </div>
      )}
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex">
        <PatientSidebar
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          handleLogout={handleLogout}
        />
        <div className="flex-1 p-6 sm:p-8 max-w-5xl mx-auto">
          <button
            className="lg:hidden p-3 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-colors mb-6 shadow-md"
            onClick={toggleSidebar}
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="bg-white shadow-2xl rounded-xl p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Your Appointments</h2>
            {appointments.length > 0 ? (
              <>
                {/* Table for larger screens */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full table-auto border-collapse">
                    <thead>
                      <tr className="bg-indigo-100">
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Doctor</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Date</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Time</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Description</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Booked On</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointments.map((appt) => (
                        <tr
                          key={appt._id}
                          className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-4 py-3 text-sm text-gray-600">{getDoctorName(appt)}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {format(parseISO(appt.appointmentDate), 'MMMM d, yyyy')}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">{getAppointmentTime(appt)}</td>
                          <td className="px-4 py-3 text-sm">
                            <span
                              className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                                appt.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : appt.status === 'confirmed'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {appt.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">{appt.description}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {format(parseISO(appt.createdAt), 'MMMM d, yyyy')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {/* Cards for smaller screens */}
                <div className="lg:hidden space-y-6">
                  {appointments.map((appt) => (
                    <div
                      key={appt._id}
                      className="bg-gray-50 rounded-lg p-6 shadow-md border border-gray-200"
                    >
                      <div className="space-y-3">
                        <div>
                          <span className="font-medium text-gray-700">Doctor:</span>
                          <p className="text-sm text-gray-600">{getDoctorName(appt)}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Date:</span>
                          <p className="text-sm text-gray-600">
                            {format(parseISO(appt.appointmentDate), 'MMMM d, yyyy')}
                          </p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Time:</span>
                          <p className="text-sm text-gray-600">{getAppointmentTime(appt)}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Status:</span>
                          <p>
                            <span
                              className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                                appt.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : appt.status === 'confirmed'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {appt.status}
                            </span>
                          </p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Description:</span>
                          <p className="text-sm text-gray-600">{appt.description}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Booked On:</span>
                          <p className="text-sm text-gray-600">
                            {format(parseISO(appt.createdAt), 'MMMM d, yyyy')}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-center text-gray-500 text-lg">No appointments found.</p>
            )}
          </div>
        </div>
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-60 z-20 lg:hidden"
            onClick={toggleSidebar}
          ></div>
        )}
      </div>
    </>
  );
};

export default PatientAppointments;