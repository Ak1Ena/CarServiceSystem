import { Routes, Route } from "react-router-dom";
import ReserveList from "./pages/ReserveList";
import ReserveDetail from "./pages/ReserveDetail";

export default function ReserveRoutes() {
  return (
    <Routes>
      <Route path="/" element={<ReserveList />} />
      <Route path="/:id" element={<ReserveDetail />} />
    </Routes>
  )
}
