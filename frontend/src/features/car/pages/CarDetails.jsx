import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCarById, deleteCar } from "../services/Api.js";

const CarDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const data = await getCarById(id);
        setCar(data);
      } catch (error) {
        console.error("Error fetching car:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCar();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this car?")) {
      await deleteCar(id);
      navigate("/cars"); // กลับไปหน้ารายการรถ
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!car) return <p>Car not found.</p>;

  return (
    <div className="car-details">
      <h2>Car Details</h2>
      <p><strong>ID:</strong> {car.id}</p>
      <p><strong>Model:</strong> {car.model}</p>
      <p><strong>Plate Number:</strong> {car.plateNumber}</p>
      <p><strong>Type:</strong> {car.type}</p>
      <p><strong>Price:</strong> {car.price}</p>
      <p><strong>Pick Up:</strong> {car.pickUp}</p>

      <div>
        {[car.img1, car.img2, car.img3].filter(Boolean).map((img, i) => (
          <img
            key={i}
            src={`http://localhost:8082/images/${img}`}
            alt={`car-${i}`}
            style={{ width: "180px", margin: "10px", borderRadius: "8px" }}
          />
        ))}
      </div>

      <div style={{ marginTop: "20px" }}>
        <button onClick={() => navigate(`/cars/edit/${id}`)}>Edit</button>
        <button onClick={handleDelete} style={{ marginLeft: "10px", color: "red" }}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default CarDetails;
