import React, { useState, useEffect, useCallback } from 'react';
import DoctorSidebar from './DoctorSidebar';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addUser, removeUser } from '../utils/userSlice';
import { Menu, Loader2 } from 'lucide-react';
import axios from 'axios';
import { BASE_URL } from '../utils/Constants';
import DOMPurify from 'dompurify';

const DoctorProfile = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user.user);
  const userId = user?._id;

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    profilePicture: '',
    age: '',
    contactNumber: '',
    specialization: '',
    experience: '',
    qualification: '',
    hospitalName: '',
    address: '',
    about: '',
  });
  const [error, setError] = useState('');
  const [toast, setToast] = useState(false);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  // Memoized fetchDoctorProfile
  const fetchDoctorProfile = useCallback(async () => {
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

      const doctor = response.data?.doctor;
      if (!doctor) {
        throw new Error('Doctor profile not found');
      }

      // Update form data
      const newFormData = {
        firstName: doctor.userId.firstName || '',
        lastName: doctor.userId.lastName || '',
        email: doctor.userId.email || '',
        profilePicture: doctor.userId.profilePicture || '',
        age: doctor.age ? String(doctor.age) : '', // Ensure string for input
        contactNumber: doctor.contactNumber || '',
        specialization: doctor.specialization || '',
        experience: doctor.experience ? String(doctor.experience) : '', // Ensure string for input
        qualification: doctor.qualification || '',
        hospitalName: doctor.hospitalName || '',
        address: doctor.address || '',
        about: doctor.about || '',
      };
      setFormData(newFormData);

      // Dispatch to Redux
      dispatch(addUser({
        _id: userId,
        ...newFormData,
      }));

      setError('');
    } catch (err) {
      setError(
        err.response?.status === 404
          ? 'Doctor profile not found'
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
  }, [userId, dispatch, navigate]);

  useEffect(() => {
    fetchDoctorProfile();
  }, [fetchDoctorProfile]);

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
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      return 'First name and last name are required';
    }
    if (!formData.specialization.trim() || !formData.qualification.trim()) {
      return 'Specialization and qualification are required';
    }
    if (formData.age && (isNaN(formData.age) || Number(formData.age) < 22 || Number(formData.age) > 100)) {
      return 'Age must be between 22 and 100';
    }
    if (formData.experience && (isNaN(formData.experience) || Number(formData.experience) < 0)) {
      return 'Experience must be a positive number';
    }
    if (formData.contactNumber && !/^\d{10}$/.test(formData.contactNumber)) {
      return 'Phone number must be 10 digits';
    }
    if (formData.profilePicture && !/^https?:\/\/.+\.(jpg|jpeg|png|gif)$/i.test(formData.profilePicture)) {
      return 'Profile picture must be a valid image URL (jpg, jpeg, png, or gif)';
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
      const sanitizedAbout = DOMPurify.sanitize(formData.about);
      const sanitizedAddress = DOMPurify.sanitize(formData.address);
      const updateData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        age: formData.age ? Number(formData.age) : undefined,
        specialization: formData.specialization.trim(),
        experience: formData.experience ? Number(formData.experience) : undefined,
        qualification: formData.qualification.trim(),
        contactNumber: formData.contactNumber ? formData.contactNumber.trim() : undefined,
        address: sanitizedAddress || undefined,
        about: sanitizedAbout || undefined,
        hospitalName: formData.hospitalName ? formData.hospitalName.trim() : undefined,
        profilePicture: formData.profilePicture ? formData.profilePicture.trim() : undefined,
      };

      const response = await axios.patch(
        `${BASE_URL}/doctor/update/profile/${userId}`,
        updateData,
        { withCredentials: true }
      );

      const updatedDoctor = response.data?.doctor;
      if (!updatedDoctor) {
        throw new Error('No doctor data returned from update');
      }

      // Update form data with response
      const newFormData = {
        firstName: updatedDoctor.userId.firstName || formData.firstName,
        lastName: updatedDoctor.userId.lastName || formData.lastName,
        email: updatedDoctor.userId.email || formData.email,
        profilePicture: updatedDoctor.userId.profilePicture || formData.profilePicture,
        age: updatedDoctor.age ? String(updatedDoctor.age) : formData.age,
        contactNumber: updatedDoctor.contactNumber || formData.contactNumber,
        specialization: updatedDoctor.specialization || formData.specialization,
        experience: updatedDoctor.experience ? String(updatedDoctor.experience) : formData.experience,
        qualification: updatedDoctor.qualification || formData.qualification,
        hospitalName: updatedDoctor.hospitalName || formData.hospitalName,
        address: updatedDoctor.address || formData.address,
        about: updatedDoctor.about || formData.about,
      };
      setFormData(newFormData);

      // Dispatch to Redux
      dispatch(addUser({
        _id: userId,
        ...newFormData,
      }));

      setError('');
      setToast(true);
      setTimeout(() => setToast(false), 3000);
      setImageError(false);
    } catch (err) {
      setError(
        err.response?.status === 404
          ? 'Doctor profile not found'
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

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
            <div className="flex justify-center mb-6">
              {formData.profilePicture && !imageError ? (
                <img
                  src={formData.profilePicture}
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
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  required
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium">Last Name *</span>
                <input
                  type="text"
                  className="w-full mt-1 p-2 border rounded-md"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  required
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium">Profile Picture URL</span>
                <input
                  type="text"
                  className="w-full mt-1 p-2 border rounded-md"
                  placeholder="Profile Picture URL (jpg, jpeg, png, gif)"
                  value={formData.profilePicture}
                  onChange={(e) => {
                    handleInputChange('profilePicture', e.target.value);
                    setImageError(false);
                  }}
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium">Email</span>
                <input
                  type="email"
                  className="w-full mt-1 p-2 border rounded-md bg-gray-100 text-gray-500 cursor-not-allowed"
                  value={formData.email}
                  readOnly
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium">Age</span>
                <input
                  type="number"
                  className="w-full mt-1 p-2 border rounded-md"
                  placeholder="Age"
                  value={formData.age}
                  onChange={(e) => handleInputChange('age', e.target.value)}
                  min="22"
                  max="100"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium">Phone Number</span>
                <input
                  type="tel"
                  className="w-full mt-1 p-2 border rounded-md"
                  placeholder="Phone Number"
                  value={formData.contactNumber}
                  onChange={(e) => handleInputChange('contactNumber', e.target.value)}
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium">Specialization *</span>
                <input
                  type="text"
                  className="w-full mt-1 p-2 border rounded-md"
                  placeholder="Specialization"
                  value={formData.specialization}
                  onChange={(e) => handleInputChange('specialization', e.target.value)}
                  required
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium">Experience (Years)</span>
                <input
                  type="number"
                  className="w-full mt-1 p-2 border rounded-md"
                  placeholder="Experience"
                  value={formData.experience}
                  onChange={(e) => handleInputChange('experience', e.target.value)}
                  min="0"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium">Qualification *</span>
                <input
                  type="text"
                  className="w-full mt-1 p-2 border rounded-md"
                  placeholder="Qualification (e.g., MBBS, MD)"
                  value={formData.qualification}
                  onChange={(e) => handleInputChange('qualification', e.target.value)}
                  required
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium">Hospital Name</span>
                <input
                  type="text"
                  className="w-full mt-1 p-2 border rounded-md"
                  placeholder="Hospital Name"
                  value={formData.hospitalName}
                  onChange={(e) => handleInputChange('hospitalName', e.target.value)}
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium">Address</span>
                <textarea
                  className="w-full mt-1 p-2 border rounded-md"
                  placeholder="Address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  rows="3"
                ></textarea>
              </label>
              <label className="block">
                <span className="text-sm font-medium">About</span>
                <textarea
                  className="w-full mt-1 p-2 border rounded-md"
                  placeholder="Write something about yourself..."
                  value={formData.about}
                  onChange={(e) => handleInputChange('about', e.target.value)}
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

export default DoctorProfile;