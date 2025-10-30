import { createSlice } from "@reduxjs/toolkit";
import {
  getAllReserves,
  getReserveById,
  patchReserveStatus,
  createReserve,
  deleteReserve,
} from "./services/Api.js";

const reserveSlice = createSlice({
  name: "reserves",
  initialState: {
    items: [],
    selectedReserve: null,
    loading: false,
    error: null,
  },
  reducers: {
    setReserves: (state, action) => {
      state.items = action.payload;
    },
    updateReserveStatus: (state, action) => {
      const { reserveId, status } = action.payload;
      const target = state.items.find((r) => r.id === reserveId);
      if (target) target.status = status;
    },
  },
  extraReducers: (builder) => {
    builder
      // ✅ ดึงข้อมูลทั้งหมด
      .addCase(getAllReserves.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllReserves.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(getAllReserves.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ ดึงข้อมูลตาม ID
      .addCase(getReserveById.fulfilled, (state, action) => {
        state.selectedReserve = action.payload;
      })

      // ✅ อัปเดตสถานะ
      .addCase(patchReserveStatus.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.items.findIndex((r) => r.id === updated.id);
        if (index !== -1) state.items[index] = updated;
      })

      // ✅ เพิ่มการจองใหม่
      .addCase(createReserve.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })

      // ✅ ลบการจอง
      .addCase(deleteReserve.fulfilled, (state, action) => {
        state.items = state.items.filter((r) => r.id !== action.payload);
      });
  },
});

export const { setReserves, updateReserveStatus } = reserveSlice.actions;
export default reserveSlice.reducer;
