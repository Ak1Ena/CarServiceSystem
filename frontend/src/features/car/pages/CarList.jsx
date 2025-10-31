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

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-[#1E293B] p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white flex items-center gap-2">
          🚗 Car List
        </h1>
        <button
          onClick={() => navigate("/cars/add")}
          className="bg-green-500 text-white px-5 py-2 rounded-lg font-medium hover:bg-green-600 transition-colors shadow-md"
        >
          + Add Car
        </button>
      </div>

      {/* Car Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {list.map((car) => (
          <div
            key={car.id}
            className="bg-[#2D3B55] rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
          >
            <img
              src={`data:image/jpeg;base64,${car.img1}`}
              alt={car.model}
              className="w-full h-44 object-cover"
            />

            <div className="p-5 text-gray-100">
              <h2 className="text-lg font-semibold mb-1">{car.model}</h2>
              <p className="text-sm text-gray-400 capitalize">
                Type: {car.type || "—"}
              </p>
              <p className="text-sm text-gray-400 mt-1">
                Plate: {car.plateNumber}
              </p>
              <p className="text-sm text-gray-400 mt-1">
                Location: {car.pickUp || "—"}
              </p>

              <div className="flex justify-between items-center mt-4">
                <span className="text-xl font-bold text-white">
                  ฿{car.price}
                  <span className="text-sm text-gray-400"> /day</span>
                </span>
                <div className="flex gap-3">
                  <button
                    onClick={() => navigate(`edit/${car.id}`)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => dispatch(deleteCar(car.id))}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty List Message */}
      {list.length === 0 && (
        <div className="text-center text-gray-400 mt-10">
          🚘 No cars found. Add your first one!
        </div>
      )}
    </div>
  );
}
