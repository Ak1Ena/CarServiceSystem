import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux"
import axios from 'axios'

import PaymentCard from "../components/PaymentCard";
import { setPayments } from "../paymentSlice";
function PaymentList() {
    const dispatch = useDispatch();
    const payments = useSelector((state) => state.payment)
    useEffect(() => {
        async function getPayment() {
            const userId = localStorage.getItem("UserId") || 1;
            const res = await axios.get(`http://localhost:8086/payments/owner/${userId}`)
            const paymentsArray = [];
            res.data.cars.forEach(carItem => {
                carItem.reserves.forEach(reserveItem => {
                    paymentsArray.push({
                        id: reserveItem.payment.paymentId,
                        title: `Payment for ${carItem.car.model} (${carItem.car.plateNumber})`,
                        desc: `Renter: ${reserveItem.renter.name}, Amount: ${reserveItem.payment.grandTotal}, Status: ${reserveItem.payment.status}`
                    });
                });
            });
            console.log(paymentsArray)
            dispatch(setPayments(paymentsArray));

        }
        getPayment();
    }, [])
    useEffect(() => {
        console.log("Payments updated:", payments);
    }, [payments]);


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