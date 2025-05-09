import React from 'react';
import { assets } from '../assets/assets.js';
import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext.jsx';
import axios from 'axios';
import { toast } from 'react-toastify';


const Login = () => {
  const navigate = useNavigate();
  const {backendUrl,setIsLoggedIn,getUserData} = useContext(AppContext);
  const [state,setState] = useState('Sign Up');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      axios.defaults.withCredentials = true;
      if(state === 'Sign Up'){
        const {data} = await axios.post(backendUrl + "/api/auth/register", {
          name: fullName,
          password,
          email
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        if(data.success){
          setIsLoggedIn(true);
          getUserData();
          navigate('/');
        }else{
          toast.error(data.message);
        }
      }else{
        const {data} = await axios.post(backendUrl + '/api/auth/login', {
          email,
          password
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if(data.success){
          setIsLoggedIn(true);
          getUserData();
          navigate('/');
        }else{
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error);
    }
  }
  return (
    <div className='flex flex-col items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400'>
      <img onClick={() => navigate('/')} src={assets.logo} alt="logo" className='absolute left-5 sm:left-20 top-5 sm:w-32 cursor-pointer' />
      <div className='bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm'>
        <h2 className='text-3xl font-semibold text-center text-white mb-3'>{state === 'Sign Up' ? 'Create account' : 'Login'}</h2>
        <p className='text-center text-white/60 mb-10'>{state === 'Sign Up' ? 'Create your account to get started' : 'Login to your account to continue'}</p>

        <form onSubmit={onSubmitHandler}>
          {state === 'Sign Up' && (
            <div className='mb-4 flex items-center gap-5 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <img src={assets.person_icon} alt="person_icon" className='w-6 h-6' />
            <input onChange={(e) => setFullName(e.target.value)} value={fullName} className='rounded-full bg-transparent outline-none' type="text" placeholder='Enter Your Full Name' required/>
          </div>
          )}

          <div className='mb-4 flex items-center gap-5 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <img src={assets.lock_icon} className='w-6 h-6' />
            <input onChange={(e) => setPassword(e.target.value)} value={password} className='rounded-full bg-transparent outline-none' type="text" placeholder='Enter the passowrd' required/>
          </div>

          <div className='mb-4 flex items-center gap-5 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <img src={assets.mail_icon} className='w-6 h-6' />
            <input onChange={(e) => setEmail(e.target.value)} value={email} className='rounded-full bg-transparent outline-none' type="text" placeholder='Enter Your Email' required/>
          </div>

          <p onClick={() => navigate('/reset-password')} className='text-indigo-500 mb-4 cursor-pointer'>Forgot Password?</p>

          <button className='w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium'>{state}</button>

        </form>

        {state === 'Sign Up' ?  (
          <p className='text-center text-gray-500 text-xs mt-4'>Already have an account?{" "}
          <span className='text-blue-400 cursor-pointer underline' onClick={() => setState('Login')}>Login here</span>
          </p>
        ) : (
          <p className='text-center text-gray-500 text-xs mt-4'>Don't have an account?{" "}
          <span className='text-blue-400 cursor-pointer underline' onClick={() => setState('Sign Up')}>Sign Up</span>
          </p>
        )}

      </div>
    </div>
  );
}

export default Login;
