import React, { useState, useEffect } from "react";
import { db } from "../config/firebase";
import {
    collection,
    query,
    where,
    orderBy,
    getDocs,
    addDoc,
    Timestamp,
    onSnapshot,
    doc,
    getDoc,
} from "firebase/firestore";
import { useLocation } from "react-router-dom";
import "../styles/inbox.css";

function Inbox() {
    const location = useLocation();
    const loggedInUserID = location.state.uid;
    const [uniqueUserIDs, setUniqueUserIDs] = useState(new Set());
    const [userList, setUserList] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState(""); // State for message input

    useEffect(() => {
        const fetchConversations = async () => {
            const q1 = query(
                collection(db, "conversations"),
                where("senderID", "==", loggedInUserID)
            );
            const q2 = query(
                collection(db, "conversations"),
                where("receiverID", "==", loggedInUserID)
            );

            const [senderQuerySnapshot, receiverQuerySnapshot] =
                await Promise.all([getDocs(q1), getDocs(q2)]);

            const userIDs = new Set();

            senderQuerySnapshot.forEach((doc) => {
                userIDs.add(doc.data().receiverID);
            });
            receiverQuerySnapshot.forEach((doc) => {
                userIDs.add(doc.data().senderID);
            });

            setUniqueUserIDs(userIDs);
        };

        fetchConversations();
    }, [loggedInUserID]);

    useEffect(() => {
        const fetchUsers = async () => {
            const userPromises = Array.from(uniqueUserIDs).map(
                async (userID) => {
                    const userDoc = await getDoc(doc(db, "users", userID));
                    if (userDoc.exists()) {
                        return { id: userID, ...userDoc.data() };
                    } else {
                        console.error("No such user document!");
                        return null;
                    }
                }
            );

            const users = await Promise.all(userPromises);
            setUserList(users.filter((user) => user !== null));
        };

        if (uniqueUserIDs.size > 0) {
            fetchUsers();
        }
    }, [uniqueUserIDs]);

    useEffect(() => {
        if (selectedUser) {
            const q1 = query(
                collection(db, "conversations"),
                where("senderID", "in", [loggedInUserID, selectedUser.id]),
                where("receiverID", "in", [loggedInUserID, selectedUser.id]),
                orderBy("msgTimestamp", "asc")
            );

            const unsubscribe = onSnapshot(q1, (querySnapshot) => {
                const messages = querySnapshot.docs.map((doc) => ({
                    ...doc.data(),
                    id: doc.id,
                }));
                setMessages(messages);
            });

            return () => unsubscribe(); // Clean up the subscription on unmount
        }
    }, [selectedUser]);

    const handleUserClick = async (user) => {
        setSelectedUser(user);
    };

    const handleMessageInputChange = (event) => {
        setMessageInput(event.target.value);
    };

    const handleSendMessage = async () => {
        if (messageInput.trim() === "" || !selectedUser) return;

        try {
            await addDoc(collection(db, "conversations"), {
                senderID: loggedInUserID,
                receiverID: selectedUser.id,
                message: messageInput,
                msgTimestamp: Timestamp.fromDate(new Date()),
            });

            setMessageInput(""); // Clear input field after sending
        } catch (error) {
            console.error("Error sending message: ", error);
        }
    };

    const formatTime = (timestamp) => {
        return new Date(timestamp.toDate()).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className="inbox-page">
            <h1>Messenger</h1>
            <div className="main-content">
                <div className="chat-list">
                    <input
                        type="text"
                        className="search-bar"
                        placeholder="Search a user"
                    />
                    <div className="user-list">
                        {userList.map((user) => (
                            <p
                                className="users"
                                key={user.id}
                                onClick={() => handleUserClick(user)}
                            >
                                {`${user.firstName} ${user.lastName}`}
                            </p>
                        ))}
                    </div>
                </div>
                <div className="messenger">
                    <p className="username">
                        {selectedUser
                            ? `${selectedUser.firstName} ${selectedUser.lastName}`
                            : "Username"}
                    </p>
                    <div className="chat-box">
                        {messages.map((message) => (
                            <div
                                className="chat"
                                key={message.id}
                                style={{
                                    alignSelf:
                                        message.senderID === loggedInUserID
                                            ? "flex-end"
                                            : "flex-start",
                                }}
                            >
                                <p className="message">{message.message}</p>
                                <p className="time-sent">
                                    {formatTime(message.msgTimestamp)}
                                </p>
                            </div>
                        ))}
                    </div>
                    <textarea
                        className="message-box"
                        value={messageInput}
                        onChange={handleMessageInputChange}
                        placeholder="Type your message here..."
                    ></textarea>
                    <button onClick={handleSendMessage}>Send Message</button>
                </div>
            </div>
        </div>
    );
}

export default Inbox;
