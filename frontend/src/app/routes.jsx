import React from "react"
import { Routes } from "react-router-dom"
import CarRoutes from "../features/car/route"
import PaymentRoutes from "../features/payment/route"
import ReceiptRoutes from "../features/receipt/route"
import ReserveRoutes from "../features/reserve/route"
import UserRoutes from "../features/user/route"
export default function AppRoutes(){
    return (
        <Routes>
            {CarRoutes}
            {PaymentRoutes}
            {ReceiptRoutes}
            {ReserveRoutes}
            {UserRoutes}
        </Routes>
    )
}