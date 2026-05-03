import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ConfigProvider, App as AntApp } from 'antd';

// constants
import { theme } from "@/constants/theme";

// components
import ProtectedRoutes from "@/components/global/ProtectedRoutes";
import GlobalLogic from "@/components/global/GlobalLogic";
import MainCommonWrap from "@/components/global/MainCommonWrap";

// pages
import Register from "@/pages/Register";
import Verification from "@/pages/Verification";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Campaign from "@/pages/Campaign";
import Workshop from "@/pages/Workshop";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import NotFound from "@/pages/NotFound";
import Settings from "@/pages/Settings";

function App() {
    return (
        <ConfigProvider theme={theme}>
            <AntApp>
                <Router>
                    <Routes>
                        <Route path="/register" element={<Register />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/verification" element={<Verification />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/reset-password" element={<ResetPassword />} />

                        <Route element={<ProtectedRoutes />}>
                            <Route element={<GlobalLogic />}>
                                <Route element={<MainCommonWrap />}>
                                    <Route path="/" element={<Dashboard />} />
                                    <Route path="/campaigns" element={<Campaign />} />
                                    <Route path="/workshop" element={<Workshop />} />
                                    <Route path="/settings" element={<Settings />} />
                                </Route>
                            </Route>
                        </Route>

                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </Router>
            </AntApp>
        </ConfigProvider>
    )
}

export default App
