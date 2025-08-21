import React, { useState } from 'react'
import useAuthUser from '../hooks/useAuthUser.js';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import toast from 'react-hot-toast';
import { completeOnboarding } from '../lib/api.js';
import { CameraIcon, LoaderCircleIcon, MapPin, MapPinIcon, MapPinXIcon, ShuffleIcon, UserRoundPen } from 'lucide-react'
import { LANGUAGES } from '../constants/index.js';

const OnBoardingPage = () => {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();


  const [formState, setFormState] = useState({
    fullname: authUser?.fullname || '',
    bio: authUser?.bio || '',
    profilepic: authUser?.profilepic || '',
    location: authUser?.location || '',
    hobbies: authUser?.hobbies|| '',
    
  });

  const { mutate: onboardingMutation, isPending } = useMutation({
    mutationFn: completeOnboarding,
    onSuccess: () => {
      toast.success("Profile onboarded successfully",{
      style: {
        fontSize: '1rem',
        minWidth: 'auto',
        borderRadius: '8px',
        maxWidth: '250px',
      }});
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },

    onError: (error) => {
      toast.error(error.response.data.message ,{
      style: {
        fontSize: '1rem',
        minWidth: 'auto',
        borderRadius: '8px',
        maxWidth: '250px',
      }});
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onboardingMutation(formState);
    console.log('Submitting:', formState);
  };

  const handleRandomAvatar = () => {
    const idx = Math.floor(Math.random() * 100) + 1; // Random index for profile picture
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}`; // Generate a random profile picture URL

    setFormState({ ...formState, profilepic: randomAvatar });
    toast.success('Random avatar generated!', {
      style: {
        fontSize: '1rem',
        minWidth: 'auto',
        borderRadius: '8px',
        maxWidth: '250px',
      },
    });
  }

  return (

    <div className='min-h-screen bg-base-100 flex items-center justify-center p-4'>
      <div className='card bg-base-200 w-full max-w-3xl shadow-xl'>
        <div className='card-body p-6 sm:p-8'>
          <h1 className='text-2xl sm:text-3xl font-bold text-center mb-6'>Complete Your Profile</h1>
          <form onSubmit={handleSubmit} className='space-y-6'>
            {/* profile pic container */}
            <div className='flex flex-col items-center justify-center space-y-4'>
              {/* image preview */}
              <div className='size-32 rounded-full bg-base-300 overflow-hidden'>
                {formState.profilepic ? (<img
                  src={formState.profilepic}
                  alt='Profile preview'
                  className='w-full h-full object-cover' />) : (
                  <div className='flex items-center justify-center h-full'>
                    <CameraIcon className='size-12 text-base-content opacity-40' />
                  </div>
                )}
              </div>

              {/* Random Avatar */}

              <div className='flex items-center gap-2'>
                <button type='button' onClick={handleRandomAvatar} className='btn btn-accent'>
                  <ShuffleIcon className='size-4 mr-2' />
                  Random Avatar
                </button>
              </div>

            </div>
            {/* Full Name */}
            <div className='form-control'>
              <label className='label'>
                <span className='label-text'>Full Name</span>
              </label>
              <input type="text"
                name='fullname'
                value={formState.fullname}
                onChange={(e) => setFormState({ ...formState, fullname: e.target.value })}
                className='input input-bordered w-full'
                placeholder='Your Full Name' />
            </div>
             {/* Hobbies */}
             <div className='form-control'>
              <label className='label'>
                <span className='label-text'>Hobbies</span>
              </label>
              <textarea
                name='bio'
                value={formState.hobbies}
                onChange={(e) => setFormState({ ...formState, hobbies: e.target.value })}
                className='input input-bordered w-full'
                placeholder='Add some hoobies' />
            </div>
            {/* Bio */}
            <div className='form-control'>
              <label className='label'>
                <span className='label-text'>Bio</span>
              </label>
              <textarea
                name='bio'
                value={formState.bio}
                onChange={(e) => setFormState({ ...formState, bio: e.target.value })}
                className='textarea textarea-bordered h-24'
                placeholder='Tell us about yourself' />
            </div>
           
            {/* Language */}
            {/* <div className='grid grid-cols-1 md:grid-cols-2 gap-4'> */}
              {/* Native Language */}
              {/* <div className='form-control'>
                <label className='label'>
                  <span className='label-text'>Native Language</span>
                </label>
                <select
                  name='nativeLanguage'
                  value={formState.nativeLanguage}
                  onChange={(e) => setFormState({ ...formState, nativeLanguage: e.target.value })}
                  className='select select-bordered w-full'>
                  <option value=''>Select your native language</option>
                  {LANGUAGES.map((lang) => (
                    <option key={`native-${lang}`} value={lang.toLowerCase()}>{lang}</option>
                  ))}
                </select>
              </div> */}
              {/* Learning Language */}
              {/* <div className='form-control'>
                <label className='label'>
                  <span className='label-text'>Learning Language</span>
                </label>
                <select
                  name='learningLanguage'
                  value={formState.learningLanguage}
                  onChange={(e) => setFormState({ ...formState, learningLanguage: e.target.value })}
                  className='select select-bordered w-full'>
                  <option value=''>Select your Learning language</option>
                  {LANGUAGES.map((lang) => (
                    <option key={`native-${lang}`} value={lang.toLowerCase()}>{lang}</option>
                  ))}
                </select>
              </div>
            </div> */}
            {/* Location */}
            <div className='form-control'>
              <label className='label'>
                <span className='label-text'>Location</span>
              </label>
              <div className="relative">
                <MapPinIcon className='absolute top-1/2 transform -translate-y-1/4 left-3 size-5 text-base-content opacity-70' />
                <input type="text"
                  name='location'
                  value={formState.location}
                  onChange={(e) => setFormState({ ...formState, location: e.target.value })}
                  className='input input-bordered w-full pl-10'
                  placeholder='City,Country' />
              </div>
            </div>
            {/* Submit Button */}
            <button className='btn btn-primary w-full' type='submit' disabled={isPending}>
              {!isPending ? (
                <>
                  <UserRoundPen className='size-5 mr-2' />Complete Onboarding
                </>) : (
                <>
                  <LoaderCircleIcon className='animate-spin size-5 mr-2' />
                  Onboarding.....
                </>
              )}

            </button>
          </form>

        </div>
      </div>

    </div>
  )
}

export default OnBoardingPage
