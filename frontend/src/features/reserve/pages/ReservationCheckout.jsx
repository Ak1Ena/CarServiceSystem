import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { submitReservation } from "../reserveSlice";
import ReservationForm from "../components/ReservationForm";
import ReservationSummary from "../components/ReservationSummary";

const ReservationCheckout = () => {
  const dispatch = useDispatch();
  const { reservation, status } = useSelector((state) => state.reserve);

  const handleReservation = (data) => {
    dispatch(submitReservation(data));
  };

  return (
    <div className="flex bg-gray-900 text-white p-6 min-h-screen gap-8">
      <div className="flex-1 bg-gray-800 p-6 rounded-lg">
        <h1 className="text-2xl mb-4">Checkout</h1>
        {status === "loading" ? <p>Loading...</p> : <ReservationForm onSubmit={handleReservation} />}
      </div>
      <div className="w-1/3 bg-gray-700 p-6 rounded-lg">
        <ReservationSummary data={reservation} />
      </div>
    </div>
  );
};

export default ReservationCheckout;
