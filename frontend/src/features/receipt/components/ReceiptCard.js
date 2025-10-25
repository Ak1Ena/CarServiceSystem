import React from "react";

const formatDate = (iso) => {
  if (!iso) return "-";
  const d = new Date(iso);
  return d.toLocaleString(); 
};

const ReceiptCard = ({ receipt, car, ownerName, reserve, payment }) => {
  return (
    <div className="receipt-card">
      <h3>ใบเสร็จ #{receipt?.receiptId ?? "-"}</h3>
      <p><strong>ชื่อผู้เช่า:</strong> {receipt?.userName ?? "-"}</p>
      <p><strong>เจ้าของรถ:</strong> {ownerName ?? "-"}</p>
      <p>
        <strong>รถ:</strong>{" "}
        {car ? `${car.brand || ""} ${car.model || ""} ${car.licensePlate ? `(${car.licensePlate})` : ""}` : "-"}
      </p>
      <p><strong>วันที่ออกใบเสร็จ:</strong> {formatDate(receipt?.issueAt)}</p>
      <p><strong>รายละเอียดการจอง:</strong> {reserve ? `จาก ${reserve.dateStart} ถึง ${reserve.dateEnd}` : "-"}</p>
      <p><strong>ยอดรวม:</strong> {receipt?.grandTotal != null ? `${receipt.grandTotal} บาท` : "-"}</p>
      <p><strong>สถานะการชำระ:</strong> {payment?.status ?? receipt?.status ?? "-"}</p>
    </div>
  );
};

export default ReceiptCard;
