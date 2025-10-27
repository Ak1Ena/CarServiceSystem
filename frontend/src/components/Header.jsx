import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
function Overlay({ open, toggleSidebar }) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 bg-black/30 z-40"
      onClick={toggleSidebar}
    />
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const toggleSidebar = () => setOpen(!open);

  return (
    <>
      <Navbar toggleSidebar={toggleSidebar} />
      <Sidebar open={open} toggleSidebar={toggleSidebar} />
      <Overlay open={open} toggleSidebar={toggleSidebar} />
    </>
  );
}
