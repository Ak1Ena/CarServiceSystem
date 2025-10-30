import { Routes, Route } from 'react-router-dom'
import PaymentList from './pages/PaymentList.jsx'
export default function PaymentRoutes(){
    return(
        <Routes>
            <Route path='/' element={<PaymentList/>}/>
        </Routes>
    )
}