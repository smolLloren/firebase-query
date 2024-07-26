import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import Signup from "../src/pages/Signup";
import Login from "../src/pages/Login";
import Profile from "../src/pages/Profile";

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route index element={<Signup />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/profile" element={<Profile />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
