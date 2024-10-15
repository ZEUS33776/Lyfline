import React from 'react';
import realtime from "../src/assets/images/realtime.jpg"
import heart from "../src/assets/images/heart.jpg"
import alert from "../src/assets/images/alert.jpg"


const Features = () => {
    return (
        <div className='w-full bg-slate-50  'id="features">
            <div className="container px-4 py-5" id="hanging-icons">
            
                <h2 className="font-ubuntu text-xl text-gray-600 border-b-2 pb-2  font-semibold"><i class="fi fi-tr-features-alt"></i>Features</h2>
                <div className="row g-4 py-5 row-cols-1 row-cols-lg-3">
                    <div className="col d-flex align-items-start">
                        <div className="icon-square text-body-emphasis bg-body-secondary d-inline-flex align-items-center justify-content-center fs-4 flex-shrink-0 me-3">
                            <img src={realtime}   className='h-10'  alt="" />
                            
                        </div>
                        <div>
                            <h3 className="fs-2 text-body-emphasis mb-3">Risk Assessment </h3>
                            <p className='text-gray-600'>
                            The system analyzes patients' health data based on readings taken during regular medical rounds. By integrating this data with hospital systems, it offers personalized risk assessments for heart attacks and potential cardiovascular conditions. For new patients, even without a prior heart condition, the system predicts potential risks over time, enabling timely interventions and informed decision-making to improve overall patient care.
                            </p>
                            
                        </div>
                    </div>
                    <div className="col d-flex align-items-start">
                        <div className="icon-square text-body-emphasis  d-inline-flex align-items-center justify-content-center fs-4 flex-shrink-0 me-3">
                        <img src={heart}   className='h-10'  alt="" />
                        </div>
                        <div>
                            <h3 className="fs-2 text-body-emphasis  mb-3">Personalized Health Insights:</h3>
                            <p className='text-gray-600'>
                            Lyfline offers tailored insights based on individual user profiles, including factors like age, gender, medical history, and lifestyle choices. This personalization helps users understand their specific health risks and encourages proactive management of their heart health.
                            </p>
                            
                        </div>
                    </div>
                    <div className="col d-flex align-items-start">
                        <div className="icon-square text-body-emphasis bg-body-secondary d-inline-flex align-items-center justify-content-center fs-4 flex-shrink-0 me-3">
                        <img src={alert}   className='h-10'  alt="" />
                        </div>
                        <div>
                            <h3 className="fs-2 text-body-emphasis  mb-3">Proactive Alert System</h3>
                            <p className='text-gray-600'>
                            The system includes a proactive alert mechanism that notifies healthcare providers and patients of significant changes in health metrics. By delivering timely alerts for potential risks, users can take immediate action, enhancing overall heart health management and fostering better communication between patients and their healthcare teams.
                            </p>
                           
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Features;
