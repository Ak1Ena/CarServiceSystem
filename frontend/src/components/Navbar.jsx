import { useSelector } from "react-redux";

export default function Navbar({ toggleSidebar }) {
    const userRole = localStorage.getItem("userRole") || "Unknown";
    const user = useSelector((state) => state.user);
    const username = user?.name || "UNKNOWN";
    return (
    <nav className="flex items-center justify-between px-4 py-3 shadow-sm bg-white">
      <button onClick={toggleSidebar} className="text-gray-700 text-2xl">
        ☰
      </button>

      <div className="text-right">
        <h1 className="font-bold text-sm text-gray-900">{username}</h1>
        <p className="text-xs text-gray-500">{userRole}</p>
      </div>
    </nav>
  );
}
