/* 
author: Saul Ramirez Barragan
course: COMP229 - Web Application Development
Date: June 02
Week2 Lab1
*/

//Education Page
export default function Education() {
    return (
        <>
            <section id = "education">
                {/* Backgroung */}
                <h1>Educational Background</h1>

                {/* Educational qualifications from most to least recent*/}
                {/* First program */}
                <div class ="education-subtitle">
                    {/* Program and date in same line but spaced */}
                    {/* Program name */}
                    <div class = "education-text">
                        <h2>Software Engineering Technician (Fast-Track) Ontario College Diploma </h2>
                    </div>
                    {/* Program date */}
                    <div class = "education-date">
                        <h2>May 2026 – Present</h2>
                    </div>
                </div>
                <div class ="education-subtitle mt-0">
                    <div class = "education-text">
                        <h3 class = "mt-0">Centennial College, Toronto, ON, Canada  </h3>
                    </div>
                </div>
                <div class = "education-courses">
                    <span className="bold">Relevant Courses:</span>
                    {/* Table with relevant courses */}
                    <table>
                        <tr>
                            <td>Java Programming</td> <td>Advanced Database Concepts (SQL)</td> <td>Web Application Development</td>
                        </tr>
                        <tr>
                            <td>Software System Designs</td> <td> </td> <td> </td>
                        </tr>
                    </table>
                </div>

                {/* Second program */}
                <div class ="education-subtitle">
                    {/* Program and date in same line but spaced */}
                    {/* Program name */}
                    <div class = "education-text">
                        <h2>Cybersecurity Ontario College Graduate Certificate  </h2>
                    </div>
                    {/* Program date */}
                    <div class = "education-date">
                        <h2>September 2025 – April 2026 </h2>
                    </div>
                </div>

                <div class ="education-subtitle mt-0">
                    <div class = "education-text">
                        <h3 class = "mt-0">Centennial College, Toronto, ON, Canada  </h3>
                    </div>
                    {/* Program and date in same line but spaced */}
                    <div class = "education-date">
                        <h3 class = "mt-0">GPA: 4.15/4.50 (A) </h3>
                    </div>
                </div>
                <div class = "education-courses">
                    <span className="bold">Relevant Courses:</span>
                    {/* Table with relevant courses */}
                    <table>
                        <tr>
                            <td>Mobile Network Security</td> <td>Cloud Security</td> <td>Ethical Hacking and Defense</td>
                        </tr>
                        <tr>
                            <td>Cryptography & Network Security</td> <td>Web Security</td> <td>Software Security</td>
                        </tr>
                        <tr>
                            <td>Information Systems Security</td> <td>Communication Networks</td> <td></td>
                        </tr>
                    </table>
                </div>

                {/* Third program */}
                <div class ="education-subtitle">
                    {/* Program and date in same line but spaced */}
                    {/* Program name */}
                    <div class = "education-text">
                        <h2>Robotics and Digital Systems Engineering Bachelor’s Degree  </h2>
                    </div>
                    {/* Program date */}
                    <div class = "education-date">
                        <h2>August 2020 – May 2024 </h2>
                    </div>
                </div>

                <div class ="education-subtitle mt-0">
                    <div class = "education-text">
                        <h3 class = "mt-0">Tecnologico de Monterrey, Mexico  </h3>
                    </div>
                    {/* Program and date in same line but spaced */}
                    <div class = "education-date">
                        <h3 class = "mt-0">GPA: 4.28/4.50 (A+) </h3>
                    </div>
                </div>
                <div class = "education-courses">
                    <span className="bold">Concentration:</span> Cyber-Physical Systems
                </div>

            </section>
        </>
    );
}