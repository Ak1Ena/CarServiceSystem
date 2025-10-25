import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchReceiptById } from "../services/receiptSlice.js";
import ReceiptHeader from "../components/ReceiptHeader.js";
import ReceiptCard from "../components/ReceiptCard.js";
import ReceiptFooter from "../components/ReceiptFooter.js";

const ReceiptPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { receiptDetail, loading, error } = useSelector((state) => state.receipt);

  useEffect(() => {
    dispatch(fetchReceiptById(id));
  }, [dispatch, id]);

  if (loading) return <p>กำลังโหลดข้อมูล...</p>;
  if (error) return <p>เกิดข้อผิดพลาด: {error}</p>;
  if (!receiptDetail) return <p>ไม่พบใบเสร็จ</p>;

  
  const { owner, user, car, payment, receipt, reserve } = receiptDetail;

  return (
    <div>
      <ReceiptHeader renterName={user} car={car} />
      <ReceiptCard
        receipt={receipt}
        car={car}
        ownerName={owner}
        reserve={reserve}
        payment={payment}
      />
      <ReceiptFooter amount={receipt?.grandTotal} status={payment?.status || receipt?.status} />
    </div>
  );
};

export default ReceiptPage;

