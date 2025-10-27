// src/pages/PaymentDetail.jsx
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { setPayments } from "../paymentSlice";
import { updatePaymentStatus } from "../paymentSlice";

function PaymentDetail() {
    const { id } = useParams(); // paymentId as string
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const payments = useSelector((state) => state.payment);
    const [loading, setLoading] = useState(false);
    const [actioning, setActioning] = useState(false);

    // หา matched reserves จาก state (ตามโครงสร้าง controller)
    const matched = (payments?.cars || []).flatMap((carNode) => {
        const car = carNode?.car;
        const reserves = Array.isArray(carNode?.reserves) ? carNode.reserves : [];
        return reserves
            .filter((rnode) => {
                const payment = rnode?.payment;
                return payment && payment.paymentId?.toString() === id;
            })
            .map((rnode) => ({ ...rnode, car }));
    });

    const reserveObj = matched.length > 0 ? matched[0] : null;

    if (!reserveObj) {
        // ถ้าไม่มีข้อมูลใน redux — แสดงข้อความ (หรืออาจ fetch จาก backend เพิ่มเติม)
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-600">
                <p>ไม่พบข้อมูลการชำระเงิน (paymentId: {id})</p>
            </div>
        );
    }

    const { reserve, renter, payment, car } = reserveObj;

    async function confirmPayment() {
        console.log("Confirming payment for ID:", payment?.paymentId);
        if (!payment?.paymentId) return;
        if (payment.status === "PAID") return alert("Payment already confirmed.");
        setActioning(true);
        try {
            const body = { paymentMethod: payment.paymentMethod ?? "CASH" };
            const res = await axios.patch(`http://localhost:8086/payments/${payment.paymentId}/paid`, body);

            // res.data = PaymentDto (จาก backend)
            dispatch(
                updatePaymentStatus({
                    paymentId: res.data.paymentId,
                    status: res.data.status,
                    paymentMethod: res.data.paymentMethod,
                    paidAt: res.data.paidAt,
                })
            );

            navigate("/payments");
        } catch (error) {
            console.error("Confirm payment failed:", error);
            alert("Confirm payment failed. See console.");
        } finally {
            setActioning(false);
        }
    }

    return (
        <div className="min-h-screen flex flex-col items-center py-12 ">
            <div className="rounded-2xl shadow-lg w-[800px] p-10 mb-8 flex flex-col border border-gray-100 bg-gray-50">
                <h2 className="text-2xl font-bold text-red-700 mb-2">{car?.model ?? "Unknown Car"}</h2>
                <p className="text-gray-700 mb-6">Price: {payment?.grandTotal ?? "-"} .-</p>

                <div className="flex gap-8">
                    <div className="bg-gray-200 w-60 h-60 rounded-sm overflow-hidden flex items-center justify-center">
                        {car?.img1 ? (
                            <img src={`data:image/jpeg;base64,${car.img1}`} alt={car.model} className="object-cover w-full h-full" />
                        ) : (
                            <span className="text-gray-400 text-sm">No Image</span>
                        )}
                    </div>

                    <div className="flex flex-col justify-center text-black space-y-3">
                        {/* <p><span className="font-semibold">OWNER:</span> {car?.userId ?? "-"}</p> */}
                        <p><span className="font-semibold">RENTER:</span> {renter?.name ?? "-"}</p>
                        <p><span className="font-semibold">PickUp AT:</span> {car?.pickUp ?? "-"}</p>
                        <p><span className="font-semibold">STATUS:</span> {payment?.status ?? "NO PAYMENT"}</p>
                        {/* <p><span className="font-semibold">Payment ID:</span> {payment?.paymentId ?? "-"}</p> */}
                    </div>
                </div>

                <div className="flex justify-end mt-8 gap-3">
                    <button
                        onClick={() => navigate(-1)}
                        className=" px-4 py-2 rounded"
                        disabled={actioning}
                    >
                        Back
                    </button>

                    <button
                        onClick={() =>{ confirmPayment();}}
                        className="bg-red-700 text-white px-5 py-2 rounded hover:bg-red-800 transition"
                        disabled={actioning || !payment?.paymentId || payment?.status === "PAID"}
                    >
                        {actioning ? "Processing..." : (payment?.status === "PAID" ? "Already Paid" : "Confirm Payment")}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default PaymentDetail;
