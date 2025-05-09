import React from 'react';
import { assets } from '../assets/assets.js';
import { useContext } from 'react';
import { AppContext } from '../context/AppContext.jsx';
import { useNavigate } from 'react-router-dom';


const Header = () => {
    const {userData} = useContext(AppContext);
    const navigate = useNavigate();
    return (
        <div className='flex flex-col items-center mt-20 px-4 text-gray-800 text-center'>
            <img src={assets.header_img} alt="header_img" className='w-36 h-36 rounded-full mb-6' />
            <h1 className='text-center flex justify-center items-center gap-2 font-italic text-2xl sm:text-3xl'>Hey {userData ? userData.name : 'Developer'}! <img className='w-8 aspect-square' src={assets.hand_wave} alt="" /></h1>
            <h1 className='text-4xl font-bold  sm:text-5xl text-center'>Welcome to our App</h1>
            <div className='flex flex-col items-center  font-bold text-center text-2xl gap-2 text-bold text-gray-500 w-full h-10'>We are glad to see you here</div>
            <p className='text-center text-gray-500'>Please login to continue</p>
            <button className='hover:bg-gray-10 transition-all  rounded-full border border-gray-500 px-6 py-2 rounded-full'>Get Started </button>

        </div>
   );
}


export default Header;
