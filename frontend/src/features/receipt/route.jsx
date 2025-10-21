import React from "react";
import { Route, Routes } from "react-router-dom";
import ReceiptPage from "./pages/ReceiptPage.jsx";

const ReceiptRoutes = () => {
  return <Routes><Route path="/:id" element={<ReceiptPage />} /></Routes>;
};

export default ReceiptRoutes;
