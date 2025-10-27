import React from "react"
import { Routes,Route } from "react-router-dom"
import CarRoutes from "../features/car/route.jsx"
import PaymentRoutes from "../features/payment/route.jsx"
import ReceiptRoutes from "../features/receipt/route.jsx"
import ReserveRoutes from "../features/reserve/route.jsx"
import { UserRoutes } from "../features/user/route.jsx"
export default function AppRoutes(){
    return (
        <Routes>
            <Route path="/cars/*" element={<CarRoutes />}/>
            <Route path="/users/*" element={<UserRoutes />}/>
            <Route path="/payments/*" element={<PaymentRoutes />}/>
            <Route path="/receipts/*" element={<ReceiptRoutes />}/>
            <Route path="/reservations/*" element={<ReserveRoutes />}/>
            <Route path="/" element={<div>TESTING</div>}/>
            <Route path="*" element={<div>404 - Page Not Found</div>} /> 
        </Routes>
    )
}