import React, { useState } from 'react'
import useAuthUser from '../hooks/useAuthUser.js';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { completeOnboarding } from '../lib/api.js';
import { CameraIcon, ShuffleIcon } from 'lucide-react'
import { LANGUAGES } from '../constants/index.js';
const OnBoardingPage = () => {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();

  const [formState, setFormState] = useState({
    fullname: authUser?.fullname || '',
    bio: authUser?.bio || '',
    profilepic: authUser?.profilepic || '',
    location: authUser?.location || '',
    learningLanguages: authUser?.learningLanguages || '',
    nativeLanguages: authUser?.nativeLanguages || '',
  });

  const { mutate: onboardingMutation, isPending } = useMutation({
    mutationFn: completeOnboarding,
    onSuccess: () => {
      toast.success('Onboarding completed successfully!');
      queryClient.invalidateQueries(['authUser']);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onboardingMutation(formState);
  };

  const handleRandomAvatar = () => { }

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
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {/* Native Language */}
              <div className='form-control'>
                <label className='label'>
                  <span className='label-text'>Native Language</span>
                </label>
                <select
                  name='nativeLanguages'
                  value={formState.nativeLanguages}
                  onChange={(e) => setFormState({ ...formState, nativeLanguages: e.target.value })}
                  className='select select-bordered w-full'>
                  <option value=''>Select your native language</option>
                  {LANGUAGES.map((lang) => (
                    <option key={`native-${lang}`} value={lang.toLowerCase()}>{lang}</option>
                  ))}
                </select>
              </div>
            </div>
          </form>

        </div>
      </div>

    </div>
  )
}

export default OnBoardingPage
