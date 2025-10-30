import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchReceiptsByUserId = createAsyncThunk(
  'receipts/fetchReceiptsByUserId',
  async (userId, { rejectWithValue }) => {
    const URL = `http://localhost:8083/receipts/user/${userId}`;

    try {
      const res = await fetch(URL);

      if (res.status === 200) {
        const text = await res.text(); 

        if (!text) throw new Error(`ไม่พบข้อมูลสำหรับผู้ใช้ ${userId}`);
        const data = JSON.parse(text);
        return data;
      }
      return [];
    } catch (error) {
      return rejectWithValue(error.message);
    }                                                                                                                 
  }
);
