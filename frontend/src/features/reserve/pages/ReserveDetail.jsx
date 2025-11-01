import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getReserveById,
  patchReserveStatus,
  deleteReserve,
} from "../services/Api";
import {
  updateReserveStatus,
  removeReserve,
} from "../reserveSlice";

function ReserveDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { selectedReserve: reserve, loading } = useSelector(
    (state) => state.reserves
  );

  useEffect(() => {
    dispatch(getReserveById(id));
  }, [dispatch, id]);

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (!reserve)
    return (
      <div className="text-center mt-10 text-gray-600">ไม่พบข้อมูลการจอง</div>
    );

  
  async function confirmReserve() {
    try {
      const res = await dispatch(
        patchReserveStatus({ reserveId: id, body: {id:id,userId:reserve.userId, status: "SUCCESS" } })
      ).unwrap();

      dispatch(updateReserveStatus({ reserveId: id, status: res.status }));

      navigate("/reservations");
    } catch (err) {
      console.error("Confirm failed:", err);
      alert("Confirm failed");
    }
  }

  async function handleDelete() {
    if (!window.confirm("คุณต้องการลบการจองนี้หรือไม่?")) return;
    try {
      await dispatch(deleteReserve(id)).unwrap();
      dispatch(removeReserve(id));
      navigate("/reservations");
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Delete failed");
    }
  }

  return (
    <div className="flex min-h-screen bg-[#1c1c1c] text-white">
      <main className="flex-1 p-12 flex flex-col items-center">
        <div className="w-full max-w-4xl bg-[#2b2b2b] p-10 rounded-2xl shadow-lg">
          <h1 className="text-2xl font-semibold mb-8">Reservation Detail</h1>

          <div className="grid grid-cols-2 gap-6 text-gray-300">
            <div>
              <p className="mb-2 text-sm text-gray-400">Primary driver</p>
              <input
                value={reserve.userId}
                readOnly
                className="w-full bg-[#3a3a3a] rounded p-2"
              />

              <p className="mt-4 mb-2 text-sm text-gray-400">Car Model</p>
              <input
                value={reserve.carId}
                readOnly
                className="w-full bg-[#3a3a3a] rounded p-2"
              />

              <p className="mt-4 mb-2 text-sm text-gray-400">Start Date</p>
              <input
                value={reserve.startDate ?? "-"}
                readOnly
                className="w-full bg-[#3a3a3a] rounded p-2"
              />

              <p className="mt-4 mb-2 text-sm text-gray-400">End Date</p>
              <input
                value={reserve.endDate ?? "-"}
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

            <div className="bg-[#d1d1d1] text-black rounded-lg p-6">
              <div className="flex justify-between mb-4">
                <div>
                  <p className="font-semibold">Reservation Summary</p>
                  <p className="text-sm">#{reserve.id}</p>
                </div>
                <div className="w-20 h-20 bg-gray-300" />
              </div>
              <p className="text-sm mb-2">Driver: {reserve.userId}</p>
              <p className="text-sm mb-2">Car: {reserve.carId}</p>
              <p className="text-sm mb-2">
                Date: {reserve.startDate ?? "-"} → {reserve.endDate ?? "-"}
              </p>
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

            {reserve.status === "CONFIRMED" ? (
              <button
                onClick={handleDelete}
                className="px-6 py-2 rounded text-white bg-red-700 hover:bg-red-800"
              >
                Delete
              </button>
            ) : (
              <button
                onClick={confirmReserve}
                className="px-6 py-2 rounded text-white bg-green-700 hover:bg-green-800"
              >
                Confirm
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default ReserveDetail;
