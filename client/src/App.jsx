import React, { useEffect } from 'react'
import Navbar from './components/Navbar/Navbar'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import Background from './components/Background'
import { useAuthStore } from './store/authStore'
import SignInPage from './pages/SignInPage'
import SearchResultPage from './pages/SearchResultPage'
import ProfilePage from './pages/ProfilePage'

const App = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const {getCurrentUser} = useAuthStore()

  useEffect(() => {
    if (location.pathname.includes('/login') ||
      location.pathname.includes('/signin')) return

      const getUser = async () => {
        const {success} = await getCurrentUser()
        if (!success) navigate('/login')
      }
      getUser()
  }, [])

  return (
    <div>
      {location.pathname.includes('/login') || location.pathname.includes('/signin') ? <div></div> : <Navbar />}

      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/signin' element={<SignInPage />} />
        <Route path='/search/:query' element={<SearchResultPage />} />
        <Route path='/:username' element={<ProfilePage/>} />
      </Routes>
    </div>
  )
}

export default App   