import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ReserveList from "./pages/ReserveList";
import ReserveDetail from "./pages/ReserveDetail";
import ReserveSummary from "./pages/ReserveSummary";

export default function ReserveRoutes() {
  return (
    <Routes>
      <Route path="/" element={<ReserveList />} />
      <Route path="/:id" element={<ReserveDetail />} />
      <Route path="/:id/summary" element={<ReserveSummary />} />
    </Routes>
  )
}