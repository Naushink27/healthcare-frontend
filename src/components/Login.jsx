import React, { useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../utils/Constants';
import Footer from '../pages/Footer';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addUser } from '../utils/userSlice';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const toggleSignup = () => {
    setIsSignUp(!isSignUp);
    setErrorMessage('');
    setFieldErrors({});
    setSuccessMessage('');
  };

  const clearMessagesAfterDelay = () => {
    setTimeout(() => {
      setSuccessMessage('');
      setErrorMessage('');
      setFieldErrors({});
    }, 5000);
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setFirstName('');
    setLastName('');
    setRole('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setFieldErrors({});

    try {
      if (!isSignUp) {
        const res = await axios.post(
          `${BASE_URL}/login`,
          { email, password },
          { withCredentials: true }

        );
        console.log(res.data);
        const user = res.data.user; // e.g., { email, role }
        dispatch(addUser(user)); // Store user in Redux
        setSuccessMessage('Login Successful!');
        if (user.role === 'doctor') {
          navigate('/doctor/dashboard');
        } else if (user.role === 'patient') {
          navigate('/patient/dashboard');
        } else if (user.role === 'admin') {
          navigate('/admin/dashboard');
        }
        resetForm();
        clearMessagesAfterDelay();
      } else {
        const res = await axios.post(
          `${BASE_URL}/signup`,
          { email, password, firstName, lastName, 
            userRole:role
           }, 
          { withCredentials: true }
        );
        const user = res.data.user; // e.g., { email, role }
        dispatch(addUser(user)); // Store user in Redux
        setSuccessMessage('Signup Successful!');
        toggleSignup();
        resetForm();
        clearMessagesAfterDelay();
      }
    } catch (error) {
      if (error.response?.data?.errors) {
        setFieldErrors(error.response.data.errors);
      } else if (error.response?.data?.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage('Something went wrong. Please try again.');
      }
      clearMessagesAfterDelay();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white p-6 shadow-lg rounded-lg border border-gray-200">
          <h2 className="text-2xl font-bold text-blue-600 text-center mb-6">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h2>
          <form className="space-y-4" onSubmit={handleLogin}>
            {isSignUp && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Role</option>
                    <option value="doctor">Doctor</option>
                    <option value="patient">Patient</option>
                  </select>
                  {fieldErrors.role && (
                    <p className="text-red-500 text-sm mt-1">{fieldErrors.role}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Enter your First Name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {fieldErrors.firstName && (
                    <p className="text-red-500 text-sm mt-1">{fieldErrors.firstName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Enter your Last Name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {fieldErrors.lastName && (
                    <p className="text-red-500 text-sm mt-1">{fieldErrors.lastName}</p>
                  )}
                </div>
              </>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {fieldErrors.email && (
                <p className="text-red-500 text-sm mt-1">{fieldErrors.email}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-blue-500"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="text-red-500 text-sm mt-1">{fieldErrors.password}</p>
              )}
            </div>
            {errorMessage && (
              <p className="text-red-500 text-center font-semibold">{errorMessage}</p>
            )}
            {successMessage && (
              <p className="text-green-500 text-center font-semibold">{successMessage}</p>
            )}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
            >
              {isSignUp ? 'Sign Up' : 'Login'}
            </button>
            <p className="text-center text-sm mt-4">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <span
                className="text-blue-500 cursor-pointer hover:underline"
                onClick={toggleSignup}
              >
                {isSignUp ? 'Login' : 'Sign Up'}
              </span>
            </p>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;