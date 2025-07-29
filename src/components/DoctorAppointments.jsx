import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import axios from 'axios';
import { BASE_URL } from '../utils/Constants';
import DoctorSidebar from './DoctorSidebar';
import { Menu, Loader2 } from 'lucide-react';
import { removeUser } from '../utils/userSlice';

const DoctorAppointments = () => {
  const user = useSelector((store) => store.user.user);
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
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
    const fetchAppointmentsAndPatients = async () => {
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
        const appointmentResponse = await axios.get(`${BASE_URL}/doctor/check/appointments/${user._id}`, {
          withCredentials: true,
        });
        const appointmentsData = appointmentResponse.data?.appointments || [];
        setAppointments(appointmentsData);

        // Get unique patient IDs
        const patientIds = [...new Set(appointmentsData.map((appt) => 
          typeof appt.patientId === 'string' ? appt.patientId : appt.patientId?._id
        ))];

        // Fetch patient profiles concurrently
        const patientPromises = patientIds.map((patientId) =>
          axios.get(`${BASE_URL}/patient/get/profile/${patientId}`, { withCredentials: true })
            .then((response) => ({ patientId, data: response.data?.patient }))
            .catch(() => ({ patientId, data: null }))
        );

        const patientResponses = await Promise.all(patientPromises);
        const patientMap = patientResponses.reduce((acc, { patientId, data }) => {
          acc[patientId] = data && data.userId ? { firstName: data.userId.firstName, lastName: data.userId.lastName } : null;
          return acc;
        }, {});

        setPatients(patientMap);
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

    fetchAppointmentsAndPatients();
  }, [user, navigate, dispatch]);

  const getAppointmentTime = (appt) => {
    if (appt.appointmentTime) {
      return appt.appointmentTime.split(':').slice(0, 2).join(':');
    }
    return format(parseISO(appt.appointmentDate), 'HH:mm');
  };

  const getPatientName = (appt) => {
    const patientId = typeof appt.patientId === 'string' ? appt.patientId : appt.patientId?._id;
    return patients[patientId]
      ? `${patients[patientId].firstName} ${patients[patientId].lastName}`
      : 'Unknown Patient';
  };

  const handleConfirmAppointment = async () => {
    try {
      const response = await axios.patch(
        `${BASE_URL}/doctor/update/appointment/${selectedAppointmentId}`,
        { status: 'confirmed' },
        { withCredentials: true }
      );
      setAppointments((prevAppointments) =>
        prevAppointments.map((appt) =>
          appt._id === selectedAppointmentId ? { ...appt, status: 'confirmed' } : appt
        )
      );
      setError('Appointment confirmed successfully!');
      setToast(true);
      setTimeout(() => setToast(false), 5000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to confirm appointment');
      setToast(true);
      setTimeout(() => setToast(false), 5000);
    } finally {
      setIsModalOpen(false);
      setSelectedAppointmentId(null);
    }
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
        <DoctorSidebar
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
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Patient</th>
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
                          <td className="px-4 py-3 text-sm text-gray-600">{getPatientName(appt)}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {format(parseISO(appt.appointmentDate), 'MMMM d, yyyy')}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">{getAppointmentTime(appt)}</td>
                          <td className="px-4 py-3 text-sm">
                            <button
                              onClick={() => {
                                if (appt.status === 'pending') {
                                  setSelectedAppointmentId(appt._id);
                                  setIsModalOpen(true);
                                }
                              }}
                              className={`inline-block px-3 py-1 rounded-full text-xs font-medium text-white transition-colors ${
                                appt.status === 'confirmed'
                                  ? 'bg-green-500 cursor-not-allowed'
                                  : appt.status === 'cancelled'
                                  ? 'bg-red-500 cursor-not-allowed'
                                  : 'bg-yellow-500 hover:bg-yellow-600 cursor-pointer'
                              }`}
                              disabled={appt.status !== 'pending'}
                            >
                              {appt.status}
                            </button>
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
                          <span className="font-medium text-gray-700">Patient:</span>
                          <p className="text-sm text-gray-600">{getPatientName(appt)}</p>
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
                          <button
                            onClick={() => {
                              if (appt.status === 'pending') {
                                setSelectedAppointmentId(appt._id);
                                setIsModalOpen(true);
                              }
                            }}
                            className={`inline-block px-3 py-1 rounded-full text-xs font-medium text-white transition-colors ${
                              appt.status === 'confirmed'
                                ? 'bg-green-500 cursor-not-allowed'
                                : appt.status === 'cancelled'
                                ? 'bg-red-500 cursor-not-allowed'
                                : 'bg-yellow-500 hover:bg-yellow-600 cursor-pointer'
                            }`}
                            disabled={appt.status !== 'pending'}
                          >
                            {appt.status}
                          </button>
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
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-30 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Confirm Appointment</h3>
              <p className="text-gray-600 mb-6">Do you want to confirm this appointment?</p>
              <div className="flex justify-end gap-4">
                <button
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition-colors"
                  onClick={() => {
                    setIsModalOpen(false);
                    setSelectedAppointmentId(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                  onClick={handleConfirmAppointment}
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default DoctorAppointments;