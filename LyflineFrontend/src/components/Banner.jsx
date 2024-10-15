import React from 'react';
import banner from '../assets/images/banner.jpg'; // Ensure this path is correct

const Banner = () => {
    return (
        <div className='w-full bg-slate-100   mt-10'>
            <div className="container col-xxl-8 px-4 py-5 bg-slate-100">
                <div className="row flex-lg-row-reverse align-items-center g-5 py-5">
                    <div className="col-10 col-sm-8 col-lg-6">
                        <img 
                            src={banner} // Use the imported image
                            className="d-block mx-lg-auto img-fluid" 
                            alt="Banner" 
                            width="700" 
                            height="600" 
                            loading="lazy" 
                        />
                    </div>
                    <div className="col-lg-6">
                        <h1 className="display-5 fw-bold text-body-emphasis lh-1 mb-3">
                            Empowering You with Personalized Heart Health Insights.
                        </h1>
                        <p className="lead">
                            "Empowering You with Personalized Heart Health Insights" offers tailored assessments and real-time data, enabling proactive heart health management and informed decision-making for a healthier future.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Banner;
