import React from "react";
import { Route } from "react-router-dom";
import ReceiptPage from "../pages/ReceiptPage";

const ReceiptRoutes = () => {
  return <Route path="/receipt/:id" element={<ReceiptPage />} />;
};

export default ReceiptRoutes;
