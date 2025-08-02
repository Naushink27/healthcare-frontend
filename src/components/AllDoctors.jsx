import React, { useState, useEffect } from 'react';
import PatientSidebar from './PatientSidebar';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { removeUser } from '../utils/userSlice';
import { Menu, Loader2 } from 'lucide-react';
import axios from 'axios';
import { BASE_URL } from '../utils/Constants';

const AllDoctors = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [error, setError] = useState('');
  const [toast, setToast] = useState(false);
  const [loading, setLoading] = useState(true);
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
      setTimeout(() => setToast(false), 3000);
    }
  };

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BASE_URL}/alldoctors`, {
          withCredentials: true,
        });
        const doctorsData = response.data?.doctors;
        if (!doctorsData || doctorsData.length === 0) {
          throw new Error('No doctors found');
        }
        setDoctors(doctorsData);
        setError('');
      } catch (err) {
        setError(
          err.response?.status === 404
            ? 'No doctors found'
            : err.response?.data?.message || err.message || 'Failed to fetch doctors'
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

    fetchDoctors();
  }, [dispatch, navigate]);

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
          {error || 'Doctors fetched successfully!'}
        </div>
      )}
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex">
        <PatientSidebar
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          handleLogout={handleLogout}
        />
        <div className="flex-1 p-6 sm:p-8 max-w-7xl mx-auto">
          <button
            className="lg:hidden p-3 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-colors mb-6 shadow-md"
            onClick={toggleSidebar}
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="bg-white shadow-2xl rounded-xl p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Meet Our Doctors</h2>
            {doctors.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {doctors.map((doctor) => (
                  <div
                    key={doctor.userId}
                    className="bg-gray-50 rounded-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-200 transform hover:-translate-y-1"
                  >
                    <div className="flex items-center space-x-4">
                      {doctor.profilePicture ? (
                        <img
                          src={doctor.profilePicture}
                          alt={`${doctor.firstName} ${doctor.lastName}`}
                          className="w-16 h-16 rounded-full object-cover border-2 border-indigo-200"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/64?text=No+Image';
                          }}
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 border-2 border-gray-300">
                          No Image
                        </div>
                      )}
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800">
                          Dr. {doctor.firstName} {doctor.lastName}
                        </h3>
                        <p className="text-sm text-gray-500">{doctor.specialization}</p>
                      </div>
                    </div>
                    <div className="mt-4 space-y-2">
                      <p className="text-gray-600 text-sm">
                        <span className="font-medium">Experience:</span> {doctor.experience || 0} years
                      </p>
                      <p className="text-gray-600 text-sm">
                        <span className="font-medium">Hospital:</span> {doctor.hospitalName || 'N/A'}
                      </p>
                      <p className="text-gray-600 text-sm">
                        <span className="font-medium">Qualification:</span> {doctor.qualification || 'N/A'}
                      </p>
                    </div>
                    <button
                      className="mt-4 w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-sm font-medium"
                      onClick={() => navigate(`/patient/book-appointment/${doctor.userId}`)}
                    >
                      Book Appointment
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 text-lg">No doctors available at this time.</p>
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

export default AllDoctors;