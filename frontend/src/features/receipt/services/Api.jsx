import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchReceiptsByUserId = createAsyncThunk(
  'receipts/fetchReceiptsByUserId',
  async (userId, { rejectWithValue }) => {

    const URL = `http://localhost:8083/receipts/user/${userId}`; 
    
    try {
      const res = await fetch(URL);
      
      if (res.status === 200) {
        const data = await res.json();
        return data; 
      }
      return [];
       
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
