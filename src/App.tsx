import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// pages
import Register from "@/pages/Register";
import Verification from "@/pages/Verification";



function App() {

    return (
        <Router>
            <Routes>
                <Route path="/register" element={<Register />} />
                <Route path="/verification" element={<Verification />} />
            </Routes>
        </Router>
    )
}

export default App
