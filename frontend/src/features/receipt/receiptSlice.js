import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchReceiptById, createReceipt } from "./index";

export const getReceipt = createAsyncThunk(
  "receipt/getReceipt",
  async (id) => await fetchReceiptById(id)
);

export const generateReceipt = createAsyncThunk(
  "receipt/createReceipt",
  async (data) => await createReceipt(data)
);

const receiptSlice = createSlice({
  name: "receipt",
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getReceipt.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getReceipt.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getReceipt.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(generateReceipt.fulfilled, (state, action) => {
        state.data = action.payload;
      });
  },
});

export default receiptSlice.reducer;
