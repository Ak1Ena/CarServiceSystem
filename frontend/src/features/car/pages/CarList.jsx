import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchCars, deleteCar } from "../services/Api.js";
import { useNavigate } from "react-router-dom";

export default function CarList() {
  const { list, loading } = useSelector((state) => state.car);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchCars());
  }, [dispatch]);

  const byteArrayToImageUrl = (byteArray) => {
    if (!byteArray) return null;
    const uint8Array = new Uint8Array(byteArray);
    const blob = new Blob([uint8Array], { type: "image/jpeg" });
    return URL.createObjectURL(blob);
  };

  if (loading) return <p className="text-center mt-10 text-white">Loading...</p>;

  return (
    <div className="min-h-screen bg-[#1E293B] p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white flex items-center gap-2">
          🚗 Car List
        </h1>
      </div>

      {/* 📦 Car Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {list && list.length > 0 ? (
          list.map((car) => (
            <div
              key={car.id}
              className="bg-[#2D3B55] rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
            >
              <img
                src={
                  car.img1
                    ? `data:image/jpeg;base64,${car.img1}`
                    : "https://via.placeholder.com/400x200?text=No+Image"
                }
                alt={car.model || "Car"}
                className="w-full h-44 object-cover"
              />

              <div className="p-5 text-gray-100">
                <h2 className="text-lg font-semibold mb-1 truncate">
                  {car.model || "Unnamed Car"}
                </h2>
                <p className="text-sm text-gray-400 capitalize">
                  Type: {car.type || "—"}
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  Plate: {car.plateNumber || "—"}
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  Location: {car.pickUp || "—"}
                </p>

                <div className="flex justify-between items-center mt-4">
                  <span className="text-xl font-bold text-white">
                    ฿{car.price ?? 0}
                    <span className="text-sm text-gray-400"> /day</span>
                  </span>

                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/cars/detail/${car.id}`)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm transition-colors"
                    >
                      Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-400 mt-10">
            🚘 No cars found!
          </div>
        )}
      </div>
    </div>
  );
}
