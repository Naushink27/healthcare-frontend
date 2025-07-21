import React, { useState, useEffect } from 'react';
import PatientSidebar from './PatientSidebar';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addUser, removeUser } from '../utils/userSlice';
import { Menu, Loader2 } from 'lucide-react';
import axios from 'axios';
import { BASE_URL } from '../utils/Constants';
import DOMPurify from 'dompurify';

const PatientProfile = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user.user);
  const userId = user?._id;

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [MedicalHistory, setMedicalHistory] = useState('');
  const [address, setAddress] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [error, setError] = useState('');
  const [toast, setToast] = useState(false);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fetchPatientProfile = async () => {
      if (!userId) {
        setError('Please log in to view your profile');
        setLoading(false);
        navigate('/login');
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(`${BASE_URL}/patient/get/profile/${userId}`, {
          withCredentials: true,
        });
        const patient = response.data?.patient;
        if (!patient) {
          throw new Error('Patient profile not found');
        }

        setFirstName(patient.userId.firstName || '');
        setLastName(patient.userId.lastName || '');
        setEmail(patient.userId.email || '');
        setProfilePicture(patient.profilePicture || '');
        setAge(patient.age || '');
        setGender(patient.gender || '');
        setContactNumber(patient.ContactNumber || '');
        setMedicalHistory(patient.MedicalHistory || '');
        setAddress(patient.address || '');
        setBloodGroup(patient.bloodGroup || '');

        dispatch(addUser({
          ...user,
          _id: userId,
          firstName: patient.userId.firstName,
          lastName: patient.userId.lastName,
          email: patient.userId.email,
          profilePicture: patient.profilePicture,
          age: patient.age,
          gender: patient.gender,
          contactNumber: patient.ContactNumber,
          MedicalHistory: patient.MedicalHistory,
          bloodGroup: patient.bloodGroup,
          address: patient.address,
        }));

        setError('');
      } catch (err) {
        console.error('Profile fetch error:', err.response || err);
        setError(
          err.response?.status === 404
            ? 'Patient profile not found'
            : err.response?.data?.message || err.message || 'Failed to fetch profile'
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

    fetchPatientProfile();
  }, [userId, dispatch, navigate]);

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

  const validateForm = () => {
    if (!firstName.trim() || !lastName.trim()) {
      return 'First name and last name are required';
    }
    if (!MedicalHistory.trim()) {
      return 'Medical history is required';
    }
    if (!bloodGroup.trim()) {
      return 'Blood group is required';
    }
    if (!gender.trim()) {
      return 'Gender is required';
    }
    if (age && (isNaN(age) || age < 18 || age > 100)) {
      return 'Age must be between 18 and 100';
    }
    if (contactNumber && !/^\d{10}$/.test(contactNumber)) {
      return 'Phone number must be 10 digits';
    }
    if (profilePicture && !/^https?:\/\/.+/.test(profilePicture)) {
      return 'Profile picture must be a valid URL';
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setToast(true);
      setTimeout(() => setToast(false), 3000);
      return;
    }

    try {
      setIsUpdating(true);
      const sanitizedMedicalHistory = DOMPurify.sanitize(MedicalHistory);
      const sanitizedAddress = DOMPurify.sanitize(address);
      const response = await axios.patch(
        `${BASE_URL}/patient/update/profile/${userId}`,
        {
          age,
          gender,
          ContactNumber: contactNumber,
          bloodGroup,
          MedicalHistory: sanitizedMedicalHistory,
          address: sanitizedAddress,
          profilePicture,
        },
        { withCredentials: true }
      );

      dispatch(addUser({
        ...user,
        _id: userId,
        firstName,
        lastName,
        email,
        profilePicture
      }));

      setError('');
      setToast(true);
      setTimeout(() => setToast(false), 3000);
      setImageError(false);
    } catch (err) {
      console.error('Update error:', err.response || err);
      setError(
        err.response?.status === 404
          ? 'Patient profile not found'
          : err.response?.data?.message || err.response?.data?.error || 'Failed to update profile'
      );
      setToast(true);
      setTimeout(() => setToast(false), 3000);
      if (err.response?.status === 401 || err.response?.status === 403) {
        dispatch(removeUser());
        navigate('/login');
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <>
      {toast && (
        <div
          className="fixed top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-md shadow-md text-white z-50"
          style={{ backgroundColor: error ? '#ef4444' : '#22c55e' }}
        >
          {error || 'Profile updated successfully!'}
        </div>
      )}
      <div className="min-h-screen bg-gray-50 flex">
        <PatientSidebar
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          handleLogout={handleLogout}
        />
        <div className="flex-1 p-4 sm:p-6 max-w-screen-lg mx-auto">
          <button
            className="lg:hidden p-2 rounded-md bg-gray-200 text-gray-600 mb-4"
            onClick={toggleSidebar}
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="flex justify-center mb-6">
              {profilePicture && !imageError ? (
                <img
                  src={profilePicture}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
                  onError={handleImageError}
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 border-2 border-gray-300">
                  {imageError ? 'Invalid Image URL' : 'No Image'}
                </div>
              )}
            </div>

            <h2 className="text-xl font-semibold mb-4 text-center">Edit Profile</h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <label className="block">
                <span className="text-sm font-medium">First Name *</span>
                <input
                  type="text"
                  className="w-full mt-1 p-2 border rounded-md"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium">Last Name *</span>
                <input
                  type="text"
                  className="w-full mt-1 p-2 border rounded-md"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium">Profile Picture URL</span>
                <input
                  type="text"
                  className="w-full mt-1 p-2 border rounded-md"
                  placeholder="Profile Picture URL"
                  value={profilePicture}
                  onChange={(e) => {
                    setProfilePicture(e.target.value);
                    setImageError(false);
                  }}
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium">Email</span>
                <input
                  type="email"
                  className="w-full mt-1 p-2 border rounded-md bg-gray-100 text-gray-500 cursor-not-allowed"
                  value={email}
                  readOnly
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium">Age</span>
                <input
                  type="number"
                  className="w-full mt-1 p-2 border rounded-md"
                  placeholder="Age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  min="18"
                  max="100"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium">Gender *</span>
                <select
                  className="w-full mt-1 p-2 border rounded-md"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </label>
              <label className="block">
                <span className="text-sm font-medium">Phone Number</span>
                <input
                  type="tel"
                  className="w-full mt-1 p-2 border rounded-md"
                  placeholder="Phone Number"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium">Medical History *</span>
                <input
                  type="text"
                  className="w-full mt-1 p-2 border rounded-md"
                  placeholder="Medical history (e.g., diabetes, hypertension, etc.)"
                  value={MedicalHistory}
                  onChange={(e) => setMedicalHistory(e.target.value)}
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium">Blood Group *</span>
                <input
                  type="text"
                  className="w-full mt-1 p-2 border rounded-md"
                  placeholder="Blood Group (e.g., A+, B+, etc.)"
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium">Address</span>
                <textarea
                  className="w-full mt-1 p-2 border rounded-md"
                  placeholder="Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows="3"
                ></textarea>
              </label>
              <div className="flex justify-center space-x-4">
                <button
                  type="button"
                  className="px-4 py-2 bg_gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                  onClick={() => navigate('/patient/dashboard')}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300"
                  disabled={isUpdating}
                >
                  {isUpdating ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
            onClick={toggleSidebar}
          ></div>
        )}
      </div>
    </>
  );
};

export default PatientProfile;