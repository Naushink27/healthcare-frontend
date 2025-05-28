import React, { useState, useRef } from 'react';
import DoctorSidebar from './DoctorSidebar';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { Menu } from 'lucide-react';
import axios from 'axios';

const DoctorProfile = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  const user = useSelector((store) => store.user.user);

  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [specialty, setSpecialty] = useState(user?.specialty || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [qualifications, setQualifications] = useState(user?.qualifications || '');
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [age, setAge] = useState(user?.age || '');
  const [experience, setExperience] = useState(user?.experience || '');
  const [address, setAddress] = useState(user?.address || '');
  const [hospitalName, setHospitalName] = useState(user?.hospitalName || '');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${BASE_URL}/logout`, {}, { withCredentials: true });
    } catch (error) {
      console.error('Logout failed:', error);
    }
    dispatch(removeUser());
    navigate('/login');
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePhoto(file);
    }
  };

  const handlePhotoClick = () => {
    fileInputRef.current.click();
  };

  const profilePhotoUrl = profilePhoto
    ? URL.createObjectURL(profilePhoto)
    : user?.profilePhotoUrl || 'https://via.placeholder.com/150?text=Profile';

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('age', age);
      formData.append('specialization', specialty);
      formData.append('experience', experience);
      formData.append('qualification', qualifications);
      formData.append('contactNumber', phone);
      formData.append('address', address);
      formData.append('about', bio);
      formData.append('hospitalName', hospitalName);
      if (profilePhoto) {
        formData.append('profilePicture', profilePhoto);
      }

      const response = await axios.post(`${BASE_URL}/doctors/${user._id}/profile`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });

      setSuccess(response.data.message);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
      setSuccess(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <DoctorSidebar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        handleLogout={handleLogout}
      />
      <div className="flex-1 p-4 sm:p-6 lg:p-8">
        <button
          className="lg:hidden p-2 rounded-md bg-gray-200 text-gray-600 mb-4"
          onClick={toggleSidebar}
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Edit Profile</h1>
          <p className="text-gray-600 mt-1">Update your personal information below.</p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex justify-center mb-6">
            <img
              src={profilePhotoUrl}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-blue-600 cursor-pointer"
              onClick={handlePhotoClick}
            />
            <input
              type="file"
              id="profilePhoto"
              accept="image/*"
              ref={fileInputRef}
              onChange={handlePhotoChange}
              className="hidden"
            />
          </div>
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
              {success}
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                value={`${firstName} ${lastName}`.trim()}
                onChange={(e) => {
                  const names = e.target.value.split(' ');
                  setFirstName(names[0] || '');
                  setLastName(names.slice(1).join(' ') || '');
                }}
                placeholder="Enter your full name"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={user?.email || ''}
                readOnly
                placeholder="Enter your email"
                className="w-full p-3 border border-gray-300 rounded-md bg-gray-100 text-gray-500 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="age">Age</label>
              <input
                type="number"
                id="age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="Enter your age"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your phone number"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="specialty">Specialization</label>
              <input
                type="text"
                id="specialty"
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                placeholder="Enter your specialization"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="experience">Experience (Years)</label>
              <input
                type="number"
                id="experience"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                placeholder="Enter years of experience"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="qualifications">Qualifications</label>
              <input
                type="text"
                id="qualifications"
                value={qualifications}
                onChange={(e) => setQualifications(e.target.value)}
                placeholder="Enter your qualifications (e.g., MBBS, MD)"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="hospitalName">Hospital Name</label>
              <input
                type="text"
                id="hospitalName"
                value={hospitalName}
                onChange={(e) => setHospitalName(e.target.value)}
                placeholder="Enter hospital name"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-gray-700 mb-2" htmlFor="address">Address</label>
              <textarea
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter your address"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
              ></textarea>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-gray-700 mb-2" htmlFor="bio">About</label>
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Enter a short bio"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="4"
              ></textarea>
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-4">
            <button
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
              onClick={() => navigate('/doctor/dashboard')}
            >
              Cancel
            </button>
            <button
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              onClick={handleSubmit}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  );
};

export default DoctorProfile;