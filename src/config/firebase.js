import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCICcvEtFD9DdAyJxNnHwNw5yRP_55PKto",
    authDomain: "simple-query-97f50.firebaseapp.com",
    projectId: "simple-query-97f50",
    storageBucket: "simple-query-97f50.appspot.com",
    messagingSenderId: "268100092189",
    appId: "1:268100092189:web:c3b3ae718e9049df53a1f4",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };