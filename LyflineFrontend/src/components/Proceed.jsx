import React from 'react';
import { useNavigate } from 'react-router-dom';

const Proceed = () => {
    const navigate=useNavigate()
    const handleClick = () => {
        navigate('/form')
        
    }
    return (
        <div className="px-4 py-5 my-5 text-center">
            
            <h1 className="display-5 fw-bold text-body-emphasis">Get Personalized Insights</h1>
            <div className="col-lg-6 mx-auto">
                <p className="lead mb-4 mt-8">
                By completing the form, users can share their health details and questions, which enables the Lyfline system to deliver personalized insights into their cardiovascular wellness. This engagement empowers individuals to take proactive steps in managing their heart health effectively.
                </p>
                <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
                    <button type="button" onClick={handleClick} className="btn  bg-gradient-to-r from-red-400 via-red-500 to-red-600 text-white btn-lg px-4 gap-3" >Begin your journey!</button>
                     
                </div>
            </div>
        </div>
    );
};

export default Proceed;
