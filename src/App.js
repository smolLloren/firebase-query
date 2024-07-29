import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import Signup from "../src/pages/Signup";
import Login from "../src/pages/Login";
import Profile from "../src/pages/Profile";
import Inbox from "../src/pages/Inbox";

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route index element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/inbox" element={<Inbox />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
