import { createSlice } from "@reduxjs/toolkit";
import { getPaymentsByOwner, confirmPayment } from "./services/Api.js"

const paymentSlice = createSlice({
  name: "payments",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPaymentsByOwner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPaymentsByOwner.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(getPaymentsByOwner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch payments";
      })
      .addCase(confirmPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(confirmPayment.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;

        for (let carNode of state.list) {
          const reserveNode = carNode.reserves.find(
            (r) => r.payment?.paymentId === updated.paymentId
          );
          if (reserveNode) {
            reserveNode.payment = { ...reserveNode.payment, ...updated };
            break;
          }
        }
      })
      .addCase(confirmPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to confirm payment";
      })
  },
});

export const { setPayments, updatePaymentStatus } = paymentSlice.actions;
export default paymentSlice.reducer;
