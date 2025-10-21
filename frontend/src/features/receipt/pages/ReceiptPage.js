import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getReceipt } from "../services/receiptSlice";
import ReceiptCard from "../components/ReceiptCard";

const ReceiptPage = () => {
  const { id } = useParams(); 
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.receipt);

  useEffect(() => {
    dispatch(getReceipt(id));
  }, [dispatch, id]);

  if (loading) return <p>กำลังโหลดข้อมูลใบเสร็จ...</p>;
  if (error) return <p>เกิดข้อผิดพลาด: {error}</p>;
  if (!data) return <p>ไม่พบใบเสร็จ</p>;

  return (
    <div className="receipt-page">
      <h1>ใบเสร็จ</h1>
      <ReceiptCard receipt={data} />
    </div>
  );
};

export default ReceiptPage;
