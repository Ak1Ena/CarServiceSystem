import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

function PaymentDetail() {
    const payments = useSelector((state) => state.payment);
    const { id } = useParams();
    return (
        <div>
            <div className="min-h-screen  flex flex-col items-center py-12">

                <div className="bg-white rounded-md shadow-lg w-[800px] p-10 flex flex-col">
                    {/* Title & Price */}
                    <h2 className="text-2xl font-bold text-red-700 mb-2">
                        Engine Misfire
                    </h2>
                    <p className="text-gray-700 mb-6">Price: xxxxxxxx.-</p>

                    {/* Content */}
                    <div className="flex gap-8">
                        {/* Left image */}
                        <div className="bg-gray-200 w-60 h-60 rounded-sm"></div>

                        {/* Right info */}
                        <div className="flex flex-col justify-start text-black space-y-3">
                            <p><span className="font-semibold">OWNER:</span> </p>
                            <p><span className="font-semibold">RENTER:</span> </p>
                            <p><span className="font-semibold">RESERVE AT:</span> </p>
                        </div>
                    </div>

                    {/* Button */}
                    <div className="flex justify-end mt-8">
                        <button className="bg-red-700 text-white px-5 py-2 rounded hover:bg-red-800 transition">
                            Confirm Payment
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default PaymentDetail;