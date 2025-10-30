import { Routes, Route } from 'react-router-dom'
import PaymentList from './pages/PaymentList.jsx'
import PaymentDetails from './pages/PaymentDetail.jsx'
export default function PaymentRoutes(){
    return(
        <Routes>
            <Route path='/' element={<PaymentList/>}/>
            <Route path='/:id' element={<PaymentDetails/>}/>
        </Routes>
    )
}