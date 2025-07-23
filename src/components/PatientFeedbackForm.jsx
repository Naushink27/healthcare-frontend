import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { BASE_URL } from '../utils/Constants';
import PatientSidebar from './PatientSidebar';
import { Menu, Loader2, Star } from 'lucide-react';
import { removeUser } from '../utils/userSlice';

const PatientFeedbackForm = () => {
  const { doctorId } = useParams();
  const user = useSelector((store) => store.user.user);
  const patientId = user?._id;
  const [doctor, setDoctor] = useState(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comments, setComments] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      setTimeout(() => setToast(false), 3000);
    }
  };

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      if (!patientId) {
        setError('Please log in to submit feedback');
        setToast(true);
        setTimeout(() => {
          setToast(false);
          navigate('/login');
        }, 3000);
        return;
      }

      try {
        setLoading(true);
        const res = await axios.get(`${BASE_URL}/doctor/get/profile/${doctorId}`, {
          withCredentials: true,
        });
        const doctorData = res.data?.doctor;
        if (!doctorData) {
          throw new Error('Doctor not found');
        }
        setDoctor(doctorData);
        console.log('Doctor details fetched successfully:', doctorData);
        setError('');
      } catch (err) {
        console.error('Error fetching doctor details:', err.response || err);
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

    fetchDoctorDetails();
  }, [doctorId, patientId, dispatch, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating || !comments.trim()) {
      setError('Please provide a rating and comments');
      setToast(true);
      setTimeout(() => setToast(false), 3000);
      return;
    }

    try {
      setIsSubmitting(true);
      await axios.post(
        `${BASE_URL}/feedback/submit`,
        {
          doctorId,
          patientId,
          rating,
          comments,
        },
        { withCredentials: true }
      );
      setError('');
      setToast(true);
      setTimeout(() => {
        setToast(false);
        navigate('/patient/dashboard');
      }, 2000);
    } catch (err) {
      console.error('Submit feedback error:', err.response || err);
      setError(
        err.response?.status === 404
          ? 'Doctor or patient not found'
          : err.response?.data?.message || err.message || 'Failed to submit feedback'
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
          {error || 'Feedback submitted successfully!'}
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
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Submit Feedback</h2>
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
                <span className="text-sm font-medium text-gray-700">Rating *</span>
                <div className="flex space-x-1 mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-8 h-8 cursor-pointer transition-colors ${
                        star <= (hoverRating || rating)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'
                      }`}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                    />
                  ))}
                </div>
              </label>
              <label className="block">
                <span className="text-sm font-medium text-gray-700">Comments *</span>
                <textarea
                  className="w-full mt-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Share your feedback about your experience"
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  rows="5"
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
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : 'Submit Feedback'}
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

export default PatientFeedbackForm;