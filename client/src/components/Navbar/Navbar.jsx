// Navbar.jsx
import React from 'react';
import { FaBookmark, FaBell, FaUserAstronaut } from 'react-icons/fa';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar';

const Navbar = () => {
  const { user, logout} = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    navigate('/login')
    await logout()
  }

  return (
    <nav className="fixed w-full top-0 z-50 bg-gradient-to-b from-purple-950/80 to-indigo-900/80 backdrop-blur-lg border-b border-purple-600/20 shadow-md shadow-purple-500/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <div onClick={() => navigate('/')} className="flex items-center cursor-pointer group">
            <div className="relative h-10 w-10 mr-3">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-pink-400 to-indigo-500 shadow-xl group-hover:from-purple-400 group-hover:to-pink-500 transition-all duration-300"></div>
              <div className="absolute inset-0 rounded-full bg-purple-400/20 animate-pulse"></div>
              <div className="absolute inset-0 flex items-center justify-center text-white font-extrabold text-2xl">
                S
              </div>
              <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-white/80 animate-ping"></div>
              <div className="absolute bottom-0 left-2 w-1 h-1 rounded-full bg-white/60"></div>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-300 to-indigo-300 bg-clip-text text-transparent tracking-wide">
              SHARIE
            </span>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-xl mx-6">
            <SearchBar />
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-4">
            <button onClick={() => navigate('/saved')} className="text-purple-200 hover:text-white hover:bg-purple-700/40 p-2 rounded-full transition-all">
              <FaBookmark className="h-5 w-5" />
            </button>

            <button onClick={() => navigate('/notifications')} className="text-purple-200 hover:text-white hover:bg-purple-700/40 p-2 rounded-full transition-all">
              <FaBell className="h-5 w-5" />
            </button>

            {user ? (
              <button onClick={() => navigate(`/${user.username}`)} className="p-1 rounded-full border-2 border-transparent hover:border-purple-400/50 transition-all relative group">
                <img src={user.avatar} alt="Profile" className="h-8 w-8 rounded-full object-cover" />
              </button>
            ) : (
              <button onClick={() => navigate('/login')} className="text-purple-200 hover:text-white hover:bg-purple-700/40 p-2 rounded-full">
                <FaUserAstronaut className="h-5 w-5" />
              </button>
            )}
            <button onClick={() => handleLogout()}>logout</button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
