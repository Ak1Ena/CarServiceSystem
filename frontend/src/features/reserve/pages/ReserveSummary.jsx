// import { useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { getReserveById } from "../services/Api";

// export default function ReserveSummary() {
//   const navigate = useNavigate();
//   const { id } = useParams();
//   const dispatch = useDispatch();

//   const { selectedReserve: reserve, loading } = useSelector(
//     (state) => state.reserves
//   );

//   useEffect(() => {
//     dispatch(getReserveById(id));
//   }, [dispatch, id]);

//   if (loading) return <div className="text-center mt-10">Loading...</div>;
//   if (!reserve)
//     return (
//       <div className="text-center mt-10 text-gray-600">No reservation data found</div>
//     );

//   return (
//     <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center py-10">
//       <div className="w-full max-w-4xl bg-[#2b2b2b] p-10 rounded-2xl shadow-lg">
//         <h1 className="text-2xl font-semibold mb-6 text-center">
//           Reservation Summary
//         </h1>

//         <div className="bg-gray-700 p-6 rounded-lg space-y-4">
//           <p><strong>Reservation ID:</strong> #{reserve.id}</p>
//           <p><strong>Primary Driver:</strong> User ID {reserve.userId}</p>
//           <p><strong>Car Model:</strong> Car ID {reserve.carId}</p>
//           <p>
//             <strong>Date:</strong> {reserve.startDate ?? "-"} →{" "}
//             {reserve.endDate ?? "-"}
//           </p>
//           <p><strong>Status:</strong> {reserve.status}</p>
//         </div>

//         <div className="flex justify-center mt-8">
//           <button
//             onClick={() => navigate("/reservations")}
//             className="px-5 py-2 border rounded bg-gray-700 hover:bg-gray-600"
//           >
//             Back to Reservations
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }