import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ReserveSummary() {
  const navigate = useNavigate();
  const { id } = useParams();

  const reserve = useSelector((state) =>
    state.reserve.find((r) => r.id?.toString() === id)
  );

  if (!reserve)
    return (
      <div className="text-center mt-10 text-gray-600">ไม่พบข้อมูลการจอง</div>
    );

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center py-10">
      <div className="w-full max-w-3xl bg-gray-800 p-8 rounded-2xl shadow-lg">
        <h1 className="text-2xl font-semibold mb-6 text-center">
          สรุปการจองรถสำเร็จ
        </h1>

        <div className="bg-gray-700 p-6 rounded-lg space-y-4">
          <p><strong>Reservation ID:</strong> #{reserve.id}</p>
          <p><strong>ผู้จอง:</strong> {reserve.user?.name ?? "-"}</p>
          <p><strong>รถ:</strong> {reserve.car?.model ?? "-"}</p>
          <p><strong>วันที่:</strong> {reserve.date ?? "-"}</p>
          <p><strong>สถานะ:</strong> {reserve.status}</p>
        </div>

        <div className="flex justify-center mt-8">
          <button
            onClick={() => navigate("/reservations")}
            className="px-6 py-2 bg-blue-600 rounded hover:bg-blue-700"
          >
            กลับไปหน้ารายการจอง
          </button>
        </div>
      </div>
    </div>
  );
}