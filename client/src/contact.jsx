/* 
author: Saul Ramirez Barragan
course: COMP229 - Web Application Development
Date: June 02
Week2 Lab1
*/
//Contact Page
export default function Contact() {
    const info = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        console.log(data);
        window.location.href = "/";
    }
    return (
        <>
            <section id = "contact">

                <h1>Contact me</h1>

                <main>
                    {/* Panel with contact info */}
                    <div class="panel-hide">
                    </div>
                    <div class="panel">
                        <h2>Saul Ramirez</h2>
                        <p>Number: +1 (647) 779-0494</p>
                        <p>Email: saulramirez@hotmail.com</p>
                        <a href="https://www.linkedin.com/in/sa%C3%BAl-ram%C3%ADrez-barrag%C3%A1n-999b972bb/?locale=en-US" target="blank_">LinkedIn</a>
                    </div>
                    <div class="panel-hide">
                    </div>
                </main>

                <form onSubmit={info}>
                    {/* Name */}
                    <label for="name">First Name:</label>
                    <input type="text" id="name" name="name" placeholder="Enter your name" required/>
                    
                    {/* Name */}
                    <label for="name">Last Name:</label>
                    <input type="text" id="name" name="name" placeholder="Enter your name" required/>

                    {/* Email */}
                    <label for="email">Email Address:</label>
                    <input type="email" id="email" name="email" placeholder="Enter your email" required/>

                    {/* Message */}
                    <label for="message">Message:</label>
                    <textarea id="message" name="message" rows="4" placeholder="Write your message here..."></textarea>

                    {/* Submit */}
                    <button type="submit">Send</button>
                </form>
                
            </section>
        </>
    );
}