import React, { useState, useRef } from 'react';
import { FaEnvelope, FaLock, FaUser, FaKey, FaArrowRight, FaArrowLeft, FaShareAlt } from 'react-icons/fa';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import Background from '../components/Background';

const SignInPage = () => {
    const { signin, isSigningIn, sendCode, verifyCode, checkExist, isVerifyingCode } = useAuthStore();
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: '',
        code: Array(6).fill('') // Store code as array for 6-digit input
    });
    const [step, setStep] = useState(1);
    const [errors, setErrors] = useState({ email: '', password: '' });
    const [touched, setTouched] = useState({ email: false, password: false });
    const [signinError, setSigninError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const inputRefs = useRef([]);

    // Email validation regex
    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setSigninError(null);

        if (touched[name]) {
            setErrors({
                ...errors,
                [name]: name === 'email'
                    ? validateEmail(value) ? '' : 'Please enter a valid email address'
                    : value.length >= 6 ? '' : 'Password must be at least 6 characters'
            });
        }
    };

    // Handle code input changes
    const handleCodeChange = (e, index) => {
        const value = e.target.value.replace(/\D/g, ''); // Only allow digits
        const newCode = [...formData.code];

        // Update the current box
        newCode[index] = value;
        setFormData({ ...formData, code: newCode });

        // Auto-focus next input if a digit was entered
        if (value && index < 5 && inputRefs.current[index + 1]) {
            inputRefs.current[index + 1].focus();
        }

        // Check if all digits are filled
        if (newCode.every(digit => digit !== '') && newCode.length === 6) {
            const fullCode = newCode.join('');
            verifyCode({ ...formData, code: fullCode }).then(({ success }) => {
                if (success) setStep(3);
            });
        }
    };

    // Handle backspace
    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && !formData.code[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        setTouched({ ...touched, [name]: true });

        setErrors({
            ...errors,
            [name]: name === 'email'
                ? validateEmail(value) ? '' : 'Please enter a valid email address'
                : value.length >= 6 ? '' : "Password must be at least 6 characters"
        });
    };

    const handleNext = async (e) => {
        e.preventDefault();
        setLoading(true);

        const { message } = await checkExist(formData.email);
        if (message === 'user already exist') setSigninError(message);

        const { success } = await sendCode({ email: formData.email, password: formData.password });
        if (success) setStep(2);

        setLoading(false);
    };

    const handleCodeSubmit = async (e) => {
        e.preventDefault();
        const fullCode = formData.code.join('');
        if (fullCode.length === 6) {
            const { success, message } = await verifyCode({ ...formData, code: fullCode });
            if (success) { setStep(3); }
            else setSigninError(message);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { success, message } = await signin(formData);
        if (success) { navigate('/'); }
        else setSigninError(message);
    };

    const handleBack = () => {
        if (step === 3) {
            setStep(2); // Go from username back to code verification
        } else if (step === 2) {
            setStep(1); // Go from code verification back to email/password
        }
    };

    return (
        <div className="relative min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 overflow-hidden">
            <Background />

            {/* Error Message Cloud */}
            {signinError && (
                <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-50 animate-bounce-in">
                    <div className="relative">
                        <div className="bg-white/90 text-purple-900 px-6 py-4 rounded-3xl shadow-xl font-medium max-w-xs text-center">
                            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white/90"></div>
                            {signinError} 🚀
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
                        <p className="text-gray-500 mt-1">Join our cosmic community ✨</p>
                    </div>

                    {/* Step 1: Email & Password */}
                    {step === 1 && (
                        <form onSubmit={handleNext} className="space-y-4">
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
                                        className={`block w-full pl-10 pr-3 py-3 rounded-xl border ${errors.email && touched.email ? 'border-red-300' : 'border-gray-200'} placeholder-gray-400 focus:outline-none focus:ring-2 ${errors.email && touched.email ? 'focus:ring-red-300' : 'focus:ring-purple-300'} focus:border-transparent bg-white text-gray-800 transition-all duration-150`}
                                        placeholder="your@email.com"
                                    />
                                </div>
                                {errors.email && touched.email && (
                                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                                )}
                            </div>

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
                                        className={`block w-full pl-10 pr-3 py-3 rounded-xl border ${errors.password && touched.password ? 'border-red-300' : 'border-gray-200'} placeholder-gray-400 focus:outline-none focus:ring-2 ${errors.password && touched.password ? 'focus:ring-red-300' : 'focus:ring-purple-300'} focus:border-transparent bg-white text-gray-800 transition-all duration-150`}
                                        placeholder="••••••••"
                                    />
                                </div>
                                {errors.password && touched.password && (
                                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={loading || !!errors.email || !!errors.password}
                                className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-medium rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Verifying...
                                    </>
                                ) : (
                                    <>
                                        Continue <FaArrowRight className="ml-2" />
                                    </>
                                )}
                            </button>
                        </form>
                    )}

                    {/* Step 2: Verification Code */}
                    {step === 2 && (
                        <div className="space-y-4">
                            <button
                                onClick={handleBack}
                                className="flex items-center text-purple-600 hover:text-purple-800 mb-4"
                            >
                                <FaArrowLeft className="mr-2" />
                                Back to Email
                            </button>

                            <form onSubmit={handleCodeSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
                                        Enter 6-digit verification code
                                    </label>
                                    <div className="flex justify-center space-x-2">
                                        {[0, 1, 2, 3, 4, 5].map((index) => (
                                            <input
                                                key={index}
                                                ref={(el) => (inputRefs.current[index] = el)}
                                                type="text"
                                                maxLength="1"
                                                value={formData.code[index]}
                                                onChange={(e) => handleCodeChange(e, index)}
                                                onKeyDown={(e) => handleKeyDown(e, index)}
                                                className="w-12 h-12 text-2xl text-center border border-gray-300 rounded-lg 
                                                        focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent 
                                                        bg-white text-gray-900 caret-purple-600"
                                                pattern="\d*"
                                                inputMode="numeric"
                                            />
                                        ))}
                                    </div>
                                    <p className="mt-4 text-sm text-gray-500 text-center">
                                        We've sent a code to {formData.email}
                                    </p>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isVerifyingCode || formData.code.join('').length !== 6}
                                    className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-medium rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
                                >
                                    {isVerifyingCode ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Verifying...
                                        </>
                                    ) : (
                                        "Verify Code"
                                    )}
                                </button>
                            </form>
                        </div>
                    )}

                    {/* Step 3: Username */}
                    {step === 3 && (
                        <div className="space-y-4">
                            <button
                                onClick={handleBack}
                                className="flex items-center text-purple-600 hover:text-purple-800 mb-4"
                            >
                                <FaArrowLeft className="mr-2" />
                                Back to Code Verification
                            </button>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                                        Choose a Username
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FaUser className="h-5 w-5 text-purple-400" />
                                        </div>
                                        <input
                                            id="username"
                                            name="username"
                                            type="text"
                                            value={formData.username}
                                            onChange={handleChange}
                                            className="block w-full pl-10 pr-3 py-3 rounded-xl border border-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent bg-white text-gray-800 transition-all duration-150"
                                            placeholder="cosmic_traveler"
                                            style={{ color: '#1a202c' }} // Ensures text is always dark
                                        />
                                    </div>
                                    <p className="mt-2 text-sm text-gray-500">This will be your public identity</p>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSigningIn}
                                    className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-medium rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
                                >
                                    {isSigningIn ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Creating Account...
                                        </>
                                    ) : (
                                        "Complete Sign Up"
                                    )}
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SignInPage;