import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import ReserveCard from "../components/ReserveCard";
import { getAllReserves } from "../services/Api.js";

function ReserveList() {
  const dispatch = useDispatch();

  // ✅ ดึง state จาก Redux store
  const { items: reserves, loading, error } = useSelector((state) => state.reserves);

  // ✅ เรียก API เมื่อเปิดหน้า
  useEffect(() => {
    dispatch(getAllReserves());
  }, [dispatch]);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 py-16">
      <h1 className="text-2xl font-semibold mb-10 text-gray-800">
        Reservation List
      </h1>

      <div className="flex flex-col gap-6 w-full max-w-3xl">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">เกิดข้อผิดพลาด: {error}</p>
        ) : reserves?.length > 0 ? (
          reserves.map((reserve) => (
            <ReserveCard
              key={reserve.id}
              id={reserve.id}
              title={`Reserve #${reserve.id}`}
              desc={`Car ID: ${reserve.carId}, User ID: ${reserve.userId}`}
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