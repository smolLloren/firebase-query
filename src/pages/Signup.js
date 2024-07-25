import React from "react";
import '../styles/Signup.css'

function Signup() {
    return (
        <div className="signup-page">
            <div className="main-content">
                <h2>Signup</h2>
                <input type="email" placeholder="Email" />
                <input type="text" placeholder="Password" />
                <input type="text" placeholder="First Name" />
                <input type="text" placeholder="Last Name" />
                <button>Submit</button>
            </div>
        </div>
    );
}

export default Signup;
