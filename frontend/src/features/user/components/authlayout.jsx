import React from 'react';

const AuthLayout = ({ title, children }) => {
  return (
    <div style={{ 
      maxWidth: '400px', 
      margin: '50px auto', 
      padding: '20px', 
      border: '1px solid #ccc', 
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
    }}>
      <h2>{title}</h2>
      {children}
    </div>
  );
};

export default AuthLayout;