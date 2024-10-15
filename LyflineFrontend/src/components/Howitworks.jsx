const HowItWorks = () => {
    return (
        <div id="howitworks" className="p-14  bg-slate-50">
            <h3 className="font-ubuntu text-xl text-gray-600 border-b-2 pb-2 mx-20 font-semibold">How It Works</h3>
            
            <p className="mx-20 mt-4 text-gray-800 text-base leading-relaxed">
                Lyfline harnesses advanced machine learning and real-time data integration to enhance heart health management through the following steps:
            </p>
            
            <ol className="mx-24 mt-4 text-gray-800 text-base list-decimal leading-relaxed">
                <li className="mb-2"><strong className="text-gray-800">Data Integration:</strong> Connects with existing hospital systems to gather comprehensive patient data, including vital signs and lab results.</li>
                <li className="mb-2"><strong className="text-gray-800">Risk Assessment:</strong> Analyzes this data to evaluate cardiovascular risks for all patients, enabling early identification of potential heart issues.</li>
                <li className="mb-2"><strong className="text-gray-800">Continuous Monitoring:</strong> Continuously tracks current patients' health through data collected during routine checks, detecting critical cardiac events early.</li>
                <li className="mb-2"><strong className="text-gray-800">Personalized Insights:</strong> Provides tailored risk assessments and alerts, empowering healthcare teams to make informed decisions.</li>
                <li><strong>Proactive Intervention:</strong> Facilitates timely actions, improving patient outcomes and reducing hospital readmissions.</li>
            </ol>

            <p className="mx-20 mt-4 text-gray-800 text-base leading-relaxed">
                Lyfline redefines cardiovascular care by combining predictive analytics with personalized health insights, ensuring a proactive approach to heart health.
            </p>
        </div>
    )
}

export default HowItWorks;
