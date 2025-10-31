import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchCars, deleteCar, fetchCarForOwner } from "../services/Api.js";
import { useNavigate } from "react-router-dom";

export default function CarList() {
  const { list, loading } = useSelector((state) => state.car);
  const ownerId = localStorage.getItem("userId");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchCarForOwner(ownerId));
  }, [dispatch, ownerId]);

  const handleDelete = (carId) => {
    if (window.confirm("Are you sure you want to delete this car?")) {
      dispatch(deleteCar(carId));
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

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-light text-gray-500 uppercase tracking-wider">
                  Your Inventory
                </span>
              </div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-2">
                My Cars
              </h1>
              <p className="text-gray-500 font-light">
                {list?.length || 0} {list?.length === 1 ? 'vehicle' : 'vehicles'} in your fleet
              </p>
            </div>

            {/* Add Car Button */}
            <button
              onClick={() => navigate("/cars/add-car")}
              className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-2xl font-medium shadow-lg shadow-red-500/20 hover:shadow-red-500/40 transition-all hover:scale-105 active:scale-95"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Add New Car</span>
            </button>
          </div>

          {/* Car Grid */}
          {list && list.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {list.map((car) => (
                <div
                  key={car.id}
                  className="group bg-zinc-900/50 border border-red-500/10 rounded-3xl overflow-hidden hover:border-red-500/30 transition-all duration-500 hover:scale-[1.02] hover:shadow-xl hover:shadow-red-500/10"
                >
                  {/* Image Section */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-zinc-900">
                    {car.img1 ? (
                      <>
                        <img
                          src={`data:image/jpeg;base64,${car.img1}`}
                          alt={car.model}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
                        
                        {/* Price Badge */}
                        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-red-500/20">
                          <span className="text-red-500 font-bold text-lg">
                            ฿{car.price}
                          </span>
                          <span className="text-gray-400 text-xs ml-1">/day</span>
                        </div>

                        {/* Edit Overlay */}
                        <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-3">
                          <button
                            onClick={() => navigate(`/cars/edit/${car.id}`)}
                            className="p-3 bg-blue-500/90 hover:bg-blue-600 rounded-full transition-colors"
                            title="Edit"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(car.id)}
                            className="p-3 bg-red-500/90 hover:bg-red-600 rounded-full transition-colors"
                            title="Delete"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg
                          className="w-16 h-16 text-red-500/20"
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
                      </div>
                    )}
                  </div>

                  {/* Content Section */}
                  <div className="p-6 space-y-4">
                    {/* Title */}
                    <div>
                      <h2 className="text-xl font-semibold mb-1 truncate group-hover:text-red-500 transition-colors">
                        {car.model}
                      </h2>
                      <div className="inline-block px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full">
                        <span className="text-red-500 text-xs font-light uppercase">
                          {car.type || "—"}
                        </span>
                      </div>
                    </div>

                    {/* Info Grid */}
                    <div className="space-y-2 text-sm font-light">
                      <div className="flex items-center text-gray-400">
                        <svg
                          className="w-4 h-4 text-red-500 mr-2 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                          />
                        </svg>
                        <span className="truncate">{car.plateNumber}</span>
                      </div>

                      <div className="flex items-center text-gray-400">
                        <svg
                          className="w-4 h-4 text-red-500 mr-2 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        <span className="truncate">{car.pickUp || "—"}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => navigate(`/cars/edit/${car.id}`)}
                        className="flex-1 py-2.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 hover:bg-blue-500/20 hover:border-blue-500/50 font-medium transition-all text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(car.id)}
                        className="flex-1 py-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 hover:border-red-500/50 font-medium transition-all text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="inline-block p-12 bg-zinc-900/50 border border-red-500/10 rounded-3xl">
                <svg
                  className="w-24 h-24 text-red-500/20 mx-auto mb-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                  />
                </svg>
                <p className="text-gray-500 font-light text-xl mb-6">
                  No cars yet. Start building your fleet!
                </p>
                <button
                  onClick={() => navigate("/cars/add-car")}
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-xl font-medium transition-all hover:scale-105"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Add Your First Car</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}