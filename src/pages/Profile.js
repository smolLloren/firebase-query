import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import "../styles/Profile.css";

function Profile() {
    const location = useLocation();
    const navigate = useNavigate();
    const auth = getAuth();
    const { email, password, firstName, lastName } = location.state || {};

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate("/login");
        } catch (error) {
            console.error("Error logging out: ", error);
        }
    };

    return (
        <div className="profile-page">
            <div className="main-content">
                <h2>Your Profile</h2>
                <p>First Name: {firstName}</p>
                <p>Last Name: {lastName}</p>
                <p>Email: {email}</p>
                <p>Password: {password}</p>
                <button onClick={handleLogout}>Logout</button>
            </div>
        </div>
    );
}

export default Profile;
