import { Routes, Route } from "react-router-dom";
import CarList from "./pages/CarList.jsx";
import CarForm from "./pages/CarForm.jsx";
export default function CarRoutes(){
    return(
        <Routes>
            <Route path="/" element={<CarList />} />
            <Route path="/add" element={<CarForm />} />
            <Route path="/edit/:id" element={<CarForm />} />
            {/* <Route path="/detail/:carId" element={<CarDetail />} /> */}
      </Routes>
    )
}