import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ConfigProvider, App as AntApp } from 'antd';

// constants
import { theme } from "@/constants/theme";

// pages
import Register from "@/pages/Register";
import Verification from "@/pages/Verification";
import Login from "@/pages/Login";

function App() {
    return (
        <ConfigProvider theme={theme}>
            <AntApp>
                <Router>
                    <Routes>
                        <Route path="/register" element={<Register />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/verification" element={<Verification />} />
                    </Routes>
                </Router>
            </AntApp>
        </ConfigProvider>
    )
}

export default App
