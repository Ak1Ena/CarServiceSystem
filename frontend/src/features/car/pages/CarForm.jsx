import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addCar, updateCar, fetchCars } from "../services/Api.js";
import { useNavigate, useParams } from "react-router-dom";

export default function CarForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const car = useSelector((state) => state.car.list.find((c) => c.id === Number(id)));
    const userId = localStorage.getItem("userId");
  const [form, setForm] = useState({
    model: "",
    plateNumber: "",
    price: "",
    pickUp: "",
    type: "",
    userId: userId,
  });
  const [images, setImages] = useState([]);

  useEffect(() => {
    if (id && car) setForm(car);
    else dispatch(fetchCars());
  }, [id, car, dispatch]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();

        // แปลง object form เป็น JSON string
        formData.append("carDto", new Blob([JSON.stringify(form)], { type: "application/json" }));

        // เพิ่มไฟล์ images
        images.forEach((img) => formData.append("images", img));

        // ตรวจสอบค่า
        for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }

        if (id) await dispatch(updateCar({ id, formData }));
        else await dispatch(addCar(formData));
    };


  return (
    <div className="max-w-lg mx-auto mt-10 bg-white p-6 rounded-xl shadow">
      <h1 className="text-xl font-semibold mb-4">{id ? "Edit Car" : "Add Car"}</h1>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          placeholder="Model"
          value={form.model}
          onChange={(e) => setForm({ ...form, model: e.target.value })}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Plate Number"
          value={form.plateNumber}
          onChange={(e) => setForm({ ...form, plateNumber: e.target.value })}
          className="w-full border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Pick-up location"
          value={form.pickUp}
          onChange={(e) => setForm({ ...form, pickUp: e.target.value })}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Type"
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
          className="w-full border p-2 rounded"
        />

        <input
          type="file"
          accept="image/jpeg"
          multiple
          onChange={(e) => setImages([...e.target.files])}
          className="w-full border p-2 rounded"
        />

        <button
          type="submit"
          className="bg-blue-500 text-white w-full py-2 rounded hover:bg-blue-600"
        >
          {id ? "Update Car" : "Add Car"}
        </button>
      </form>
    </div>
  );
}
