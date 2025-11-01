import { Routes, Route } from "react-router-dom";
import CarEdit from "./pages/CarEdit.jsx";
import CarForm from "./pages/CarForm.jsx";
import CarList from "./pages/CarList.jsx";
import CarDetail from "./pages/CarDetail.jsx";
import { ProtectedRoute } from "../../app/routes.jsx";

export default function CarRoutes() {
  return (
    <Routes>
      {/* OWNER เท่านั้น */}
      <Route
        path="/edit-car"
        element={<ProtectedRoute allowRoles={["OWNER"]} element={<CarEdit />} />}
      />
      <Route
        path="/add-car"
        element={<ProtectedRoute allowRoles={["OWNER"]} element={<CarForm />} />}
      />
      <Route
        path="/edit/:id"
        element={<ProtectedRoute allowRoles={["OWNER"]} element={<CarForm />} />}
      />

      {/* RENTER และ OWNER เข้าดูได้ */}
      <Route
        path="/list"
        element={<ProtectedRoute allowRoles={["RENTER"]} element={<CarList />} />}
      />
      <Route
        path="/detail/:carId"
        element={<ProtectedRoute allowRoles={["RENTER"]} element={<CarDetail />} />}
      />
      <Route path="*" element={<div><h1>404 PAGE</h1> </div>}/>
    </Routes>
  );
}
