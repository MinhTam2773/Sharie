// SearchBar.jsx
import React, { useRef, useState } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useSearchStore } from '../../store/searchStore';

const SearchBar = () => {
  const { search } = useSearchStore();
  const [query, setQuery] = useState('');
  const [usersFound, setUsersFound] = useState([]);
  const [noUserFoundMessage, setNoUserFoundMessage] = useState(null);
  const [isFocused, setIsFocused] = useState(false);
  const timeOutRef = useRef(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setNoUserFoundMessage(null);
    const value = e.target.value;
    setQuery(value);

    if (timeOutRef.current) clearTimeout(timeOutRef.current);

    if (value.trim() === '') {
      setUsersFound([]);
      return;
    }

    timeOutRef.current = setTimeout(async () => {
      const { users } = await search(value);
      setUsersFound(users);
      if (users?.length === 0) setNoUserFoundMessage('No user found');
    }, 400);
  };

  const handleClear = () => {
    setQuery('');
    setUsersFound([]);
    setNoUserFoundMessage(null);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search/${query}`);
      setUsersFound([]);
    }
  };

  const handleUserClick = (username) => {
    navigate(`/${username}`);
    setQuery('');
    setUsersFound([]);
  };

  return (
    <div className="relative w-full">
      <form onSubmit={handleSearch}>
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            placeholder="Search..."
            className="w-full pl-10 pr-8 py-2 rounded-full bg-purple-950/20 border border-purple-500/30 placeholder-purple-300 text-white focus:ring-2 focus:ring-purple-400 focus:outline-none transition-all"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-300" />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-300 hover:text-purple-100"
            >
              <FaTimes />
            </button>
          )}
        </div>
      </form>

      {/* Search results */}
      {isFocused && (usersFound.length > 0 || noUserFoundMessage) && (
        <div className="absolute mt-2 w-full bg-gray-900 shadow-xl rounded-xl overflow-hidden z-20 border border-gray-700 animate-fade-in">
          {usersFound.length > 0 ? (
            usersFound.map((user) => (
              <div
                key={user._id}
                className="flex items-center px-4 py-2 hover:bg-gray-800 cursor-pointer"
                onClick={() => handleUserClick(user.username)}
              >
                <img src={user.avatar} alt={user.username} className="h-8 w-8 rounded-full mr-3 object-cover" />
                <div>
                  <p className="text-sm font-medium text-white">{user.username}</p>
                  <p className="text-xs text-gray-400">{user.fullName}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="px-4 py-3 text-sm text-gray-400">
              {noUserFoundMessage || 'Keep typing...'}
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default SearchBar;
