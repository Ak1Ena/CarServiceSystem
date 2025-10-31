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
  <div className="min-h-screen bg-[#1E293B] flex items-center justify-center p-6">
    <div className="w-full max-w-3xl bg-[#2D3B55] text-white rounded-2xl shadow-xl p-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-100">
        {id ? "Edit Car Details" : "Add New Car"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Upload Section */}
          <div className="relative">
            <label className="block text-gray-300 font-semibold mb-3">
              Add photos
            </label>
            <div className="border-2 border-dashed border-gray-500 rounded-xl h-40 flex flex-col items-center justify-center text-gray-400 hover:border-blue-400 transition-colors relative overflow-hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 mb-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a1 1 0 001 1h14a1 1 0 001-1v-1M12 12V4m0 8l3-3m-3 3l-3-3"
                />
              </svg>
              <p>
                <span className="text-red-400 cursor-pointer">
                  Click to upload
                </span>{" "}
                or drag and drop
              </p>
              <p className="text-xs text-gray-500 mt-1">
                PNG up to 10MB (3 pictures)
              </p>
              <input
                type="file"
                accept="image/jpeg"
                multiple
                onChange={(e) =>  {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 3) {
      alert("สามารถอัปโหลดได้ไม่เกิน 3 รูปเท่านั้น!");
      return;
    }
    setImages((prev) => [...prev, ...files]);
  }}
                className="absolute opacity-0 w-full h-full cursor-pointer"
              />
            </div>

            {/* แสดง Preview รูปภาพ */}
            {images.length > 0 && (
              <div className="mt-3 grid grid-cols-3 gap-3">
                {Array.from(images).map((img, index) => (
                  <img
                    key={index}
                    src={URL.createObjectURL(img)}
                    alt={`preview-${index}`}
                    className="h-24 w-full object-cover rounded-lg"
                  />
                ))}
              </div>
            )}
          </div>
           

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Name */}
          <div>
            <label className="block text-gray-300 mb-2 font-semibold">Name</label>
            <input
              type="text"
              placeholder="e.g. Toyota Camry"
              value={form.model}
              onChange={(e) => setForm({ ...form, model: e.target.value })}
              className="w-full bg-[#1E293B] border border-gray-600 rounded-lg p-3 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Plate Number */}
          <div>
            <label className="block text-gray-300 mb-2 font-semibold">Plate Number</label>
            <input
              type="text"
              placeholder="e.g. ABC-1234"
              value={form.plateNumber}
              onChange={(e) => setForm({ ...form, plateNumber: e.target.value })}
              className="w-full bg-[#1E293B] border border-gray-600 rounded-lg p-3 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-gray-300 mb-2 font-semibold">Type</label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="w-full bg-[#1E293B] border border-gray-600 rounded-lg p-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Select Type</option>
              <option value="Sedan">Sedan</option>
              <option value="SUV">SUV</option>
              <option value="Van">Van</option>
              <option value="Truck">Truck</option>
            </select>
          </div>

          {/* Location */}
          <div>
            <label className="block text-gray-300 mb-2 font-semibold">Location</label>
            <input
              type="text"
              placeholder="e.g. San Francisco, CA"
              value={form.pickUp}
              onChange={(e) => setForm({ ...form, pickUp: e.target.value })}
              className="w-full bg-[#1E293B] border border-gray-600 rounded-lg p-3 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Price */}
          <div className="md:col-span-2">
            <label className="block text-gray-300 mb-2 font-semibold">Price per day ($)</label>
            <input
              type="number"
              placeholder="e.g. 75"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="w-full bg-[#1E293B] border border-gray-600 rounded-lg p-3 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-gray-300 mb-2 font-semibold">Description</label>
          <textarea
            rows="4"
            placeholder="Briefly describe your car..."
            value={form.description || ""}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full bg-[#1E293B] border border-gray-600 rounded-lg p-3 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-red-600 hover:bg-red-700 transition-colors px-6 py-3 rounded-lg font-semibold"
          >
            {id ? "Update Car" : "Add Car"}
          </button>
        </div>
      </form>
    </div>
  </div>
);

}
