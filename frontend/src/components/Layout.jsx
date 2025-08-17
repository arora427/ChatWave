import React from 'react'
import Sidebar from './Sidebar'
import Navbar from './Navbar'

const Layout = ({ children, showSideBar = false }) => {
  return (
    // The min-h-screen class is now on the same div as 'flex'
    <div className='flex min-h-screen'>
      {showSideBar && <Sidebar />}

      <div className="flex-1 flex flex-col">
        <Navbar />

        {/* This 'main' area will now correctly fill the remaining screen 
            height and handle its own scrolling */}
        <main className='flex-1 overflow-y-auto '>
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout;