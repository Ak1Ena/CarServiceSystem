import { useEffect, useState , useMemo} from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";

import { confirmPayment } from "../services/Api";
function PaymentDetail() {
    const { id } = useParams(); // paymentId as string
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { list, loading, error } = useSelector((state) => state.payment);

    // const reserveObj = list.flatMap((carNode) => (carNode?.reserves || []).map((r) => ({ ...r, car: carNode }))).find((r) => r?.payment?.paymentId?.toString() === id) || null;
    const reserveObj = useMemo(() => {
        if (!list || list.length === 0) return null;

        for (const carNode of list) {
            const reserves = carNode?.reserves || [];
            for (const reserve of reserves) {
            if (reserve?.payment?.paymentId?.toString() === id) {
                return { ...reserve, car: carNode };
            }
            }
        }
        return null;
    }, [list, id]);
    if (!reserveObj) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-600">
                <p>ไม่พบข้อมูลการชำระเงิน (paymentId: {id})</p>
            </div>
        );
    }

    const { reserve, renter, payment, car } = reserveObj;
    const handleConfirm = () => {
        if (!payment?.paymentId) return;
        if (payment.status === "PAID") return alert("Payment already confirmed.");
        dispatch(
            confirmPayment({
                paymentId: payment.paymentId,
                body: { paymentMethod: payment.paymentMethod ?? "CASH" }
            })
        ).unwrap()
            .then(() => {
                navigate("/payments");
            })
            .catch((error) => {
                console.error("Confirm payment failed:", error);
                alert("Confirm payment failed. See console.");
            });
    }

    return (
        <div className="min-h-screen flex flex-col items-center py-12 ">
            <div className="rounded-2xl shadow-lg w-[800px] p-10 mb-8 flex flex-col border border-gray-100 bg-gray-50">
                <h2 className="text-2xl font-bold text-red-700 mb-2">{car?.car.model ?? "Unknown Car"}</h2>
                <p className="text-gray-700 mb-6">Price: {payment?.grandTotal ?? "-"} .-</p>

                <div className="flex gap-8">
                    <div className="bg-gray-200 w-60 h-60 rounded-sm overflow-hidden flex items-center justify-center">
                        {car?.car?.img1 ? (
                            <img src={`data:image/jpeg;base64,${car.car.img1}`} alt={car.car.model} className="object-cover w-full h-full" />
                        ) : (
                            <span className="text-gray-400 text-sm">No Image</span>
                        )}
                    </div>

                    <div className="flex flex-col justify-center text-black space-y-3">
                        <p><span className="font-semibold">RENTER:</span> {renter?.name ?? "-"}</p>
                        <p><span className="font-semibold">PickUp AT:</span> {car?.car?.pickUp ?? "-"}</p>
                        <p><span className="font-semibold">STATUS:</span> {payment?.status ?? "NO PAYMENT"}</p>
                    </div>
                </div>

                <div className="flex justify-end mt-8 gap-3">
                    <button
                        onClick={() => navigate(-1)}
                        className=" px-4 py-2 rounded"
                    >
                        Back
                    </button>

                    <button
                        onClick={() => { handleConfirm(); }}
                        className="bg-red-700 text-white px-5 py-2 rounded hover:bg-red-800 transition"
                        disabled={loading || !payment?.paymentId || payment?.status === "PAID"}
                    >
                        {payment?.status === "PAID"
                            ? "Already Paid"
                            : loading
                                ? "Processing..."
                                : "Confirm Payment"
                        }
                    </button>
                </div>
            </div>
        </div>
    );
}

export default PaymentDetail;
