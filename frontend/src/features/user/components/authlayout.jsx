import React from 'react';

const AuthLayout = ({ title, children }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="bg-white p-8 md:p-10 rounded-xl shadow-2xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">{title}</h2>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
