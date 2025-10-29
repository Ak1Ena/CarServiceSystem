import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import ReserveCard from "../components/ReserveCard";
import { setReserves } from "../reserveSlice";

function ReserveList() {
  const dispatch = useDispatch();
  const reserves = useSelector((state) => state.reserve);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (reserves?.length > 0) return;

    async function fetchReserves() {
      setIsLoading(true);
      try {
        // ✅ backend endpoint
        const res = await axios.get(`http://localhost:8084/reserves`);
        console.log(res.data);
        dispatch(setReserves(res.data));
      } catch (err) {
        console.error("Failed to fetch reserves:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchReserves();
  }, [dispatch, reserves]);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 py-16">
      <h1 className="text-2xl font-semibold mb-10 text-gray-800">
        Reservation List
      </h1>

      <div className="flex flex-col gap-6 w-full max-w-3xl">
        {isLoading ? (
          <p>Loading...</p>
        ) : reserves?.length > 0 ? (
          reserves.map((reserve) => (
            <ReserveCard
              key={reserve.id}
              id={reserve.id}
              title={`Reserve #${reserve.id}`} // เปลี่ยนจาก car.model
              desc={`Car ID: ${reserve.carId}, User ID: ${reserve.userId}`} // เปลี่ยน
              status={reserve.status ?? "-"}
            />
          ))
        ) : (
          <p className="text-gray-600">ไม่พบข้อมูลการจอง</p>
        )}
      </div>
    </div>
  );
}

export default ReserveList;
