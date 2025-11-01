import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchCarById, createReserve } from "../services/Api.js";
import { useSelector, useDispatch } from "react-redux";

export default function CarDetail() {
  const { carId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userId = localStorage.getItem("userId") || 1;
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [message, setMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);

  const { success, loading: reserveLoading, error: reserveError } = useSelector((state) => state.car);

  useEffect(() => {
    const loadCar = async () => {
      try {
        const resultAction = await dispatch(fetchCarById(carId));
        const data = resultAction.payload;
        setCar(data);
      } catch (err) {
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
        userId: userId,
        startDate,
        endDate,
      };

      await dispatch(createReserve(reserveData)).unwrap();
      setMessage("✅ Reservation successful!");
      navigate("/cars/list")
    } catch (err) {
      setMessage("❌ Failed to reserve car.");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-red-500/20 rounded-full"></div>
          <div className="w-20 h-20 border-4 border-red-500 border-t-transparent rounded-full animate-spin absolute top-0"></div>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="bg-red-500/10 border border-red-500/30 rounded-3xl p-12 backdrop-blur-xl">
          <p className="text-red-500 text-2xl font-light">{error}</p>
        </div>
      </div>
    );

  if (!car)
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-gray-500 text-xl font-light">No car data found</p>
      </div>
    );

  const images = [car.car.img1, car.car.img2, car.car.img3].filter(Boolean);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Main Content */}
      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section with Image and Info Side by Side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            
            {/* Left: Image Gallery */}
            <div className="space-y-4">
              {images.length > 0 ? (
                <>
                  {/* Main Image */}
                  <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-zinc-900 border border-red-500/10">
                    <img
                      src={`data:image/jpeg;base64,${images[selectedImage]}`}
                      alt={car.model}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    
                    {/* Image Counter */}
                    <div className="absolute top-6 right-6 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-red-500/20">
                      <span className="text-sm font-light">{selectedImage + 1} / {images.length}</span>
                    </div>
                  </div>

                  {/* Thumbnail Gallery */}
                  {images.length > 1 && (
                    <div className="flex gap-3">
                      {images.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedImage(idx)}
                          className={`relative aspect-[4/3] w-24 rounded-xl overflow-hidden transition-all ${
                            selectedImage === idx 
                              ? 'ring-2 ring-red-500 scale-105' 
                              : 'opacity-50 hover:opacity-100 hover:scale-105'
                          }`}
                        >
                          <img
                            src={`data:image/jpeg;base64,${img}`}
                            alt={`Thumbnail ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="aspect-[4/3] rounded-3xl bg-zinc-900 border border-red-500/10 flex items-center justify-center">
                  <div className="text-center">
                    <svg className="w-16 h-16 text-red-500/20 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-gray-600 font-light">No images</p>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Car Information */}
            <div className="space-y-8">
              {/* Title Section */}
              <div>
                  <span className="text-red-500 text-sm font-light">{car.type}</span>
                <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                  {car.model}
                </h1>
                <p className="text-gray-500 font-light">{car.plateNumber}</p>
              </div>

              {/* Price Tag */}
              <div className="inline-flex items-baseline space-x-2 bg-gradient-to-r from-red-500 to-red-600 px-6 py-3 rounded-2xl">
                <span className="text-3xl font-bold">${car.car.price}</span>
                <span className="text-sm font-light opacity-90">/day</span>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-zinc-900/50 border border-red-500/10 rounded-2xl p-5">
                  <div className="text-gray-500 text-sm font-light mb-2">Location</div>
                  <div className="text-white font-medium flex items-center">
                    <svg className="w-4 h-4 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {car.car.pickUp}
                  </div>
                </div>

                <div className="bg-zinc-900/50 border border-red-500/10 rounded-2xl p-5">
                  <div className="text-gray-500 text-sm font-light mb-2">Plate Number</div>
                  <div className="text-white font-medium">{car.car.plateNumber}</div>
                </div>
              </div>

              {car.user.name && (
                <div className="bg-zinc-900/30 border border-red-500/10 rounded-2xl p-6">
                  <div className="text-gray-500 text-sm font-light mb-3">Owner</div>
                  <p className="text-gray-300 leading-relaxed font-light">{car.user.name}</p>
                </div>
              )}
            </div>
          </div>

          {/* Reservation Card */}
          <div className="bg-zinc-900/50 border border-red-500/10 rounded-3xl overflow-hidden backdrop-blur-sm">
            <div className="bg-gradient-to-r from-red-500/10 to-transparent p-8 border-b border-red-500/10">
              <h2 className="text-3xl font-bold">Reserve Now</h2>
              <p className="text-gray-500 font-light mt-2">Select your dates and confirm booking</p>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-3">
                  <label className="text-sm font-light text-gray-400 uppercase tracking-wider">
                    Pick-up Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-5 py-4 rounded-2xl bg-black border border-red-500/20 text-white font-light focus:border-red-500 focus:outline-none focus:ring-4 focus:ring-red-500/10 transition-all"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-light text-gray-400 uppercase tracking-wider">
                    Return Date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-5 py-4 rounded-2xl bg-black border border-red-500/20 text-white font-light focus:border-red-500 focus:outline-none focus:ring-4 focus:ring-red-500/10 transition-all"
                  />
                </div>
              </div>

              <button
                onClick={handleReserve}
                disabled={reserveLoading}
                className={`w-full py-5 rounded-2xl font-medium text-lg transition-all ${
                  reserveLoading
                    ? "bg-zinc-800 cursor-not-allowed"
                    : "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg shadow-red-500/20 hover:shadow-red-500/40 hover:scale-[1.02] active:scale-[0.98]"
                }`}
              >
                {reserveLoading ? (
                  <span className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    Confirm Reservation
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                )}
              </button>

              {message && (
                <div
                  className={`mt-6 p-5 rounded-2xl border text-center font-light ${
                    message.includes("✅")
                      ? "bg-green-500/10 border-green-500/30 text-green-500"
                      : message.includes("⚠️")
                      ? "bg-yellow-500/10 border-yellow-500/30 text-yellow-500"
                      : "bg-red-500/10 border-red-500/30 text-red-500"
                  }`}
                >
                  {message}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}