import React from 'react'
import { SpinnerDotted } from 'spinners-react'


const PageLoader = () => {
  return (
    <div className='h-screen flex items-center justify-center'>
       <SpinnerDotted className='' size={80} thickness={150} speed={100} color='#3b82f6' />

    </div>
      
  )
}

export default PageLoader
