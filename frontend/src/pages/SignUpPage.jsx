import React from 'react'
import { useState } from 'react'
import Logo from '../asset/Logo.png'
import { Link } from 'react-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'


import { signup } from '../lib/api.js'

const SignupPage = () => {
  const [signupData, setSignupData] = useState({
    fullname: '',
    email: '',
    password: '',
  })
const queryClient = useQueryClient()

const { mutate:signupMutation, isPending, error } = useMutation({
  mutationFn: signup,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["authUser"] })
  }
}) 


  const handleSignup = (e) => {
    e.preventDefault();
    signupMutation(signupData);
  }
  return (
    <div className="h-screen flex items-center justify-center p-4 sm:p-6 md:p-8" data-theme="night">
      <div className='border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden' >
        {/* Left side -sign up form */}

        <div className='w-full lg:w-1/2 p-4 sm:p-8 flex flex-col'>

          {/* Logo */}
          <div className='mb-4 flex items-center justify-start gap-2'>
            <img src={Logo} alt="Logo" className='w-p h-9 ' />
            <span className='text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-green-400 tracking-wider'>ChatWave</span>
          </div>
          {/* Error Message */}
          {error && (
            <div className='alert alert-error shadow-lg mb-4 text-sm'>
              <span>{error.response.data.message}
              </span>
            </div>
          )}
          <div>
            <form onSubmit={handleSignup}>
              <div className='space-y-4'>
                <div>
                  <h2 className='text-xl font-semibold'>Create an Account</h2>
                  <p className='text-sm opacity-70'>Join Chatwave and start chatting with your friends</p>
                </div>
                {/* Full NAme */}
                <div className='space-y-3'>
                  <div className='form-control w-full'>
                    <label className='label'>
                      <span className='label-text'>Full Name</span>
                    </label>
                    <input type="text" placeholder='John Doe'
                      className='input input-bordered w-full'
                      value={signupData.fullname}
                      onChange={(e) => setSignupData({ ...signupData, fullname: e.target.value })}
                      required />
                  </div>
                  {/* Email */}
                  <div className='form-control w-full'>
                    <label className='label'>
                      <span className='label-text'>Email</span>
                    </label>
                    <input type="email" placeholder='JohnDoe@gmail.com'
                      className='input input-bordered w-full'
                      value={signupData.email}
                      onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                      required />
                  </div>
                  {/* Password */}
                  <div className='form-control w-full'>
                    <label className='label'>
                      <span className='label-text'>Passwaord</span>
                    </label>
                    <input type="password" placeholder='********'
                      className='input input-bordered w-full'
                      value={signupData.password}
                      onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                      required />
                    <p className='text-xs opacity-70 mt-1'>
                      Password must be at least 6 characters long and contain a mix of letters, numbers, and symbols.
                    </p>
                  </div>
                  <div className='form-control'>
                    <label className='label cursor-pointer justify-start gap-2'>
                      <input type="checkbox" className='checkbox checkbox-sm' required />
                      <span className='text-sm'>I agree that {""}
                        <span className='text-primary hover:underline'>terms of service and {""}</span>
                        <span className='text-primary hover:underline'>privacy policy</span>
                      </span>
                    </label>
                  </div>
                </div>
                <button className='btn btn-primary w-full' type='submit'>{isPending ? <>
                <span className='loading loading-spinner loading-xs'></span>
                Loading...</>:("Create Account")}</button>
                <div className='text-center mt-4'>
                  <p className='text-sm'>
                    Already have an account?{""}
                    <Link to="/login" className='text-primary hover:underline'>Login</Link>
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>
        {/* Right side Signup Form */}
        <div className="hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center">
          <div className="max-w-md p-8">
            {/* Illustration */}
            <div className="relative aspect-square max-w-sm mx-auto">
              <img src="/i.png" alt="Language connection illustration" className="w-full h-full" />
            </div>

            <div className="text-center space-y-3 mt-6">
              <h2 className="text-xl font-semibold">Connect with partners worldwide</h2>
              <p className="opacity-70 text-xs">
                Join ChatWave to connect with people from different cultures and backgrounds. Share ideas and make friends across the globe.
              </p>
            </div>
          </div>
          </div>
      </div>
    </div>
  )
}

export default SignupPage
