import React from 'react';
import { assets } from '../assets/assets.js';
import { useNavigate } from 'react-router-dom';


const Navbar = () => {

  const navigate = useNavigate();

  return (
    <div className='w-full flex justify-between items-center p-4 sm:p-6 sm:p24 absolute top-0'>
      <img src={assets.logo} alt="abhishek" className='w-28 sm:w-32' />
      <button onClick={() => navigate('/login')} className='flex items-center gap-2 border border-gray-500 text-gray-800 px-6 py-2 rounded-full hover:bg-gray-100'>LOGIN <img src={assets.arrow_icon} alt="arrow_icon" className='w-5 h-5' /></button>
    </div>
  );
}

export default Navbar;
