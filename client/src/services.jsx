/* 
author: Saul Ramirez Barragan
course: COMP229 - Web Application Development
Date: June 02
Week2 Lab1
*/

//Services Page
import Programming from './assets/Programming.jpg';
import Web from './assets/Web_dev.jpg';
import SQL from './assets/SQL.jpg';
import Robotics from './assets/Robotics.jpg';

export default function Services() {
    return (
        <>
            <section id = "services">
                <h1>My Services</h1>
                {/* List of services with images */}
                <div class = "service-list">
                    <div>
                        <img src={Programming} width="340" height="200" alt="" />
                        <h4>General progamming</h4>
                    </div>
                    <div>
                        <img src={Web} width="340" height="200" alt="" />
                        <h4>Web Development</h4>
                    </div>
                    <div>
                        <img src={SQL} width="340" height="200" alt="" />
                        <h4>SQL</h4>
                    </div>
                    <div>
                        <img src={Robotics} width="340" height="200" alt="" />
                        <h4>Robotics</h4>
                    </div>
                </div>
            </section>
        </>
    );
}