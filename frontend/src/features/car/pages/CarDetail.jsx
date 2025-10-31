import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchCarById } from "../services/Api.js";
import { useSelector, useDispatch } from "react-redux";

export default function CarDetail() {
  const { carId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

        {car.images && car.images.length > 0 && (
          <div className="grid grid-cols-2 gap-4 mb-6">
            {car.images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={car.model}
                className="w-full h-48 object-cover rounded-lg"
              />
            ))}
          </div>
        )}

        <div className="space-y-3 text-gray-300">
          <p><span className="font-semibold">Plate:</span> {car.plateNumber}</p>
          <p><span className="font-semibold">Type:</span> {car.type}</p>
          <p><span className="font-semibold">Location:</span> {car.pickUp}</p>
          <p><span className="font-semibold">Price/day:</span> ${car.price}</p>
          {car.description && (
            <p><span className="font-semibold">Description:</span> {car.description}</p>
          )}
          
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
