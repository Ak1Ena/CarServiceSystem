import React from 'react';

const formatCurrency = (value) => {
    return (value || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const ReceiptFooter = ({ subtotal, vatAmount, grandTotal, status, VAT_RATE }) => {
    return (
        <>
            {/* .summary-section (flex, align-end) */}
            <div className="flex justify-between items-end">
                
                {/* .notes-box */}
                <div className="w-5/12">
                    <h2 className="text-sm font-bold uppercase mb-2">หมายเหตุ</h2>
                    <div className="p-2 border border-gray-400 bg-gray-50 text-sm h-24">
                        *โปรดตรวจสอบรายการและราคาก่อนชำระเงินทุกครั้ง*
                    </div>
                </div>
                
                {/* .total-box */}
                <div className="w-5/12 text-right">
                    <div className="border-t-2 border-gray-800 pt-2 space-y-1 text-sm">
                        <p className="flex justify-between"><span>รวมก่อน VAT:</span> <span>{formatCurrency(subtotal)}</span></p>
                        <p className="flex justify-between"><span>VAT ({VAT_RATE * 100}%):</span> <span>{formatCurrency(vatAmount)}</span></p>
                        <p className="flex justify-between pt-2 border-t border-gray-300 font-bold text-base text-gray-900">
                            <span>ยอดรวมทั้งสิ้น:</span> 
                            <span className="text-xl font-extrabold text-gray-900">{formatCurrency(grandTotal)}</span>
                        </p>
                    </div>
                    <p className="text-xs mt-3">สถานะ: <span className={`font-semibold ${status === 'PAID' ? 'text-green-600' : 'text-red-600'}`}>{status}</span></p>
                </div>
            </div>
            
            {/* ช่องสำหรับลายเซ็น/ผู้รับเงิน (ตามดีไซน์ Figma) */}
            <div className="mt-12 pt-4 flex justify-between text-sm border-t border-gray-300">
                <p className="w-5/12 text-center">_________________________</p>
                <p className="w-5/12 text-center">_________________________</p>
            </div>
            <div className="flex justify-between text-sm">
                <p className="w-5/12 text-center">(ผู้รับบริการ)</p>
                <p className="w-5/12 text-center">(ผู้รับเงิน)</p>
            </div>
        </>
    );
};

export default ReceiptFooter;