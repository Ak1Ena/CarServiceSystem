import { createSlice } from "@reduxjs/toolkit";

const paymentSlice = createSlice({
  name: "payments",
  initialState: [],
  reducers: {
    setPayments: (state, action) => {
      return action.payload; // เก็บข้อมูลทั้งหมดลง state
    },
    updatePaymentStatus: (state, action) => {
      const { paymentId, status, paymentMethod, paidAt } = action.payload;

      const carNode = state.cars.find((car) =>
        car.reserves.some((r) => r.payment?.paymentId === paymentId)
      );
      if (!carNode) return;

      const reserveNode = carNode.reserves.find((r) => r.payment?.paymentId === paymentId);
      if (!reserveNode) return;

      reserveNode.payment.status = status;
      reserveNode.payment.paymentMethod = paymentMethod;
      reserveNode.payment.paidAt = paidAt;
    },
  },
});

export const { setPayments, updatePaymentStatus } = paymentSlice.actions;
export default paymentSlice.reducer;
