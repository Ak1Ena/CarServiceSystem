import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux"
import axios from 'axios'

import PaymentCard from "../components/PaymentCard";
import { setPayments } from "../paymentSlice";
function PaymentList() {
    const dispatch = useDispatch();
    const payments = useSelector((state) => state.payments)
    // const items = [
    //     { id:1,title: "Engine Misfire", desc: "Engine misfire can be caused by..." },
    //     { id:2,title: "Engine Misfire", desc: "Engine misfire can be caused by..." },
    //     { id:3,title: "Engine Misfire", desc: "Engine misfire can be caused by..." },
    //     { id:4,title: "Engine Misfire", desc: "Engine misfire can be caused by..." },
    // ];
    useEffect(() => {
        async function getPayment() {
            const userId = localStorage.getItem("UserId") || 1;
            const res = await axios.get(`http://localhost:8086/payments/owner/${userId}`)
            console.log(res)
            dispatch(setPayments(res.data));
        }
        getPayment();
    }, [])

    return (
        <div className="flex flex-col items-center min-h-screen bg-[#1e1e1e] py-16">
            <h1 className="text-2xl font-semibold text-white mb-10">Confirm payment</h1>

            <div className="flex flex-col gap-6 w-full max-w-3xl">
                {payments && payments.length > 0 ? (
                    payments.map((item) => (
                        <PaymentCard key={item.id} title={item.title} desc={item.desc} />
                    ))
                ) : (
                    <div className="text-white text-center text-sm py-10 opacity-70">
                        ไม่พบข้อมูลการชำระเงิน
                    </div>
                )}
            </div>

        </div>
    )
}
export default PaymentList;