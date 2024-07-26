import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signOut,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import "../styles/Signup.css";

function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const navigate = useNavigate();
    const auth = getAuth();

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );
            const user = userCredential.user;

            await setDoc(doc(db, "users", user.uid), {
                firstName,
                lastName,
                email,
            });
            console.log("User signed out:", user.email);
            await signOut(auth);
            navigate("/login");
        } catch (error) {
            console.error("Error signing up: ", error);
        }
    };

    return (
        <div className="signup-page">
            <div className="main-content">
                <h2>Signup</h2>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                />
                <button type="submit" onClick={handleSignup}>
                    Submit
                </button>
            </div>
        </div>
    );
}

export default Signup;
