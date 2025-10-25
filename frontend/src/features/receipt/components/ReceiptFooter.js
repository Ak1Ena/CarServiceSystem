import React from "react";

const ReceiptFooter = ({ amount, status }) => {
  return (
    <div className="receipt-footer">
      <p><strong>ยอดชำระทั้งหมด:</strong> {amount != null ? `${amount} บาท` : "-"}</p>
      <p><strong>สถานะ:</strong> {status ?? "-"}</p>
      <small>ขอบคุณที่ใช้บริการ!</small>
    </div>
  );
};

export default ReceiptFooter;
