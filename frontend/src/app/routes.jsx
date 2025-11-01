import React from "react"
import { Routes, Route, Navigate} from "react-router-dom"
import CarRoutes from "../features/car/route.jsx"
import PaymentRoutes from "../features/payment/route.jsx"
import ReceiptRoutes from "../features/receipt/route.jsx"
import ReserveRoutes from "../features/reserve/route.jsx"

import About from "../pages/About.jsx"
import LoginPage from "../features/user/pages/login.jsx"
import RegisterPage from "../features/user/pages/register.jsx"

export default function AppRoutes() {
    const role = localStorage.getItem("userRole");
    const ProtectedRoute = ({ allowRoles, element }) => {
        if (!role) {
            return <Navigate to="/" replace />;
        }

        if (allowRoles.includes(role)) return element;
    }
    return (
        <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/cars/*" element={<ProtectedRoute allowRoles={["RENTER", "OWNER"]} element={<CarRoutes />} />} />
            <Route path="/payments/*" element={<ProtectedRoute allowRoles={["OWNER"]} element={<PaymentRoutes />} />} />
            <Route path="/receipts/*" element={<ProtectedRoute allowRoles={["RENTER"]} element={<ReceiptRoutes />} />} />
            <Route path="/reservations/*" element={<ProtectedRoute allowRoles={["OWNER"]} element={<ReserveRoutes />} />} />
            <Route path="*" element={<div>404 - Page Not Found</div>} />
            <Route path="/about" element={<ProtectedRoute allowRoles={["OWNER"]} element={<About />} />} />

        </Routes>
    )
}