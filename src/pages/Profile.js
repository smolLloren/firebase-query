import React from "react";
import "../styles/Profile.css";

function Profile() {
    return (
        <div className="profile-page">
            <div className="main-content">
                <h2>Your Profile</h2>
                <p>First Name: </p>
                <p>Last Name: </p>
                <p>Email : </p>
                <p>Password: </p>
                <button>Logout</button>
            </div>
        </div>
    );
}

export default Profile;
