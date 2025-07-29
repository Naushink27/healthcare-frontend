import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import axios from 'axios';
import { BASE_URL } from '../utils/Constants';
import DoctorSidebar from './DoctorSidebar';
import { Menu, Loader2, Star } from 'lucide-react';
import { removeUser } from '../utils/userSlice';

const DoctorFeedback = () => {
  const user = useSelector((store) => store.user.user);
  const [feedbacks, setFeedbacks] = useState([]);
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
    const fetchFeedback = async () => {
      if (!user?._id) {
        setError('Please log in to view feedback');
        setToast(true);
        setTimeout(() => {
          setToast(false);
          navigate('/login');
        }, 5000);
        return;
      }

      try {
        setLoading(true);
        const res = await axios.get(`${BASE_URL}/doctor/get/feedback/${user._id}`, {
          withCredentials: true,
        });
        const feedbackData = res.data?.feedbacks || [];
        setFeedbacks(feedbackData);
        setError('');
      } catch (err) {
        setError(
          err.response?.status === 404
            ? 'No feedback found'
            : err.response?.data?.message || err.message || 'Failed to fetch feedback'
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

    fetchFeedback();
  }, [user, navigate, dispatch]);

  const getPatientName = (feedback) => {
    const patient = feedback.patientId;
    return patient && patient.firstName && patient.lastName
      ? `${patient.firstName} ${patient.lastName}`
      : 'Unknown Patient';
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`w-5 h-5 inline-block ${
            i <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
          }`}
        />
      );
    }
    return stars;
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
          {error || 'Feedback fetched successfully!'}
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
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Your Feedback</h2>
            {feedbacks.length > 0 ? (
              <>
                {/* Table for larger screens */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full table-auto border-collapse">
                    <thead>
                      <tr className="bg-indigo-100">
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Patient</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Rating</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Comments</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {feedbacks.map((feedback) => (
                        <tr
                          key={feedback._id}
                          className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-4 py-3 text-sm text-gray-600 flex items-center gap-2">
                            {feedback.patientId?.profilePicture ? (
                              <img
                                src={feedback.patientId.profilePicture}
                                alt="Patient"
                                className="w-8 h-8 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                                {getPatientName(feedback).charAt(0)}
                              </div>
                            )}
                            <span>{getPatientName(feedback)}</span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">{renderStars(feedback.rating)}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{feedback.comments}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {format(parseISO(feedback.createdAt), 'MMMM d, yyyy')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {/* Cards for smaller screens */}
                <div className="lg:hidden space-y-6">
                  {feedbacks.map((feedback) => (
                    <div
                      key={feedback._id}
                      className="bg-gray-50 rounded-lg p-6 shadow-md border border-gray-200"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <span className="font-medium text-gray-700">Patient:</span>
                          <div className="flex items-center gap-2">
                            {feedback.patientId?.profilePicture ? (
                              <img
                                src={feedback.patientId.profilePicture}
                                alt="Patient"
                                className="w-8 h-8 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                                {getPatientName(feedback).charAt(0)}
                              </div>
                            )}
                            <p className="text-sm text-gray-600">{getPatientName(feedback)}</p>
                          </div>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Rating:</span>
                          <p className="text-sm text-gray-600">{renderStars(feedback.rating)}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Comments:</span>
                          <p className="text-sm text-gray-600">{feedback.comments}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Date:</span>
                          <p className="text-sm text-gray-600">
                            {format(parseISO(feedback.createdAt), 'MMMM d, yyyy')}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-center text-gray-500 text-lg">No feedback found.</p>
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

export default DoctorFeedback;