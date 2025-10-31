import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../features/user/userSlice"
export default function Sidebar({ open, toggleSidebar }) {
  const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());       
        navigate("/"); 
    };
  const role = localStorage.getItem("userRole");
  const ownerBar = [
    { name: "Add Car", icon: "", link: "/cars/add-car" },
    { name: "Edit Car", icon: "", link: "/cars/edit-car" },
    { name: "Accept Reservation", icon: "", link: "/reservations" },
    { name: "Confirm Payment", icon: "", link: "/payments" },
    { name: "About Us", icon: "", link: "/about" },
  ]
  const renterBar = [
    { name: "Car", icon: "", link: "/cars" },
    { name: "Receipts", icon: "", link: "/receipts" },
  ]

  return (
    <div
      className={`fixed top-0 left-0 h-full w-56 bg-red-700 text-white p-4 transform transition-transform duration-300 z-50 ${open ? "translate-x-0" : "-translate-x-full"
        }`}
    >
      <button
        onClick={toggleSidebar}
        className="mb-6 text-white text-2xl hover:text-gray-200"
      >
        ←
      </button>
      <ul className="space-y-4 text-sm">

        {
          role === "OWNER" ? (

            ownerBar.map((item) => (
              <Link to={item.link} className="block" key={item.name}>
                <li className="flex items-center space-x-2 hover:bg-red-800 p-2 rounded-md transition cursor-pointer">
                  <span>{item.icon}</span>
                  <span>{item.name}</span>
                </li>
              </Link>
            ))


          ) : role === "RENTER" ? (

            renterBar.map((item) => (
              <Link to={item.link} className="block" key={item.name}>
                <li className="flex items-center space-x-2 hover:bg-red-800 p-2 rounded-md transition cursor-pointer">
                  <span>{item.icon}</span>
                  <span>{item.name}</span>
                </li>
              </Link>
            ))

          ) : null
          
        }
        <li
          onClick={handleLogout}
          className="flex items-center space-x-2 p-2 rounded-md cursor-pointer
                    bg-white text-red-600 hover:bg-red-50 hover:text-red-700 
                    transition-colors duration-200"
        >
          <span>LOG OUT</span>
        </li>

      </ul>

    </div>
  );
}