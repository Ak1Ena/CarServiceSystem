import React from 'react';
import { Route, Routes } from 'react-router-dom';
import LoginPage from './pages/login';
import RegisterPage from './pages/register';

export default function UserRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Routes>
  );
}
