import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ConfigProvider, App as AntApp } from 'antd';

// constants
import { theme } from "@/constants/theme";

// components
import ProtectedRoutes from "./components/global/ProtectedRoutes";

// pages
import Home from "@/pages/Home";
import Register from "@/pages/Register";
import Verification from "@/pages/Verification";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import ForgotPassword from "@/pages/ForgotPassword";
import NotFound from "@/pages/NotFound";

function App() {
    return (
        <ConfigProvider theme={theme}>
            <AntApp>
                <Router>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/verification" element={<Verification />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />

                        <Route element={<ProtectedRoutes />}>
                            <Route path="/dashboard" element={<Dashboard />} />
                        </Route>

                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </Router>
            </AntApp>
        </ConfigProvider>
    )
}

export default App
