import React, { useState, useEffect } from 'react';
import DoctorSidebar from './DoctorSidebar';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addUser, removeUser } from '../utils/userSlice';
import { Menu, Loader2 } from 'lucide-react';
import axios from 'axios';
import { BASE_URL } from '../utils/Constants';

const DoctorProfile = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user.user);
  const userId = user?._id;

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [age, setAge] = useState('');
  const [phone, setPhone] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [experience, setExperience] = useState('');
  const [qualification, setQualification] = useState('');
  const [hospitalName, setHospitalName] = useState('');
  const [address, setAddress] = useState('');
  const [about, setAbout] = useState('');
  const [error, setError] = useState('');
  const [toast, setToast] = useState(false);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false); // Track if image fails to load

  useEffect(() => {
    const fetchDoctorProfile = async () => {
      if (!userId) {
        setError('Please log in to view your profile');
        setLoading(false);
        navigate('/login');
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(`${BASE_URL}/doctor/get/profile/${userId}`, {
          withCredentials: true,
        });
        const { doctor } = response.data;

        setFirstName(doctor.userId.firstName || '');
        setLastName(doctor.userId.lastName || '');
        setEmail(doctor.userId.email || '');
        setProfilePicture(doctor.profilePicture || '');
        setAge(doctor.age || '');
        setPhone(doctor.contactNumber || '');
        setSpecialization(doctor.specialization || '');
        setExperience(doctor.experience || '');
        setQualification(doctor.qualification || '');
        setHospitalName(doctor.hospitalName || '');
        setAddress(doctor.address || '');
        setAbout(doctor.about || '');

        dispatch(addUser({
          ...user,
          _id: userId,
          firstName: doctor.userId.firstName,
          lastName: doctor.userId.lastName,
          email: doctor.userId.email,
          profilePicture: doctor.profilePicture,
        }));

        setError('');
      } catch (err) {
        setError(err.response?.data?.message || err.response?.data?.error || 'Failed to fetch profile');
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

    fetchDoctorProfile();
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
    if (!specialization.trim() || !qualification.trim()) {
      return 'Specialization and qualification are required';
    }
    if (age && (isNaN(age) || age < 18 || age > 100)) {
      return 'Age must be between 18 and 100';
    }
    if (experience && (isNaN(experience) || experience < 0)) {
      return 'Experience must be a positive number';
    }
    if (phone && !/^\d{10}$/.test(phone)) {
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
      const response = await axios.patch(
        `${BASE_URL}/doctor/update/profile/${userId}`,
        {
          age,
          specialization,
          experience,
          qualification,
          contactNumber: phone,
          address,
          about,
          profilePicture,
          hospitalName,
        },
        { withCredentials: true }
      );

      dispatch(addUser({
        ...user,
        _id: userId,
        firstName,
        lastName,
        email,
        profilePicture,
      }));

      setError('');
      setToast(true);
      setTimeout(() => setToast(false), 3000);
      setImageError(false); // Reset image error on successful update
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Failed to update profile');
      setToast(true);
      setTimeout(() => setToast(false), 3000);
      if (err.response?.status === 401 || err.response?.status === 403) {
        dispatch(removeUser());
        navigate('/login');
      }
    }
  };

  // Handle image load error
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
        <DoctorSidebar
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
            {/* Circular Profile Picture */}
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
                  No Image
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
                    setImageError(false); // Reset error when URL changes
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
                <span className="text-sm font-medium">Phone Number</span>
                <input
                  type="tel"
                  className="w-full mt-1 p-2 border rounded-md"
                  placeholder="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium">Specialization *</span>
                <input
                  type="text"
                  className="w-full mt-1 p-2 border rounded-md"
                  placeholder="Specialization"
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium">Experience (Years)</span>
                <input
                  type="number"
                  className="w-full mt-1 p-2 border rounded-md"
                  placeholder="Experience"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  min="0"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium">Qualification *</span>
                <input
                  type="text"
                  className="w-full mt-1 p-2 border rounded-md"
                  placeholder="Qualification (e.g., MBBS, MD)"
                  value={qualification}
                  onChange={(e) => setQualification(e.target.value)}
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium">Hospital Name</span>
                <input
                  type="text"
                  className="w-full mt-1 p-2 border rounded-md"
                  placeholder="Hospital Name"
                  value={hospitalName}
                  onChange={(e) => setHospitalName(e.target.value)}
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
              <label className="block">
                <span className="text-sm font-medium">About</span>
                <textarea
                  className="w-full mt-1 p-2 border rounded-md"
                  placeholder="Write something about yourself..."
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  rows="4"
                ></textarea>
              </label>
              <div className="flex justify-center space-x-4">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                  onClick={() => navigate('/doctor/dashboard')}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Update
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

export default DoctorProfile;