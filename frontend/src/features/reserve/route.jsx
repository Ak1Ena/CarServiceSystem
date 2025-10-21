import React from "react";
import { Route, Routes } from "react-router-dom";
import ReservationCheckout from "./pages/ReservationCheckout";

const ReserveRoutes = () => {
  return (
    <Routes>
      <Route path="/reserve/checkout" element={<ReservationCheckout />} />
    </Routes>
  );
};

export default ReserveRoutes;