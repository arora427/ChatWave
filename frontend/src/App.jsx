import React from 'react'
import { Routes, Route, Navigate } from 'react-router'
import HomePage from './pages/HomePage.jsx'
import SignUpPage from './pages/SignUpPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import NotificationsPage from './pages/NotificationsPage.jsx'
import CallPage from './pages/CallPage.jsx'
import ChatPage from './pages/ChatPage.jsx'
import OnBoardingPage from './pages/OnBoardingPage.jsx'
import  { Toaster } from 'react-hot-toast'

import PageLoader from '../components/PageLoader.jsx'

import useAuthUser from './hooks/useAuthUser.js'

const App = () => {
  
  const {isLoading,authUser}=useAuthUser();
  
  
  if(isLoading) return <PageLoader />
  
  return (
    <div className=' h-screen text-5xl 'data-theme="dark"> 
      
      <Routes>
        <Route path='/' element={authUser?<HomePage />:<Navigate to="/login"/>} />
        <Route path='/signup' element={!authUser?<SignUpPage />:<Navigate to={"/"} />} />
        <Route path='/login' element={!authUser? <LoginPage />:<Navigate to={"/"} />} />
        <Route path='/notifications' element={authUser?<NotificationsPage />:<Navigate to={"/login"}/>} />
        <Route path='/call' element={authUser?<CallPage />:<Navigate to={"/login"}/>} />
        <Route path='/chat' element={authUser?<ChatPage />:<Navigate to={"/login"}/>} />
        <Route path='/onboarding' element={authUser?<OnBoardingPage />:<Navigate to={"/login"}/>} />
      </Routes>
      <Toaster />
    </div>
  )
}

export default App
