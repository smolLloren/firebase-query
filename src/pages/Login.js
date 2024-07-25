import React from "react";
import '../styles/Login.css'

function Login() {
    return (
        <div className="login-page">
            <div className="main-content">
                <h2>Login</h2>
                <input type="email" placeholder="Email"/>
                <input type="password" placeholder="Password"/>
                <button>Login</button>
            </div>
        </div>
    );
}

export default Login;
