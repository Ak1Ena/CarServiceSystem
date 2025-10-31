import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchCarById, createReserve } from "../services/Api.js";
import { useSelector, useDispatch } from "react-redux";

export default function CarDetail() {
  const { carId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userId = localStorage.getItem("userId") || 1
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [message, setMessage] = useState("");

  const { success, loading: reserveLoading, error: reserveError } = useSelector((state) => state.car);

  useEffect(() => {
    const loadCar = async () => {
      console.log("Fetching car id:", carId);
      try {
        const resultAction = await dispatch(fetchCarById(carId));
        const data = resultAction.payload;
        console.log("Fetched car data:", data);
        setCar(data);
      } catch (err) {
        console.error("❌ Error fetching car:", err);
        setError("Cannot load car details");
      } finally {
        setLoading(false);
      }
    };

    if (carId) loadCar();
  }, [carId, dispatch]);

  const handleReserve = async () => {
    if (!startDate || !endDate) {
      setMessage("⚠️ Please select start and end dates.");
      return;
    }

    try {
      const reserveData = {
        carId: carId,
        userId: userId, // 👈 แก้เป็น user id จริงจากระบบ login
        startDate,
        endDate,
      };

      console.log("Creating reserve:", reserveData);
      await dispatch(createReserve(reserveData)).unwrap();
      setMessage("✅ Reservation successful!");
    } catch (err) {
      console.error("Reserve error:", err);
      setMessage("❌ Failed to reserve car.");
    }
  };

  if (loading)
    return <div className="text-center text-gray-300 mt-10 text-xl">Loading...</div>;

  if (error)
    return <div className="text-center text-red-400 mt-10 text-xl">{error}</div>;

  if (!car)
    return <div className="text-center text-gray-300 mt-10 text-xl">No car data found</div>;


  
  return (
    <div className="min-h-screen bg-[#1E293B] flex justify-center items-center p-6">
      <div className="max-w-2xl w-full bg-[#2D3B55] text-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold mb-6">{car.model}</h1>

        {/* --- แสดงภาพรถ (รองรับ img1, img2, img3) --- */}
<div className="mb-6">
  {car.img1 || car.img2 || car.img3 ? (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {[car.img1, car.img2, car.img3].map((img, index) => {
        if (!img) return null;
        return (
          <div key={index} className="relative group">
           <img
  src={
    car.img1 && typeof car.img1 === 'string' && car.img1.trim() !== ''
      ? `data:image/jpeg;base64,${car.img1}`
      : "https://via.placeholder.com/400x300/1E293B/64748B?text=No+Image"
  }
  alt={`${car.model} - รูปภาพ`}
  className="w-full h-48 object-cover rounded-xl shadow-lg border border-gray-600"
  onError={(e) => {
    // สำรองกรณี Base64 พัง
    e.currentTarget.src = "https://via.placeholder.com/400x300/1E293B/64748B?text=No+Image";
  }}
/>
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition rounded-xl flex items-center justify-center">
              <p className="text-white opacity-0 group-hover:opacity-100 font-medium">
                ภาพที่ {index + 1}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  ) : (
    <div className="bg-gradient-to-br from-gray-700 to-gray-800 h-64 rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-gray-600">
      <svg className="w-16 h-16 text-gray-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      <p className="text-gray-400">ไม่มีรูปภาพ</p>
    </div>
  )}
</div>
        

        <div className="space-y-3 text-gray-300">
          <p>
            <span className="font-semibold">Plate:</span> {car.plateNumber}
          </p>
          <p>
            <span className="font-semibold">Type:</span> {car.type}
          </p>
          <p>
            <span className="font-semibold">Location:</span> {car.pickUp}
          </p>
          <p>
            <span className="font-semibold">Price/day:</span> ${car.price}
          </p>
          {car.description && (
            <p>
              <span className="font-semibold">Description:</span>{" "}
              {car.description}
            </p>
          )}
        </div>

        {/* ✅ Reserve Form */}
        <div className="mt-8 bg-[#1E293B] p-5 rounded-xl">
          <h2 className="text-2xl font-semibold mb-4 text-center">Reserve This Car</h2>

          <div className="flex flex-col space-y-4">
            <label className="flex flex-col">
              <span>Start Date:</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="p-2 mt-1 rounded bg-[#2D3B55] border border-gray-600 text-white"
              />
            </label>

            <label className="flex flex-col">
              <span>End Date:</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="p-2 mt-1 rounded bg-[#2D3B55] border border-gray-600 text-white"
              />
            </label>

            <button
              onClick={handleReserve}
              disabled={reserveLoading}
              className={`${
                reserveLoading ? "bg-gray-500" : "bg-green-600 hover:bg-green-700"
              } px-5 py-2 rounded-lg font-semibold mt-4`}
            >
              {reserveLoading ? "Reserving..." : "Reserve Now"}
            </button>

            {message && (
              <p
                className={`text-center mt-3 ${
                  message.includes("✅")
                    ? "text-green-400"
                    : message.includes("⚠️")
                    ? "text-yellow-400"
                    : "text-red-400"
                }`}
              >
                {message}
              </p>
            )}
          </div>
        </div>

        <div className="mt-8 text-right">
          <button
            onClick={() => navigate("/cars/list")}
            className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-lg font-semibold"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}
