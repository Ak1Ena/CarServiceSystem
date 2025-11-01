import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addCar, updateCar, fetchCars } from "../services/Api.js";
import { useNavigate, useParams } from "react-router-dom";

export default function CarForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const car = useSelector((state) => state.car.list.find((c) => c.id === Number(id)));
  const userId = localStorage.getItem("userId") || 1;
  const [form, setForm] = useState({
    model: "",
    plateNumber: "",
    price: "",
    pickUp: "",
    type: "",
    userId: userId,
  });
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  useEffect(() => {
    if (id && car) {
      setForm(car);
      // เก็บรูปเก่าที่มีอยู่แล้ว
      const oldImages = [];
      if (car.img1) oldImages.push({ data: car.img1, index: 1 });
      if (car.img2) oldImages.push({ data: car.img2, index: 2 });
      if (car.img3) oldImages.push({ data: car.img3, index: 3 });
      setExistingImages(oldImages);
    } else {
      dispatch(fetchCars());
    }
  }, [id, car, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("carDto", new Blob([JSON.stringify(form)], { type: "application/json" }));
    images.forEach((img) => formData.append("images", img));

    if (!userId) return navigate("/");

    try {
      if (id) {
        await dispatch(updateCar({ id, formData }));
        setImages([]);
        setToast({ show: true, message: "✅ Updated successfully!", type: "success" });
      } else {
        await dispatch(addCar(formData));
        setForm({
          model: "",
          plateNumber: "",
          price: "",
          pickUp: "",
          type: "",
          userId: userId,
        });
        setImages([]);
        setExistingImages([]);
        setToast({ show: true, message: "🚗 Added successfully!", type: "success" });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index) => {
    setExistingImages((prev) => prev.filter((img) => img.index !== index));
  };

  return (
    <div className="min-h-screen bg-black text-white py-16 px-4 sm:px-6 lg:px-8">
      {toast.show && (
        <div
          className={`fixed top-6 right-6 px-6 py-4 rounded-2xl shadow-lg transition-all duration-500 z-50
            ${toast.type === "success" ? "bg-green-600/90" : "bg-red-600/90"} 
            text-white text-sm font-medium`}
        >
          {toast.message}
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-400 hover:text-red-500 transition-colors mb-6 group"
          >
            <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-light">Back</span>
          </button>

          <div className="flex items-center space-x-3 mb-3">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-light text-gray-500 uppercase tracking-wider">
              {id ? "Update Vehicle" : "New Vehicle"}
            </span>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            {id ? "Edit Car Details" : "Add New Car"}
          </h1>
        </div>

        {/* Form Card */}
        <div className="bg-zinc-900/50 border border-red-500/10 rounded-3xl overflow-hidden backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Image Upload Section */}
            <div className="space-y-4">
              <label className="block text-sm font-light text-gray-400 uppercase tracking-wider">
                Vehicle Photos
              </label>

              <div className="relative">
                <input
                  type="file"
                  accept="image/jpeg"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files);
                    const totalImages = existingImages.length + images.length + files.length;
                    if (totalImages > 3) {
                      alert(`You can upload up to 3 images only! Currently: ${existingImages.length} existing + ${images.length} new`);
                      return;
                    }
                    setImages((prev) => [...prev, ...files]);
                  }}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="border-2 border-dashed border-red-500/20 rounded-2xl h-48 flex flex-col items-center justify-center text-gray-400 hover:border-red-500/50 hover:bg-red-500/5 transition-all cursor-pointer group"
                >
                  <svg
                    className="w-12 h-12 mb-3 text-red-500/30 group-hover:text-red-500/60 transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="font-light">
                    <span className="text-red-500">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-600 mt-2">
                    JPEG up to 10MB (Maximum 3 photos)
                  </p>
                </label>
              </div>

              {/* Image Preview Grid */}
              {(existingImages.length > 0 || images.length > 0) && (
                <div className="grid grid-cols-3 gap-4">
                  {/* แสดงรูปเก่า */}
                  {existingImages.map((img) => (
                    <div key={`old-${img.index}`} className="relative group aspect-[4/3] rounded-xl overflow-hidden border border-red-500/20">
                      <img
                        src={`data:image/jpeg;base64,${img.data}`}
                        alt={`existing-${img.index}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => removeExistingImage(img.index)}
                          className="p-2 bg-red-500 hover:bg-red-600 rounded-full transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full text-xs">
                        Existing
                      </div>
                    </div>
                  ))}

                  {/* แสดงรูปใหม่ */}
                  {images.map((img, index) => (
                    <div key={`new-${index}`} className="relative group aspect-[4/3] rounded-xl overflow-hidden border border-red-500/20">
                      <img
                        src={URL.createObjectURL(img)}
                        alt={`preview-${index}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="p-2 bg-red-500 hover:bg-red-600 rounded-full transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <div className="absolute top-2 right-2 bg-green-500/80 backdrop-blur-sm px-2 py-1 rounded-full text-xs">
                        New
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Form Fields Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Model Name */}
              <div className="space-y-3">
                <label className="block text-sm font-light text-gray-400 uppercase tracking-wider">
                  Car Model
                </label>
                <input
                  type="text"
                  placeholder="e.g. Toyota Camry"
                  value={form.model}
                  onChange={(e) => setForm({ ...form, model: e.target.value })}
                  className="w-full px-5 py-4 rounded-2xl bg-black border border-red-500/20 text-white font-light focus:border-red-500 focus:outline-none focus:ring-4 focus:ring-red-500/10 transition-all placeholder:text-gray-600"
                  required
                />
              </div>

              {/* Plate Number */}
              <div className="space-y-3">
                <label className="block text-sm font-light text-gray-400 uppercase tracking-wider">
                  Plate Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. ABC-1234"
                  value={form.plateNumber}
                  onChange={(e) => setForm({ ...form, plateNumber: e.target.value })}
                  className="w-full px-5 py-4 rounded-2xl bg-black border border-red-500/20 text-white font-light focus:border-red-500 focus:outline-none focus:ring-4 focus:ring-red-500/10 transition-all placeholder:text-gray-600"
                  required
                />
              </div>

              {/* Type */}
              <div className="space-y-3">
                <label className="block text-sm font-light text-gray-400 uppercase tracking-wider">
                  Vehicle Type
                </label>
                <select
                  value={form.type || ""}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full px-5 py-4 rounded-2xl bg-black border border-red-500/20 text-white font-light focus:border-red-500 focus:outline-none focus:ring-4 focus:ring-red-500/10 transition-all appearance-none cursor-pointer"
                  required
                >
                  <option value="">Select Type</option>
                  <option value="Sedan">Sedan</option>
                  <option value="SUV">SUV</option>
                  <option value="Van">Van</option>
                  <option value="Truck">Truck</option>
                  <option value="Coupe">Coupe</option>
                  <option value="Convertible">Convertible</option>
                </select>
              </div>

              {/* Location */}
              <div className="space-y-3">
                <label className="block text-sm font-light text-gray-400 uppercase tracking-wider">
                  Pick-up Location
                </label>
                <input
                  type="text"
                  placeholder="e.g. San Francisco, CA"
                  value={form.pickUp}
                  onChange={(e) => setForm({ ...form, pickUp: e.target.value })}
                  className="w-full px-5 py-4 rounded-2xl bg-black border border-red-500/20 text-white font-light focus:border-red-500 focus:outline-none focus:ring-4 focus:ring-red-500/10 transition-all placeholder:text-gray-600"
                  required
                />
              </div>

              {/* Price */}
              <div className="md:col-span-2 space-y-3">
                <label className="block text-sm font-light text-gray-400 uppercase tracking-wider">
                  Price per Day (฿)
                </label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-red-500 font-medium">฿</span>
                  <input
                    type="number"
                    placeholder="0.00"
                    min={0}
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full pl-12 pr-5 py-4 rounded-2xl bg-black border border-red-500/20 text-white font-light focus:border-red-500 focus:outline-none focus:ring-4 focus:ring-red-500/10 transition-all placeholder:text-gray-600"
                    required
                  />
                </div>
              </div>
            </div>



            {/* Submit Button */}
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-8 py-4 rounded-2xl font-medium transition-all ${isSubmitting
                    ? "bg-zinc-800 cursor-not-allowed"
                    : "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg shadow-red-500/20 hover:shadow-red-500/40 hover:scale-105 active:scale-95"
                  }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center space-x-3">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>{id ? "Updating..." : "Adding..."}</span>
                  </span>
                ) : (
                  <span className="flex items-center space-x-2">
                    <span>{id ? "Update Car" : "Add Car"}</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}