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
    updateReserveStatus: (state, action) => {
      const { reserveId, status } = action.payload;
      const target = state.items.find((r) => r.id === Number(reserveId));
      if (target) target.status = status;

      if (state.selectedReserve?.id === Number(reserveId)) {
        state.selectedReserve.status = status;
      }
    },
    removeReserve: (state, action) => {
      const id = action.payload;
      state.items = state.items.filter((r) => r.id !== Number(id));
      if (state.selectedReserve?.id === Number(id)) {
        state.selectedReserve = null;
      }
    },
  },
  extraReducers: (builder) => {
    builder
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

      .addCase(getReserveById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getReserveById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedReserve = action.payload;
      })
      .addCase(getReserveById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(patchReserveStatus.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.items.findIndex((r) => r.id === updated.id);
        if (index !== -1) state.items[index] = updated;

        if (state.selectedReserve?.id === updated.id) {
          state.selectedReserve = updated;
        }
      })

      .addCase(createReserve.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })

      .addCase(deleteReserve.fulfilled, (state, action) => {
        const id = action.payload;
        state.items = state.items.filter((r) => r.id !== id);
        if (state.selectedReserve?.id === id) {
          state.selectedReserve = null;
        }
      });
  },
});

export const { updateReserveStatus, removeReserve } = reserveSlice.actions;
export default reserveSlice.reducer;
