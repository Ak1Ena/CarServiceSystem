import { createSlice } from "@reduxjs/toolkit";

const paymentSlice = createSlice({
  name: "payments",
  initialState: [],
  reducers: {
    setPayments: (state, action) => {
      return action.payload; // เก็บข้อมูลทั้งหมดลง state
    },
  },
});

export const { setPayments } = paymentSlice.actions;
export default paymentSlice.reducer;
