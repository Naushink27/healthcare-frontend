import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { removeUser } from '../utils/userSlice';
import { Menu, Loader2, Calendar, Clock } from 'lucide-react'; // Added Clock icon
import axios from 'axios';
import { BASE_URL } from '../utils/Constants';
import PatientSidebar from './PatientSidebar';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import DOMPurify from 'dompurify';
import { combineReducers } from '@reduxjs/toolkit';

const BookAppointment = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [doctor, setDoctor] = useState(null);
  const [appointmentDate, setAppointmentDate] = useState(null);
  const [appointmentTime, setAppointmentTime] = useState(null); // Changed to store Date object
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [toast, setToast] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { doctorId } = useParams();
  const user = useSelector((store) => store.user.user);
  console.log('User from Redux store:', user);
  const patientId = user?._id;

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
      setTimeout(() => setToast(false), 3000);
    }
  };

  useEffect(() => {
    const fetchDoctor = async () => {
      if (!patientId) {
        setError('Please log in to book an appointment');
        setToast(true);
        setTimeout(() => setToast(false), 3000);
        navigate('/login');
        return;
      }

      try {
        setLoading(true);
        console.log('Fetching doctor with ID:', doctorId);
        const response = await axios.get(`${BASE_URL}/doctor/get/profile/${doctorId}`, {
          withCredentials: true,
        });
        console.log('Full response:', response.data);
        const doctorData = response.data?.doctor;
        console.log('Doctor data:', doctorData);
        if (!doctorData) {
          throw new Error('Doctor not found');
        }
        setDoctor(doctorData);
        setError('');
      } catch (err) {
        console.error('Fetch doctor error:', err.response ? err.response.data : err);
        setError(
          err.response?.status === 404
            ? 'Doctor not found'
            : err.response?.data?.message || err.message || 'Failed to fetch doctor details'
        );
        setToast(true);
        setTimeout(() => setToast(false), 3000);
        if (err.response?.status === 401 || err.response?.status === 403) {
          dispatch(removeUser());
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [doctorId, patientId, dispatch, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!appointmentDate || !appointmentTime || !description) {
      setError('Please fill in all required fields');
      setToast(true);
      setTimeout(() => setToast(false), 3000);
      return;
    }
console.log('Submitting appointment with data:', {
      patientId,
      appointmentDate: appointmentDate.toISOString(),
      appointmentTime: appointmentTime.toISOString(),
      description,
    });
    // Format time to HH:MM
    const formattedTime = appointmentTime
      ? `${appointmentTime.getHours().toString().padStart(2, '0')}:${appointmentTime.getMinutes().toString().padStart(2, '0')}`
      : '';
    if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(formattedTime)) {
      setError('Please select a valid time');
      console.error('Invalid time format:', formattedTime);
      setToast(true);
      setTimeout(() => setToast(false), 3000);
      return;
    }

    if (appointmentDate <= new Date()) {
      setError('Appointment date must be in the future');
      setToast(true);
      setTimeout(() => setToast(false), 3000);
      return;
    }

    try {
      setIsSubmitting(true);
      const sanitizedDescription = DOMPurify.sanitize(description);
      const response = await axios.post(
        `${BASE_URL}/book/appointment/${doctorId}`,
        {
          patientId,
          appointmentDate: appointmentDate.toISOString(),
          appointmentTime: formattedTime,
          description: sanitizedDescription,
        },
        { withCredentials: true }
      );
      console.log('Appointment response:', response.data);
      setError('');
      setToast(true);
      setTimeout(() => {
        setToast(false);
        navigate('/patient/appointments');
      }, 2000);
    } catch (err) {
      console.error('Book appointment error:', err.response ? err.response.data : err);
      setError(
        err.response?.status === 404
          ? 'Doctor or patient not found'
          : err.response?.data?.message || err.message || 'Failed to book appointment'
      );
      setToast(true);
      setTimeout(() => setToast(false), 3000);
      if (err.response?.status === 401 || err.response?.status === 403) {
        dispatch(removeUser());
        navigate('/login');
      }
    } finally {
      setIsSubmitting(false);
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
          {error || 'Appointment booked successfully!'}
        </div>
      )}
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex">
        <PatientSidebar
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          handleLogout={handleLogout}
        />
        <div className="flex-1 p-6 sm:p-8 max-w-3xl mx-auto">
          <button
            className="lg:hidden p-3 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-colors mb-6 shadow-md"
            onClick={toggleSidebar}
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="bg-white shadow-2xl rounded-xl p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Book an Appointment</h2>
            {doctor && (
              <div className="flex items-center space-x-4 mb-8">
                {doctor.profilePicture ? (
                  <img
                    src={doctor.profilePicture}
                    alt={`${doctor.firstName} ${doctor.lastName}`}
                    className="w-20 h-20 rounded-full object-cover border-2 border-indigo-200"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/80?text=No+Image';
                    }}
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 border-2 border-gray-300">
                    No Image
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    Dr. {doctor.firstName} {doctor.lastName}
                  </h3>
                  <p className="text-sm text-gray-500">{doctor.specialization}</p>
                  <p className="text-sm text-gray-500">Hospital: {doctor.hospitalName || 'N/A'}</p>
                </div>
              </div>
            )}
            <form className="space-y-6" onSubmit={handleSubmit}>
              <label className="block">
                <span className="text-sm font-medium text-gray-700">Appointment Date *</span>
                <div className="mt-1 relative">
                  <DatePicker
                    selected={appointmentDate}
                    onChange={(date) => setAppointmentDate(date)}
                    minDate={new Date(Date.now() + 24 * 60 * 60 * 1000)} // Tomorrow
                    dateFormat="MMMM d, yyyy"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholderText="Select a date"
                  />
                  <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
              </label>
              <label className="block">
                <span className="text-sm font-medium text-gray-700">Appointment Time *</span>
                <div className="mt-1 relative">
                  <DatePicker
                    selected={appointmentTime}
                    onChange={(date) => setAppointmentTime(date)}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={15} // 15-minute intervals
                    timeCaption="Time"
                    dateFormat="HH:mm"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholderText="Select a time"
                  />
                  <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
              </label>
              <label className="block">
                <span className="text-sm font-medium text-gray-700">Reason for Visit *</span>
                <textarea
                  className="w-full mt-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Describe your symptoms or reason for the visit"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="4"
                ></textarea>
              </label>
              <div className="flex justify-center space-x-4">
                <button
                  type="button"
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors font-medium"
                  onClick={() => navigate('/patient/doctors')}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors font-medium disabled:bg-indigo-300 flex items-center justify-center"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : 'Book Appointment'}
                </button>
              </div>
            </form>
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

export default BookAppointment;