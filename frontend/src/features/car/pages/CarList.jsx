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
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">🚗 Car List</h1>
        <button
          onClick={() => navigate("/cars/add")}
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
        >
          + Add Car
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {list.map((car) => (
          <div key={car.id} className="bg-white p-4 rounded-lg shadow">
            <img
              src={`data:image/jpeg;base64,${car.img1}`} alt={car.model}
              className="w-full h-40 object-cover rounded-md"
            />
            <h2 className="font-semibold mt-2">{car.model}</h2>
            <p className="text-gray-600">Plate: {car.plateNumber}</p>
            <p className="text-gray-600">Price: {car.price} ฿</p>

            <div className="flex justify-between mt-3">
              <button
                onClick={() => navigate(`edit/${car.id}`)}
                className="text-blue-500 hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => dispatch(deleteCar(car.id))}
                className="text-red-500 hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
