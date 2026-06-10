import React, { useEffect, useRef, useState } from "react";
import './styles.css';
import Jaipur from '../src/image/Jaipur.jpg';
import Rishikesh from '../src/image/Rishikesh.avif';
import Kashmir from '../src/image/kashmir.webp';

function Destination(){
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                // Ab har baar animation repeat hoga!
                setIsVisible(entries[0].isIntersecting);
            },
            { threshold: 0.2 } 
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }
        
        return () => observer.disconnect();
    }, []);

    return(
        <div className="card" ref={sectionRef}>
          
            <div className={`formm dest-card ${isVisible ? "run-animation" : ""} delay-1`} >
                <h1>JAIPUR</h1>
                <img src={Jaipur} alt="jaipur" />
                <p className="para">Jaipur is a captivating blend of royal history, vibrant culture, and stunning Mughal-Rajput architecture</p>
            </div>

            <div className={`formm dest-card ${isVisible ? "run-animation" : ""} delay-2`}>
                <h1>RISHIKESH</h1>
                <img src={Rishikesh} alt="Rishikesh" />
                <p className="para">Rishikesh, located in Uttarakhand, is a serene town known as the "Yoga Capital of the World" and a major spiritual hub nestled in the Himalayan foothills</p>
            </div>
            
            <div className={`formm dest-card ${isVisible ? "run-animation" : ""} delay-3`}>
                <h1>Jammu & Kashmir</h1>
                <img src={Kashmir} alt="kashmir" />
                <p className="para">Legendary beauty, snowy mountains in Gulmarg, and serene shikara rides on Dal Lake in Srinagar.</p>
            </div>

        </div>
    );
}

export default Destination;
