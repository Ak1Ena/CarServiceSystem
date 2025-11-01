import { useNavigate } from "react-router-dom";

function ReserveCard({ reserve, user, car }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/reservations/${reserve.id}`)}
      className="cursor-pointer border p-6 rounded-xl bg-white shadow hover:shadow-lg transition"
    >
      <h3 className="text-lg font-semibold text-gray-800">
        Reservation #{reserve.id}
      </h3>

      <p className="text-sm text-gray-600 mt-1">
        Driver: {user ?? reserve.userId}
      </p>

      <p className="text-sm text-gray-600 mt-1">
        Car: {car?.model +" | "+ car?.plateNumber ?? reserve.carId}
      </p>

      <p className="text-sm text-gray-600 mt-1">
        Date: {reserve.startDate ?? "-"} → {reserve.endDate ?? "-"}
      </p>

      <p className={`text-sm mt-2 font-semibold`}>
        {reserve.status}
      </p>
    </div>
  );
}

export default ReserveCard;
