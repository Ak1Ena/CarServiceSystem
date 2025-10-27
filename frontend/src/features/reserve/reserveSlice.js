import { createSlice } from "@reduxjs/toolkit";

const reserveSlice = createSlice({
  name: "reserves",
  initialState: [],
  reducers: {
    setReserves: (state, action) => {
      return action.payload; // เก็บข้อมูลการจองทั้งหมด
    },
    updateReserveStatus: (state, action) => {
      const { reserveId, status } = action.payload;
      const target = state.find((r) => r.id === reserveId);
      if (target) target.status = status;
    },
  },
});

export const { setReserves, updateReserveStatus } = reserveSlice.actions;
export default reserveSlice.reducer;