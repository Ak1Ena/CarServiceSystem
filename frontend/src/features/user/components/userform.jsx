import React from 'react';

const UserForm = ({ formData, handleChange, onSubmit, buttonText, isRegister = true }) => {
  return (
    <form onSubmit={onSubmit}>
      <div>
        <label>Username:</label>
        <input type="text" name="username" value={formData.username} onChange={handleChange} required />
      </div>
      <div>
        <label>Password:</label>
        <input type="password" name="password" value={formData.password} onChange={handleChange} required />
      </div>
      
      {/* ข้อมูลที่ใช้สำหรับการลงทะเบียนเท่านั้น */}
      {isRegister && (
        <>
          <div>
            <label>Email:</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div>
            <label>ชื่อ-นามสกุล (Name):</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div>
            <label>เบอร์โทรศัพท์ (Phone):</label>
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
          </div>
          <div>
            <label>ที่อยู่ (Address):</label>
            <textarea name="address" value={formData.address} onChange={handleChange} required />
          </div>
        </>
      )}
      <button type="submit">{buttonText}</button>
    </form>
  );
};

export default UserForm;