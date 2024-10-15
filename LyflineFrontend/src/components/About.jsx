const About = () => {
    return (
        <div id="about" className="p-14 bg-slate-50">
            <h3 className="font-ubuntu text-xl text-gray-600 border-b-2 pb-2 mx-20 font-semibold ">About Lyfline</h3>
            
            <p className="mx-20 mt-4 text-gray-800 text-base leading-relaxed">
                At Lyfline, we are transforming how hospitals and healthcare providers predict and manage heart health. 
                Our mission is to empower both medical professionals and patients by providing <strong>real-time insights into cardiovascular risk</strong>, 
                enabling proactive intervention and better outcomes.
            </p>

            <p className="mx-20 mt-4 text-gray-800 text-base leading-relaxed">
                <strong>What We Do</strong> <br />
                Lyfline uses advanced machine learning algorithms to assess heart attack risks for all patients—even those without a known history of heart conditions. 
                By integrating seamlessly with existing hospital systems, our technology pulls real-time data, such as vital signs and lab results, 
                to predict the likelihood of heart issues before they occur. 
            </p>

            <p className="mx-20 mt-4 text-gray-800 text-base leading-relaxed">
                For new patients, we assess the probability of developing heart conditions in the future. Our system also continuously monitors current patients, 
                using the data nurses collect during regular rounds, to detect the possibility of a heart attack or other critical cardiac events.
            </p>

            <p className="mx-20 mt-4 text-gray-800 text-base leading-relaxed">
                <strong>Our Vision</strong> <br />
                We aim to redefine preventive healthcare by offering personalized insights and continuous monitoring. 
                Whether it’s identifying risks for new patients or providing real-time alerts for existing patients, 
                Lyfline helps healthcare teams stay one step ahead.
            </p>

            <p className="mx-20 mt-4 text-gray-800 text-base leading-relaxed">
                <strong>Why Lyfline?</strong> <br />
                <strong>Proactive Risk Detection:</strong> Early identification of potential heart issues, even for patients without prior heart conditions. <br />
                <strong>Seamless Hospital Integration:</strong> Works with existing systems to pull real-time data and continuously monitor patient health. <br />
                <strong>Advanced Machine Learning:</strong> Uses predictive analytics to assess and track cardiovascular risks, ensuring timely interventions.
            </p>

            <p className="mx-20 mt-4 text-gray-800 text-base leading-relaxed">
                Join us as we lead the way toward a future of predictive, personalized healthcare.
            </p>
        </div>
    );
};

export default About;
