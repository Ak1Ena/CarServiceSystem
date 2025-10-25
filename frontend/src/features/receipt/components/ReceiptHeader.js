import React from "react";

const ReceiptHeader = ({ renterName, car }) => {
  return (
    <div className="receipt-header">
      <h1>ใบเสร็จการเช่ารถ</h1>
      <p><strong>ชื่อผู้เช่า:</strong> {renterName || "-"}</p>
      <p>
        <strong>รถที่เช่า:</strong>{" "}
        {car ? `${car.brand || ""} ${car.model || ""} - ${car.licensePlate || ""}` : "-"}
      </p>
    </div>
  );
};

export default ReceiptHeader;
