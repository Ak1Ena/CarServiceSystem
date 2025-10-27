export default function Sidebar({ open, toggleSidebar }) {
  const role = localStorage.getItem("UserRole") || "RENTER";
  return (
    <div
      className={`fixed top-0 left-0 h-full w-56 bg-red-700 text-white p-4 transform transition-transform duration-300 z-50 ${
        open ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <button
        onClick={toggleSidebar}
        className="mb-6 text-white text-2xl hover:text-gray-200"
      >
        ←
      </button>
      {
        role === "OWNER" ? (
          <ul className="space-y-4 text-sm">
            <li className="flex items-center space-x-2 hover:bg-red-800 p-2 rounded-md transition">
              <span>📦</span>
              <span>Add car</span>
            </li>
            <li className="flex items-center space-x-2 hover:bg-red-800 p-2 rounded-md transition">
              <span>🛠️</span>
              <span>Edit car</span>
            </li>
          </ul>
        ) : role === "RENTER" ? (
          <ul className="space-y-4 text-sm">
            <li className="flex items-center space-x-2 hover:bg-red-800 p-2 rounded-md transition">
              <span>📦</span>
              <span>CAR LIST</span>
            </li>
            <li className="flex items-center space-x-2 hover:bg-red-800 p-2 rounded-md transition">
              <span>🛠️</span>
              <span>Edit car</span>
            </li>
          </ul>
        ) : null
      }
    </div>
  );
}