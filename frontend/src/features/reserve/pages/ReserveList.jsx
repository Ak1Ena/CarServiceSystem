import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import ReserveCard from "../components/ReserveCard";
import { getAllReserves } from "../services/Api.js";

function ReserveList() {
  const dispatch = useDispatch();
  const { items: reserves, loading, error } = useSelector(
    (state) => state.reserves
  );
  const ownerId = useSelector((state) => state.user.user?.id);

  useEffect(() => {
    dispatch(getAllReserves(ownerId));
  }, [dispatch]);

  // Flatten reserves
  const flattenReserves = Array.isArray(reserves)
    ? reserves.flatMap((item) =>
        item.reserves.map((r) => ({
          ...r.reserve, // ข้อมูล reserve
          user: r.user, // ชื่อผู้จอง
          car: item.car, // ข้อมูลรถ
        }))
      )
    : [];

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 py-16">
      <h1 className="text-2xl font-semibold mb-10 text-gray-800">
        Reservation List
      </h1>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">เกิดข้อผิดพลาด: {error}</p>
      ) : flattenReserves.length === 0 ? (
        <p className="text-gray-600">ไม่พบข้อมูลการจอง</p>
      ) : (
        <div className="flex flex-col gap-6 w-full max-w-4xl">
          {flattenReserves.map((r) => (
            <ReserveCard
              key={r.id}
              reserve={r}
              user={r.user}
              car={r.car}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ReserveList;
