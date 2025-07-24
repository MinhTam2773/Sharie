import React, { useState } from 'react';
import { FaLock, FaEnvelope, FaArrowRight, FaShareAlt, FaCheck, FaTimes } from 'react-icons/fa';
import Background from '../components/Background';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();
  const { isLogging, login } = useAuthStore();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [touched, setTouched] = useState({ email: false, password: false });
  const [loginError, setLoginError] = useState(null);

  // Email validation regex
  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setLoginError(null); // Clear any previous login errors when user types
    
    if (touched[name]) {
      setErrors({
        ...errors,
        [name]: name === 'email' 
          ? validateEmail(value) ? '' : 'Please enter a valid email address'
          : value.length >= 6 ? '' : 'Password must be at least 6 characters'
      });
    }
  };

  // Handle blur events
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched({ ...touched, [name]: true });

    setErrors({
      ...errors,
      [name]: name === 'email' 
        ? validateEmail(value) ? '' : 'Please enter a valid email address'
        : value.length >= 6 ? '' : 'Password must be at least 6 characters'
    });
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate all fields before submission
    const emailValid = validateEmail(formData.email);
    const passwordValid = formData.password.length >= 6;

    setErrors({
      email: emailValid ? '' : 'Please enter a valid email address',
      password: passwordValid ? '' : 'Password must be at least 6 characters'
    });

    setTouched({ email: true, password: true });

    if (emailValid && passwordValid) {
      const { success, message } = await login(formData);
      if (!success) {
        setLoginError(message || 'Invalid credentials. Please try again!');
      } else {
        navigate('/');
      }
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 overflow-hidden">
      <Background />

      {/* Cosmic Error Cloud - appears when login fails */}
      {loginError && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-50 animate-bounce-in">
          <div className="relative">
            <div className="bg-white/90 text-purple-900 px-6 py-4 rounded-3xl shadow-xl font-medium max-w-xs text-center">
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white/90"></div>
              {loginError} 🚀
            </div>
          </div>
        </div>
      )}

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg backdrop-blur-sm bg-opacity-80">
          {/* App Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative">
              <div className="absolute -inset-2 bg-purple-200 rounded-full blur opacity-75 animate-pulse"></div>
              <div className="relative flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-500 rounded-full text-white text-2xl">
                <FaShareAlt />
              </div>
            </div>
            <h1 className="mt-4 text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
              Sharie
            </h1>
            <p className="text-gray-500 mt-1">Connect & Share • Be You</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="h-5 w-5 text-purple-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoComplete="email"
                  required
                  className={`block w-full pl-10 pr-10 py-3 rounded-xl border ${errors.email && touched.email ? 'border-red-300' : 'border-gray-200'} placeholder-gray-400 focus:outline-none focus:ring-2 ${errors.email && touched.email ? 'focus:ring-red-300' : 'focus:ring-purple-300'} focus:border-transparent bg-white text-gray-800 transition-all duration-150`}
                  placeholder="you@example.com"
                />
                {touched.email && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    {errors.email ? (
                      <FaTimes className="h-5 w-5 text-red-500" />
                    ) : (
                      <FaCheck className="h-5 w-5 text-green-500" />
                    )}
                  </div>
                )}
              </div>
              {errors.email && touched.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-purple-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoComplete="current-password"
                  required
                  className={`block w-full pl-10 pr-10 py-3 rounded-xl border ${errors.password && touched.password ? 'border-red-300' : 'border-gray-200'} placeholder-gray-400 focus:outline-none focus:ring-2 ${errors.password && touched.password ? 'focus:ring-red-300' : 'focus:ring-purple-300'} focus:border-transparent bg-white text-gray-800 transition-all duration-150`}
                  placeholder="••••••••"
                />
                {touched.password && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    {errors.password ? (
                      <FaTimes className="h-5 w-5 text-red-500" />
                    ) : (
                      <FaCheck className="h-5 w-5 text-green-500" />
                    )}
                  </div>
                )}
              </div>
              {errors.password && touched.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <a href="#" className="font-medium text-purple-600 hover:text-purple-500">
                  Forgot password?
                </a>
              </div>
            </div>

            {isLogging ? (
              <div className='group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200'>
                <span>Loading</span>
              </div>
            ) : (
              <div>
                <button
                  type="submit"
                  disabled={!!errors.email || !!errors.password}
                  className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white ${errors.email || errors.password ? 'bg-purple-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200`}
                >
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    <FaArrowRight className={`h-5 w-5 ${errors.email || errors.password ? 'text-purple-200' : 'text-purple-300 group-hover:text-purple-200'} transition-all`} />
                  </span>
                  Sign in
                </button>
              </div>
            )}
          </form>

          {/* Sign up link */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  New to Sharie?
                </span>
              </div>
            </div>

            <div className="mt-4">
              <a
                href='/signin'
                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-all"
              >
                Create your account
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;