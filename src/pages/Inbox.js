import React, { useState, useEffect } from "react";
import { db } from "../config/firebase";
import {
    collection,
    query,
    where,
    getDocs,
    getDoc,
    doc,
} from "firebase/firestore";
import { useLocation } from "react-router-dom";
import "../styles/inbox.css";

function Inbox() {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [isSearchActive, setIsSearchActive] = useState(false);
    const [conversationUsers, setConversationUsers] = useState([]);
    const location = useLocation();
    const { uid } = location.state;

    useEffect(() => {
        console.log("Logged-in user UID:", uid); // Debugging console log

        const fetchConversations = async () => {
            try {
                const q = query(
                    collection(db, "conversations"),
                    where("end-user", "==", uid)
                );
                const querySnapshot = await getDocs(q);
                const userMessages = new Map(); // Map to hold UIDs and their messages

                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    const senderUid = doc.id; // Document ID is the sender's UID
                    const message = data["message"];

                    // Add message to the corresponding sender
                    if (!userMessages.has(senderUid)) {
                        userMessages.set(senderUid, []);
                    }
                    userMessages.get(senderUid).push(message);
                });

                console.log("Sender UIDs and Messages:");
                userMessages.forEach(async (messages, senderUid) => {
                    // Fetch user data for each sender
                    try {
                        const userDoc = await getDoc(
                            doc(db, "users", senderUid)
                        );
                        if (userDoc.exists()) {
                            const userData = userDoc.data();
                            console.log(
                                `UID: ${senderUid}, First Name: ${
                                    userData.firstName
                                }, Last Name: ${
                                    userData.lastName
                                }, Messages: ${messages.join(", ")}`
                            );
                        } else {
                            console.log(
                                `UID: ${senderUid} not found in users collection.`
                            );
                        }
                    } catch (error) {
                        console.error("Error fetching user data: ", error);
                    }
                });

                // Fetch user data for each sender and update state
                const userPromises = [...userMessages.keys()].map(
                    async (id) => {
                        const userDoc = await getDoc(doc(db, "users", id));
                        return userDoc.data();
                    }
                );

                const users = await Promise.all(userPromises);
                setConversationUsers(users);
            } catch (error) {
                console.error("Error fetching conversations: ", error);
            }
        };

        if (uid) {
            fetchConversations();
        }
    }, [uid]);

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
                    const fullName =
                        `${userData.firstName} ${userData.lastName}`.toLowerCase();
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
                    {isSearchActive &&
                        searchQuery.trim() &&
                        searchResults.length > 0 && (
                            <div className="searchbar-results">
                                {searchResults.map((user, index) => (
                                    <p key={index} className="user-result">
                                        {user.firstName} {user.lastName}
                                    </p>
                                ))}
                            </div>
                        )}
                    <div className="user-list">
                        {conversationUsers.map((user, index) => (
                            <p key={index} className="users">
                                {user.firstName} {user.lastName}
                            </p>
                        ))}
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
