import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";

import PaymentCard from "../components/PaymentCard";
import { setPayments } from "../paymentSlice";

function PaymentList() {
    const dispatch = useDispatch();
    const payments = useSelector((state) => state.payment); // raw data จาก Redux

    useEffect(() => {
        async function getPayment() {
            const userId = localStorage.getItem("UserId") || 1;
            try {
                const res = await axios.get(`http://localhost:8086/payments/owner/${userId}`);
                console.log("Fetched payments:", res.data);
                dispatch(setPayments(res.data)); // เก็บ raw data ทั้งหมด
            } catch (error) {
                console.error("Failed to fetch payments:", error);
            }
        }
        getPayment();
    }, []);

    return (
        <div className="flex flex-col items-center min-h-screen bg-[#1e1e1e] py-16">
            <h1 className="text-2xl font-semibold text-white mb-10">Confirm payment</h1>

            <div className="flex flex-col gap-6 w-full max-w-3xl">
                {payments?.cars && payments.cars.length > 0 ? (
                    payments.cars.flatMap(car =>
                        car.reserves.map(reserve => (
                            <PaymentCard
                                key={reserve.payment.paymentId}
                                id={reserve.payment.paymentId}
                                title={`Payment for ${car.car.model} (${car.car.plateNumber})`}
                                desc={`Renter: ${reserve.renter.name}, Amount: ${reserve.payment.grandTotal}, Status: ${reserve.payment.status}`}
                            />
                        ))
                    )
                ) : (
                    <div className="text-white text-center text-sm py-10 opacity-70">
                        ไม่พบข้อมูลการชำระเงิน
                    </div>
                )}
            </div>
        </div>
    );
}

export default PaymentList;
