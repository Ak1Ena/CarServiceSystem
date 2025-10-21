import React from "react";

const ReservationSummary = ({ data }) => {
  if (!data) return <p>No reservation yet.</p>;

  return (
    <div className="p-4 bg-gray-200 rounded-lg">
      <h3 className="font-bold mb-2">Reservation Summary</h3>
      <p><strong>Name:</strong> {data.name}</p>
      <p><strong>Pickup:</strong> {data.pickupDate}</p>
      <p><strong>Return:</strong> {data.returnDate}</p>
      <p><strong>Location:</strong> {data.location}</p>
    </div>
  );
};

export default ReservationSummary;
