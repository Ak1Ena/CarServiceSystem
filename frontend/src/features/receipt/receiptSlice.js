import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getReceiptById, getAllReceipts } from "./index.js";

export const fetchReceiptById = createAsyncThunk(
  "receipt/fetchReceiptById",
  async (id) => {
    const data = await getReceiptById(id);
    return data;
  }
);

export const fetchAllReceipts = createAsyncThunk(
  "receipt/fetchAllReceipts",
  async () => {
    const data = await getAllReceipts();
    return data;
  }
);

const receiptSlice = createSlice({
  name: "receipt",
  initialState: {
    receiptDetail: null, 
    receipts: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReceiptById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReceiptById.fulfilled, (state, action) => {
        state.loading = false;
        state.receiptDetail = action.payload;
      })
      .addCase(fetchReceiptById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchAllReceipts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllReceipts.fulfilled, (state, action) => {
        state.loading = false;
        state.receipts = action.payload;
      })
      .addCase(fetchAllReceipts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default receiptSlice.reducer;
