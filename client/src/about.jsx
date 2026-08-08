/* 
author: Saul Ramirez Barragan
course: COMP229 - Web Application Development
Date: June 02
Week2 Lab1
*/

//About Page
import Portrait from './assets/Portrait.jpg';

export default function About() {
    return (
        <>
            {/* About me message */}
            <section id = "about">
                <h1>About Me</h1>
                <h2>Saul Ramirez Barragan</h2>
                {/* My portrait */}
                <div class = "portrait">
                    <img src={Portrait} width="315" height="465" alt="" />
                </div>
                {/* Link to my resume */}
                <a href="https://github.com/SaulRamirezBarragan/Portfolio-SaulRamirez/blob/main/client/src/assets/Saul%20Resume.pdf" target="_blank">My Resume</a>
                <p>
                    I currently study Software Engineering Technician at Centennial College. 
                    I have educational experience in robotics, neural networks, Internet of Things (IoT), 
                    cyber-physical systems and cybersecurity. Throughout my career I have learned that there 
                    are several ways to address a problem and being able to combine knowledge from different 
                    areas gives us the opportunity to generate a solution that meets the requirements and exceeds 
                    the client's expectations.
                </p>
            </section>
        </>
    );
}