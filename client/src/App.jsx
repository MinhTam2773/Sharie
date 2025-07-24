import React, { useEffect } from 'react'
import Navbar from './components/Navbar'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import Background from './components/Background'
import { useAuthStore } from './store/authStore'
import SignInPage from './pages/SignInPage'

const App = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { accessToken, generateToken } = useAuthStore()

  useEffect(() => {
    if (location.pathname.includes('/login') || 
      location.pathname.includes('/signin')) return
      
    const checkToken = async () => {
      if (!accessToken) {
        await generateToken()
        if (!useAuthStore.getState().accessToken) {
          navigate('/login')
        }
      }
    }
    checkToken()
  }, [accessToken, navigate, generateToken, location])

  return (
    <div>
      {location.pathname.includes('/login') || location.pathname.includes('/signin') ? <div></div> : <Navbar />}

      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/signin' element={<SignInPage />} />
      </Routes>


    </div>
  )
}

export default App   