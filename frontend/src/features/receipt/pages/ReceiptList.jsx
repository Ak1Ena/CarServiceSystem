import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const ReceiptList = () => {
  const { userId } = useParams(); 
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    
    const fetchReceipts = async () => {
      try {
        const res = await fetch(`/api/receipts/user/${userId}`);
        if (!res.ok) throw new Error("Failed to fetch receipts");
        const data = await res.json();
        setReceipts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReceipts();
  }, [userId]);

  if (loading) return <p>Loading receipts...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">
        ใบเสร็จทั้งหมดของผู้ใช้ {userId}
      </h2>

      {receipts.length === 0 ? (
        <p>ยังไม่มีใบเสร็จ</p>
      ) : (
        <ul className="space-y-3">
          {receipts.map((receipt) => (
            <li
              key={receipt.id}
              className="border p-4 rounded-lg hover:shadow-md transition"
            >
              <p>
                <strong>รหัสใบเสร็จ:</strong> {receipt.id}
              </p>
              <p>
                <strong>วันที่:</strong> {receipt.date}
              </p>
              <p>
                <strong>ยอดรวม:</strong> {receipt.total} บาท
              </p>
              <Link
                to={`/${userId}/receipt/${receipt.id}`}
                className="text-blue-600 underline"
              >
                ดูรายละเอียด
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ReceiptList;
