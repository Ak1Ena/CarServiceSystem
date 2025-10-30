// src/components/ReceiptUserInfo.jsx

import React from 'react';

const ReceiptUserInfo = ({ customer, car, reserve, userId, issueAt }) => {
    return (
        // .info-section (flex, space-between)
        <div className="flex justify-between mb-8 text-sm">
            
            {/* .customer-info */}
            <div className="w-5/12">
                <h2 className="text-sm font-bold uppercase border-b border-gray-300 pb-1 mb-2">ผู้รับบริการ</h2>
                <p><span className="font-medium">ชื่อ:</span> **{customer}**</p>
                <p><span className="font-medium">รหัสผู้ใช้:</span> {userId}</p>
                <p><span className="font-medium">วันที่ออก:</span> {new Date(issueAt).toLocaleDateString()}</p>
            </div>
            
            {/* .reservation-details */}
            <div className="w-5/12 text-right">
                <h2 className="text-sm font-bold uppercase border-b border-gray-300 pb-1 mb-2">รายละเอียดข้อมูลรถ</h2>
                <p><span className="font-medium">ทะเบียน:</span> {car.licensePlate}</p>
                <p><span className="font-medium">ยี่ห้อ/รุ่น:</span> {car.brand} {car.model}</p>
                <p><span className="font-medium">รหัสจอง:</span> {reserve.id}</p>
            </div>
        </div>
    );
};

export default ReceiptUserInfo;