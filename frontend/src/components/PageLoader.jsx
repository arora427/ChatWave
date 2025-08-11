import React from 'react'
import { SpinnerDotted } from 'spinners-react'


const PageLoader = () => {
  return (
    <div className='h-screen flex items-center justify-center'>
       <SpinnerDotted className='text-primary bg-primary' size={80} thickness={150} speed={100} color='' />

    </div>
      
  )
}

export default PageLoader
