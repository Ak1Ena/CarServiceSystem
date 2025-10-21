import React, { useState } from "react";

const ReservationForm = ({ onSubmit }) => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    pickupDate: "",
    returnDate: "",
    location: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <h2 className="text-xl font-semibold">Primary Driver</h2>
      <input name="name" placeholder="Full Name" onChange={handleChange} required />
      <input name="phone" placeholder="Phone" onChange={handleChange} required />
      <input name="email" placeholder="Email" onChange={handleChange} required />

      <h2 className="text-xl font-semibold mt-4">Reservation Details</h2>
      <input type="date" name="pickupDate" onChange={handleChange} required />
      <input type="date" name="returnDate" onChange={handleChange} required />
      <input name="location" placeholder="Pickup / Return Location" onChange={handleChange} required />

      <button type="submit" className="mt-4 bg-red-600 text-white p-2 rounded">
        Confirm Reservation
      </button>
    </form>
  );
};

export default ReservationForm;
