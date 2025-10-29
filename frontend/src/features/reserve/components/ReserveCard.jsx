import { useNavigate } from "react-router-dom";

function ReserveCard({ id, title, desc, status }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/reserves/${id}`)}
      className="cursor-pointer border p-6 rounded-xl bg-white shadow hover:shadow-lg transition"
    >
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      <p className="text-sm text-gray-600 mt-2">{desc}</p>
      <p className="text-sm text-red-600 mt-2">Status: {status}</p>
    </div>
  );
}

export default ReserveCard;