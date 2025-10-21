import React from "react";

const ReceiptCard = ({ receipt }) => {
  return (
    <div className="receipt-card">
      <h3>{"ใบเสร็จ #"}{receipt.receiptId}</h3>
      <p><strong>{"ชื่อผู้เช่า:"}</strong> {receipt.renterName}</p>
      <p><strong>{"รถ:"}</strong> {receipt.car.brand} {receipt.car.model}</p>
      <p><strong>{"วันที่เช่า:"}</strong> {receipt.rentalDate}</p>
      <p><strong>{"วันที่คืน:"}</strong> {receipt.returnDate}</p>
      <p><strong>{"จำนวนเงิน:"}</strong> {receipt.amount} {"บาท"}</p>
    </div>
  );
};

export default ReceiptCard;
