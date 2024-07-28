import React, { useState, useEffect } from "react";
import { db } from "../config/firebase";
import { collection, query, getDocs } from "firebase/firestore";
import "../styles/inbox.css";

function Inbox() {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [isSearchActive, setIsSearchActive] = useState(false);

    useEffect(() => {
        if (searchQuery.trim() === "") {
            setSearchResults([]);
            return;
        }

        const fetchUsers = async () => {
            try {
                const q = query(collection(db, "users"));
                const querySnapshot = await getDocs(q);
                const results = [];

                querySnapshot.forEach((doc) => {
                    const userData = doc.data();
                    const fullName = `${userData.firstName} ${userData.lastName}`.toLowerCase();
                    if (fullName.includes(searchQuery.toLowerCase())) {
                        results.push(userData);
                    }
                });

                setSearchResults(results);
            } catch (error) {
                console.error("Error fetching users: ", error);
            }
        };

        fetchUsers();
    }, [searchQuery]);

    return (
        <div className="inbox-page">
            <h1>Messenger</h1>
            <div className="main-content">
                <div className="chat-list">
                    <input
                        type="text"
                        className="search-bar"
                        placeholder="Search a user"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => setIsSearchActive(true)}
                        onBlur={() => setIsSearchActive(false)}
                    />
                    {isSearchActive && searchQuery.trim() && searchResults.length > 0 && (
                        <div className="searchbar-results">
                            {searchResults.map((user, index) => (
                                <p key={index} className="user-result">
                                    {user.firstName} {user.lastName}
                                </p>
                            ))}
                        </div>
                    )}
                    <div className="user-list">
                        <p className="users">Traf Law</p>
                        <p className="users">Eus Kid</p>
                        <p className="users">Sun Kid</p>
                        <p className="users">Eus Nikd</p>
                    </div>
                </div>
                <div className="messenger">
                    <p className="username">Username</p>
                    <div className="chat-box">
                        <div className="chat">
                            <p className="message">Hello, Good Morning</p>
                            <p className="time-sent">10:00 am</p>
                        </div>
                        <div className="chat cht2">
                            <p className="message">Whatsuppp</p>
                            <p className="time-sent">10:05 am</p>
                        </div>
                    </div>
                    <textarea
                        className="message-box"
                        placeholder="Type your message here..."
                    ></textarea>
                    <button>Send Message</button>
                </div>
            </div>
        </div>
    );
}

export default Inbox;
