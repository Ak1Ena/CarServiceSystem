import React from 'react';

const ReceiptHeader = ({ owner, receiptId }) => {
    return (
        <header className="flex justify-between items-start border-b-2 border-gray-800 pb-3 mb-6">
            <h1 className="text-3xl font-bold uppercase">ใบเสร็จรับเงิน</h1>
            <div className="text-right text-sm">
                <p className="font-semibold text-lg">{owner || 'Normaaaaa'}</p> 
                <p className="text-xs text-gray-500">Order ID: {receiptId}</p>
            </div>
        </header>
    );
};

export default ReceiptHeader;