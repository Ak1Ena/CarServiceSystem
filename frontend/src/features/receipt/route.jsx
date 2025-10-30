import React from 'react';
import ReceiptList from './pages/ReceiptList.jsx';
import ReceiptPage from './pages/ReceiptPage.jsx'

import {
    Routes,
    Route
} from 'react-router-dom';


export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/:receiptId" element={<ReceiptPage />} />
            <Route path="/" element={<ReceiptList />} />
        </Routes>
    );

};      