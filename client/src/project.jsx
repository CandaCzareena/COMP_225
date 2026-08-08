/* 
author: Saul Ramirez Barragan
course: COMP229 - Web Application Development
Date: June 02
Week2 Lab1
*/

//Projects Page

//Import images
import Capstone from './assets/Capstone.jpg';
import Trucky from './assets/Trucky.jpeg';
import Helgen from './assets/Helgen.png';

export default function Project() {
    return (
        <>
            <section id = "project">
                <h1>Recent Projects</h1>
                {/* List of services with images */}
                <div class ="project-subtitle">
                    {/* Project and date in same line but spaced */}
                    {/* Project 1 name */}
                    <div class = "project-text">
                        <h2>Cybersecurity Capstone Project</h2>
                    </div>
                    {/* Project 1 date */}
                    <div class = "project-date">
                        <h2>January-April 2026</h2>
                    </div>
                </div>
                {/* Project 1 location */}
                <div class = "project-text mt-0">
                    <h3 class = "mt-0">Centennial College, Toronto, ON, Canada </h3>
                </div>
                <div class = "project-subtitle">
                    {/* Project 1 description */}
                    <div class = "project-text">
                        <p>
                            Our task was to train a Machine Learning (ML) based Intrusion Detection System (IDS) and detect different types
                            of cyber attacks. I was in charge of the Blue team/Red team simulation, testing the model againts multiple threats:
                            DoS, Bruteforce, Recoinnasance, Backdoors, Worms and Exploits. Our model achived a confidence rate of 75%.
                        </p> 
                    </div>
                    {/* Project 1 image */}
                    <div class = "project-img">
                        <img src={Capstone} width="360" height="260" alt="" />
                    </div>
                </div>

                <div class ="project-subtitle">
                    {/* Project and date in same line but spaced */}
                    {/* Project 2 name */}
                    <div class = "project-text">
                        <h2>Autonomous Robots</h2>
                    </div>
                    {/* Project 2 date */}
                    <div class = "project-date">
                        <h2>January-May 2024</h2>
                    </div>
                </div>
                {/* Project 2 location */}
                <div class = "project-text mt-0">
                    <h3 class = "mt-0">Tecnologico de Monterrey, Mexico</h3>
                </div>
                <div class = "project-subtitle">
                    {/* Project 2 description */}
                    <div class = "project-text">
                        <p>
                            Our task was to rehabilitate and implement a line follower system for a 1/10 autonomous car. 
                            I was in charge of the communication between the robot and the control station. Through Sockets, 
                            the autonomous vehicle was able to receive commands to control its movement or send data 
                            (e.g. video feed, sensor lectures) to the control station. We boosted lane detection accuracy 
                            by 30% and improved system stability under varying light conditions.
                        </p> 
                    </div>
                    {/* Project 2 image */}
                    <div class = "project-img">
                        <img src={Trucky} width="360" height="260" alt="" />
                    </div>
                </div>

                <div class ="project-subtitle">
                    {/* Project and date in same line but spaced */}
                    {/* Project 3 name */}
                    <div class = "project-text">
                        <h2>Autonomous Forklift-Helgen Technologies</h2>
                    </div>
                    {/* Project 3 date */}
                    <div class = "project-date">
                        <h2>October-December 2023</h2>
                    </div>
                </div>
                {/* Project 3 location */}
                <div class = "project-text mt-0">
                    <h3 class = "mt-0">Tecnologico de Monterrey, Mexico</h3>
                </div>
                <div class = "project-subtitle">
                    {/* Project 3 description */}
                    <div class = "project-text">
                        <p>
                            Our goal was to redesign the wheels and train an object detection convolutional neural network (CNN)
                            for an autonomous lift truck. My task was to desing the neural network and train it with visual data captured 
                            from our own simulations and public datasets. The model achieved 95% object recognition accuracy 
                            and was able to detect pallets, boxes, shelves and persons.
                        </p> 
                    </div>
                    {/* Project 3 image */}
                    <div class = "project-img">
                        <img src={Helgen} width="360" height="260" alt="" />
                    </div>
                </div>
                
            </section>
        </>
    );
}