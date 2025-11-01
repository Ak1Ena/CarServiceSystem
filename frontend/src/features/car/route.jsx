import { Routes, Route } from "react-router-dom";
import CarEdit from "./pages/CarEdit.jsx";
import CarForm from "./pages/CarForm.jsx";
import CarList from "./pages/CarList.jsx";
import CarDetail from "./pages/CarDetail.jsx";
export default function CarRoutes(){
    return(
        <Routes>
            <Route path="/edit-car" element={<CarEdit />} />
            <Route path="/add-car" element={<CarForm />} />
            <Route path="/edit/:id" element={<CarForm />} />
            <Route path="/list" element={<CarList />} />
            <Route path="/detail/:carId" element={<CarDetail />} />
      </Routes>
    )
}