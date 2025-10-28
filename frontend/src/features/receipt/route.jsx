import React from 'react';
import {
    Routes,
    Route
} from 'react-router-dom';

import ReceiptPage from './pages/ReceiptPage.jsx';

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/:userId" element={<ReceiptPage />} />
            <Route path="/" element={<h1>Welcome to Car Service System!</h1>} />
        </Routes>
    );
};