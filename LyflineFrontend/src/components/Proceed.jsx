import React from 'react';
import { useNavigate } from 'react-router-dom';

const Proceed = () => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/register');
    };

    return (
        <div className="px-4 py-5 my-5 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">Get Personalized Insights</h1>
            <div className="max-w-2xl mx-auto">
                <p className="text-lg text-gray-700 mb-8">
                    By completing the form, users can share their health details and questions, which enables the Lyfline system to deliver personalized insights into their cardiovascular wellness. This engagement empowers individuals to take proactive steps in managing their heart health effectively.
                </p>
                <div className="flex justify-center">
                    <button 
                        type="button" 
                        onClick={handleClick} 
                        className="bg-gradient-to-r from-red-400 via-red-500 to-red-600 text-white text-lg font-semibold px-6 py-3 rounded-md shadow-md hover:from-red-500 hover:via-red-600 hover:to-red-700 transition-all duration-300"
                    >
                        Begin your journey!
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Proceed;
