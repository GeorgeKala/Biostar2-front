import React from 'react'
import Navbar from './Navbar/Navbar'
import Sidebar from './Sidebar/Sidebar'

const AuthenticatedLayout = ({children}) => {
  return (
    <div className='h-full'>
        <Navbar/>
        <div className='h-full flex'>
            <Sidebar/>
            {children}
        </div>
        
    </div>
  )
}

export default AuthenticatedLayout