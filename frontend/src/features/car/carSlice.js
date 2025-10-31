import { createSlice } from "@reduxjs/toolkit";
import { fetchCars, addCar, updateCar, deleteCar, fetchCarById, createReserve } from "./services/Api.js";

const carSlice = createSlice({
  name: "car",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCars.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCars.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchCars.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addCar.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(updateCar.fulfilled, (state, action) => {
        const index = state.list.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) state.list[index] = action.payload;
      })
      .addCase(deleteCar.fulfilled, (state, action) => {
        state.list = state.list.filter((c) => c.id !== action.payload);
      })
      .addCase(fetchCarById.fulfilled, (state,action) => {
        state.loading = false;
        state.list = action.payload
      })
      .addCase(fetchCarById.rejected, (state,action) => {
        state.loading = false;
        state.error = action.error.message;
      })
       .addCase(createReserve.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createReserve.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.reserve = action.payload;
      })
      .addCase(createReserve.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Reserve failed";
      });
  },
});

export default carSlice.reducer;
