import React from 'react'
import GorgiaLogo from '../../../assets/gorgia-jobs-cover.png'
import BiostarLogo from '../../../assets/Biostar.png'

const Login = () => {
  return (
    <div className="bg-[#1976D2] w-full h-[100vh] flex flex-col justify-between items-center py-[100px]">
        <div className='flex flex-col justify-center items-center'>
            <img src={GorgiaLogo} alt="" />
            <img src={BiostarLogo} alt="" />
        </div>
        <div className='flex flex-col justify-center items-center mt-6 gap-12 w-[575px] '>
            <input 
                type="text" 
                placeholder='email'
                className="bg-transparent text-white outline-none border-b border-white w-full py-2 placeholder-white "
            />
            <input 
                type="text" 
                placeholder='password'
                className="bg-transparent text-white outline-none border-b border-white w-full py-2 placeholder-white "
            />
            <button className='text-[17px] bg-[#FBD15B] text-[#1976D2] w-full rounded-md py-4 font-bold'>
                Login
            </button>
            <p className='text-gray-200'>
                Don’t have an account? <span className='text-[#FFFFFF]'>Signup Here</span>
            </p>
        </div>
        
    </div>
  )
}

export default Login