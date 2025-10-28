import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchReceiptsByUserId = createAsyncThunk(
  'receipts/fetchReceiptsByUserId',
  async (userId, { rejectWithValue }) => {

    const URL = `http://localhost:8083/receipts/user/${userId}`; 
    
    try {
      const res = await fetch(URL);
      
      if (!res.ok) {
      
        throw new Error(`Failed to fetch receipts. Status: ${res.status}`);
      }
      
      const data = await res.json();
      return data; 
      
    } catch (error) {

      return rejectWithValue(error.message);
    }
  }
);
