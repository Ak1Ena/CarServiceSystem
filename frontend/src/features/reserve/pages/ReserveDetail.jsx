import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { updateReserveStatus } from "../reserveSlice";
import axios from "axios";

function ReserveDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const reserve = useSelector((state) =>
    state.reserve.find((r) => r.id?.toString() === id)
  );

  if (!reserve)
    return (
      <div className="text-center mt-10 text-gray-600">ไม่พบข้อมูลการจอง</div>
    );

  async function confirmReserve() {
    try {
      const res = await axios.patch(`http://localhost:8086/reservations/${id}/confirm`);
      dispatch(updateReserveStatus({ reserveId: id, status: res.data.status }));
      navigate("/reservations");
    } catch (err) {
      console.error("Confirm failed:", err);
      alert("Confirm failed");
    }
  }

  return (
    <div className="flex min-h-screen bg-[#1c1c1c] text-white">
      {/* 🔹 Sidebar */}
      <aside className="w-60 bg-[#8B0000] flex flex-col p-6 text-sm">
        <h2 className="text-gray-200 mb-6 text-lg font-semibold">Menu</h2>
        <button
          onClick={() => navigate("/cars")}
          className="text-left mb-3 hover:text-white text-gray-300"
        >
          🚗 Add car
        </button>
        <button
          onClick={() => navigate("/cars/edit")}
          className="text-left mb-3 hover:text-white text-gray-300"
        >
          ✏️ Edit car
        </button>
        <button
          onClick={() => navigate("/reservations")}
          className="text-left mb-3 hover:text-white text-white font-semibold"
        >
          📅 Accept reservation
        </button>
        <button
          onClick={() => navigate("/payments")}
          className="text-left mb-3 hover:text-white text-gray-300"
        >
          💳 Confirm payment
        </button>
        <button
          onClick={() => navigate("/about")}
          className="text-left hover:text-white text-gray-300"
        >
          ℹ️ About
        </button>
      </aside>

      {/* 🔹 Main content */}
      <main className="flex-1 p-12 flex flex-col items-center">
        <div className="w-full max-w-4xl bg-[#2b2b2b] p-10 rounded-2xl shadow-lg">
          <h1 className="text-2xl font-semibold mb-8">Checkout</h1>

          <div className="grid grid-cols-2 gap-6 text-gray-300">
            <div>
              <p className="mb-2 text-sm text-gray-400">Primary driver</p>
              <input
                value={reserve.user?.name ?? "-"}
                readOnly
                className="w-full bg-[#3a3a3a] rounded p-2"
              />

              <p className="mt-4 mb-2 text-sm text-gray-400">Car Model</p>
              <input
                value={reserve.car?.model ?? "Unknown"}
                readOnly
                className="w-full bg-[#3a3a3a] rounded p-2"
              />

              <p className="mt-4 mb-2 text-sm text-gray-400">Date</p>
              <input
                value={reserve.date ?? "-"}
                readOnly
                className="w-full bg-[#3a3a3a] rounded p-2"
              />

              <p className="mt-4 mb-2 text-sm text-gray-400">Status</p>
              <input
                value={reserve.status}
                readOnly
                className="w-full bg-[#3a3a3a] rounded p-2"
              />
            </div>

            {/* ใบสรุปด้านขวา */}
            <div className="bg-[#d1d1d1] text-black rounded-lg p-6">
              <div className="flex justify-between mb-4">
                <div>
                  <p className="font-semibold">Reservation Summary</p>
                  <p className="text-sm">#{reserve.id}</p>
                </div>
                <div className="w-20 h-20 bg-gray-300" /> {/* placeholder รูปรถ */}
              </div>
              <p className="text-sm mb-2">
                Driver: {reserve.user?.name ?? "-"}
              </p>
              <p className="text-sm mb-2">
                Car: {reserve.car?.model ?? "-"}
              </p>
              <p className="text-sm mb-2">Date: {reserve.date ?? "-"}</p>
              <p className="text-sm mb-2">Status: {reserve.status}</p>
            </div>
          </div>

          <div className="flex justify-end mt-10 gap-4">
            <button
              onClick={() => navigate(-1)}
              className="px-5 py-2 border rounded bg-gray-700 hover:bg-gray-600"
            >
              Back
            </button>
            <button
              onClick={confirmReserve}
              disabled={reserve.status === "CONFIRMED"}
              className={`px-6 py-2 rounded text-white ${
                reserve.status === "CONFIRMED"
                  ? "bg-gray-500"
                  : "bg-red-700 hover:bg-red-800"
              }`}
            >
              {reserve.status === "CONFIRMED"
                ? "Already Confirmed"
                : "Confirm"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ReserveDetail;
