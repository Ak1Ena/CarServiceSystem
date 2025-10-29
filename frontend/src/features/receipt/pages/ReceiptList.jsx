import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchReceiptsByUserId } from "../services/Api.jsx";

const ReceiptList = () => {
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    const {data, status, error } = useSelector((state) => state.receipt);
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId") || 2;
    setUserId(storedUserId);

    const fetchReceipts = async () => {
      try {
        // const res = await fetch(`http://localhost:8083/receipts/user/${storedUserId}`);
        // if (!res.ok) throw new Error("Failed to fetch receipts");
        // const data = await res.json();
        dispatch(fetchReceiptsByUserId(storedUserId));
      } catch (err) {
        console.error("Error fetching receipts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReceipts();
  }, []);

  if (status) return <p className="text-white text-center text-xl mt-10">กำลังโหลดใบเสร็จ...</p>;
  if (!userId) return <p className="text-white text-center text-xl mt-10">ไม่พบรหัสผู้ใช้</p>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6">
      <h2 className="text-3xl font-semibold mb-6 text-center">
        ใบเสร็จทั้งหมดของผู้ใช้ {userId}
      </h2>

      {data.length === 0 ? (
        <p className="text-lg text-center">ยังไม่มีใบเสร็จ</p>
      ) : (
        <ul className="w-full max-w-md space-y-4">
          {data.map((receipt) => (
            <li
              key={receipt.receipt.receiptId}
              className="border border-gray-700 bg-gray-800 p-4 rounded-xl shadow-md hover:shadow-lg transition"
            >
              <p><strong>รหัสใบเสร็จ:</strong> {receipt.receipt.receiptId}</p>
              <p><strong>วันที่:</strong> {receipt.receipt.issueAt}</p>
              <p><strong>ยอดรวม:</strong> {receipt.receipt.grandTotal} บาท</p>
              <Link
                to={`/receipts/${receipt.receipt.receiptId}`}
                className="text-blue-400 underline hover:text-blue-300"
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
