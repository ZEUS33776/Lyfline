import React from 'react';
import banner from '../assets/images/banner.jpg'; // Ensure this path is correct

const Banner = () => {
    return (
        <div className='w-full bg-slate-100 mt-10'>
            <div className="max-w-screen-xl h-screen mx-auto px-4 py-5 bg-slate-100">
                <div className="flex flex-col lg:flex-row-reverse items-center lg:gap-5 py-5">
                    <div className="w-full h-full sm:w-4/5 lg:w-1/2">
                        <img 
                            src={banner} 
                            className="block mx-auto lg:mx-0 w-full h-auto" 
                            alt="Banner" 
                            width="700" 
                            height="600" 
                            loading="lazy" 
                        />
                    </div>
                    <div className="lg:w-1/2 text-center lg:text-left">
                        <h1 className="text-[3rem] font-bold text-gray-800 leading-tight mb-3">
                            Empowering You with Personalized Heart Health Insights.
                        </h1>
                        <p className="text-lg text-gray-500">
                            "Empowering You with Personalized Heart Health Insights" offers tailored assessments and real-time data, enabling proactive heart health management and informed decision-making for a healthier future.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Banner;
