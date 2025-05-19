import React, { useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../utils/Constants';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const[successMessage,setSuccessMessage]=useState('');

  const toggleSignup = () => {
    setIsSignUp(!isSignUp);
    setErrorMessage('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      if (!isSignUp) {
        const res = await axios.post(
          BASE_URL + '/login',
          { email, password },
          { withCredentials: true }
        );
        console.log(res); // Successful login

        // You can redirect or show success message here
      } else {
        const res = await axios.post(
          BASE_URL + '/signup',
          { email, password, firstName, lastName },
          { withCredentials: true }
        );
        console.log(res.status); // Successful signup
        // You can redirect or show success message here
      }
    } catch (error) {
      console.error(error);
      if (error.response) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage('Something went wrong. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 shadow-lg rounded-2xl border border-blue-100">
        <h2 className="text-3xl font-bold text-blue-600 text-center mb-6">
          {isSignUp ? 'Create Account' : 'Welcome Back'}
        </h2>

        <form className="space-y-5" onSubmit={handleLogin}>
          {isSignUp && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Enter your First Name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Enter your Last Name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
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
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="flex items-center">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="ml-2 px-2 text-blue-600 hover:text-blue-800"
              >
                {showPassword ? '🔓' : '🔒'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={!email || !password || (isSignUp && (!firstName || !lastName))}
            className={`w-full py-2 rounded-md transition duration-200 ${
              !email || !password || (isSignUp && (!firstName || !lastName))
                ? 'bg-blue-300 cursor-not-allowed text-white'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {!isSignUp ? 'Login' : 'Signup'}
          </button>

          {errorMessage && (
            <p className="text-red-500 text-sm text-center mt-2">{errorMessage}</p>
          )}

          <p className="text-center text-sm text-gray-500 mt-4">
            {isSignUp ? 'Already have an account?' : 'Don’t have an account?'}{' '}
            <button
              type="button"
              onClick={toggleSignup}
              className="text-blue-600 hover:underline"
            >
              {isSignUp ? 'Login' : 'Sign up'}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
