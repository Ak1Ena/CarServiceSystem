import { createSlice } from '@reduxjs/toolkit';
import { fetchReceiptsByUserId } from './services/Api.jsx';


const receiptSlice = createSlice({
  name: 'receipts',
  initialState: {
    data: [], 
    status: 'idle', 
    error: null,
  },
  reducers: {}, 
  extraReducers: (builder) => {
    builder
    
      .addCase(fetchReceiptsByUserId.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
    
      .addCase(fetchReceiptsByUserId.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload; 
      })
     
      .addCase(fetchReceiptsByUserId.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch data'; 
      });
  },
});

export const selectReceipts = (state) => state.receipts?.data;
export const selectStatus = (state) => state.receipts?.status;
export const selectError = (state) => state.receipts?.error;

export default receiptSlice.reducer;