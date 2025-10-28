import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchReceiptsByUserId } from '../services/Api.jsx';

const VAT_RATE = 0.07;

const ReceiptComponent = ({ receiptData }) => {
  const { receipt = {}, reserve = {}, user: customer = '', owner = '', car = {} } = receiptData;
  const items = receipt.items || [];

    const formatCurrency = (value) => {
        return (value || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    return (
        <div className="w-full max-w-4xl bg-white p-10 shadow-lg border border-gray-200 text-gray-800">

            <header className="flex justify-between items-start border-b-2 border-gray-800 pb-3 mb-6">
                <h1 className="text-3xl font-bold uppercase">ใบเสร็จรับเงิน</h1>
                <div className="text-right text-sm">
                    <p className="font-semibold text-lg">{owner || 'Normaaaaa'}</p>
                    <p className="text-xs text-gray-500">Service Shop</p>
                </div>
            </header>

            {/* 2. ส่วนข้อมูลลูกค้าและรถ */}
            <div className="flex justify-between mb-8 text-sm">

                <div className="w-5/12">
                    <h2 className="text-sm font-bold uppercase border-b border-gray-300 pb-1 mb-2">ผู้รับบริการ</h2>
                    <p><span className="font-medium">ชื่อ:</span> {customer}</p>
                    <p><span className="font-medium">รหัสผู้ใช้:</span> {receipt.userId}</p>
                    <p><span className="font-medium">วันที่ออก:</span> {new Date(receipt.issueAt).toLocaleDateString()}</p>
                </div>

                <div className="w-5/12 text-right">
                    <h2 className="text-sm font-bold uppercase border-b border-gray-300 pb-1 mb-2">รายละเอียดข้อมูลรถ</h2>
                    <p><span className="font-medium">ทะเบียน:</span> {car.licensePlate}</p>
                    <p><span className="font-medium">ยี่ห้อ/รุ่น:</span> {car.brand} {car.model}</p>
                    <p><span className="font-medium">รหัสจอง:</span> {reserve.id}</p>
                </div>
            </div>

            {/* 3. ส่วนรายการสินค้า/บริการ */}
            <table className="min-w-full divide-y divide-gray-200 mb-8">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider">รายการสินค้า</th>
                        <th className="px-4 py-2 text-right text-xs font-semibold uppercase tracking-wider w-1/12">จำนวน</th>
                        <th className="px-4 py-2 text-right text-xs font-semibold uppercase tracking-wider w-2/12">ราคา/หน่วย</th>
                        <th className="px-4 py-2 text-right text-xs font-semibold uppercase tracking-wider w-2/12">รวมเงิน</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {items.map((item, index) => (
                        <tr key={index}>
                            <td className="px-4 py-2 whitespace-nowrap text-sm">{item.description}</td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-right">{item.quantity}</td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-right">{formatCurrency(item.unitPrice)}</td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-right font-medium">{formatCurrency(item.unitPrice * item.quantity)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* 4. ส่วนสรุปยอดและหมายเหตุ */}
            <div className="flex justify-between items-end">

                <div className="w-5/12">
                    <h2 className="text-sm font-bold uppercase mb-2">หมายเหตุ</h2>
                    <div className="p-2 border border-gray-400 bg-gray-50 text-sm h-24">
                        โปรดตรวจสอบรายการก่อนชำระเงิน
                    </div>
                </div>

                <div className="w-5/12 text-right">
                    <div className="border-t-2 border-gray-800 pt-2 space-y-1 text-sm">
                        <p className="flex justify-between"><span>รวมก่อน VAT:</span> <span>{formatCurrency(receipt.subtotal)}</span></p>
                        <p className="flex justify-between"><span>VAT ({VAT_RATE * 100}%):</span> <span>{formatCurrency(receipt.vatAmount)}</span></p>
                        <p className="flex justify-between pt-2 border-t border-gray-300 font-bold text-base text-gray-900">
                            <span>ยอดรวมทั้งสิ้น:</span>
                            <span className="text-xl font-extrabold">{formatCurrency(receipt.grandTotal)}</span>
                        </p>
                    </div>
                    <p className="text-xs mt-3">สถานะ: <span className="font-semibold text-green-600">{receipt.status}</span></p>
                </div>
            </div>

            <div className="mt-12 pt-4 flex justify-between text-sm border-t border-gray-300">
                <p className="w-5/12 text-center">_________________________</p>
                <p className="w-5/12 text-center">_________________________</p>
            </div>
            <div className="flex justify-between text-sm">
                <p className="w-5/12 text-center">(ผู้รับบริการ)</p>
                <p className="w-5/12 text-center">(ผู้รับเงิน)</p>
            </div>
        </div>
    );
};

const ReceiptPage = () => {

    const dispatch = useDispatch();

    const {data, status, error} = useSelector((state) => state.receipt);

    const { userId } = useParams();
    const userIdToFetch = userId || 1;
    useEffect(() => {
        if (userIdToFetch) {
            dispatch(fetchReceiptsByUserId(userIdToFetch));
        }
    }, [dispatch, userIdToFetch]);


    const displayReceipt = useMemo(() => {
        return data?.length > 0 ? data[0] : null;
    }, [data]);

    if (status === 'loading') {
        return <div className="flex justify-center items-center h-screen bg-gray-100">กำลังโหลดข้อมูลใบเสร็จ...</div>;
    }

    if (status === 'failed') {
        return <div className="flex justify-center items-center h-screen bg-gray-100 text-red-600 font-semibold">
            เกิดข้อผิดพลาดในการโหลดข้อมูล: {error}
        </div>;
    }

    if (!displayReceipt) {
        return <div className="flex justify-center items-center h-screen bg-gray-100">ไม่พบข้อมูลใบเสร็จสำหรับผู้ใช้ ID: {userIdToFetch}</div>;
    }

    return (
        <div className="flex justify-center items-start min-h-screen bg-gray-100 py-10">
            <ReceiptComponent receiptData={displayReceipt} />
        </div>
    );
};

export default ReceiptPage;