// src/components/ReceiptItemList.jsx

import React from 'react';

const formatCurrency = (value) => {
    return (value || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const ReceiptItemList = ({ items }) => {
    return (
        // .item-list (ตาราง)
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
    );
};

export default ReceiptItemList;