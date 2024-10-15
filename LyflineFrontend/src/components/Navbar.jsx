import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const handleSignInClick = () => {
        navigate('/signin')
    }
    return (
        <div className="flex items-center justify-between sticky">
            <div className="flex items-center gap-2">
                <img width="48" className="ml-12 mt-8" height="48" src="https://img.icons8.com/fluency/48/heart-with-pulse--v1.png" alt="heart-with-pulse--v1" />
                <h3 className="font-ubuntu mt-8 text-2xl font-bold text-slate-gray">Lyfline</h3>
            </div>
            <div className="flex gap-12 items-center">
                <h2 className="mt-8 text-lg font-medium cursor-pointer text-gray-600 hover:text-gray-500 hover:underline hover:underline-offset-8"><a href="#about">About</a></h2>
                <h2 className="mt-8 text-lg font-medium cursor-pointer text-gray-600 hover:text-gray-500 hover:underline hover:underline-offset-8"><a href="#features">Features</a></h2>
                <h2 className="mt-8 text-lg font-medium cursor-pointer text-gray-600 hover:text-gray-500 hover:underline hover:underline-offset-8"><a href="#howitworks">How It Works</a></h2>
            </div>
            <div className="flex items-center mr-12">
                <button type="button" onClick={handleSignInClick} className="bg-gradient-to-r from-red-400 via-red-500 to-red-600 mt-4 align-middle text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                   Sign in
                    <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                    </svg>
                </button>
            </div>
        </div>
    )
}

export default Navbar;