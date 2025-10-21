import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createReservation } from "./services/.exampleAPI";

export const submitReservation = createAsyncThunk(
  "reserve/submitReservation",
  async (data) => {
    const response = await createReservation(data);
    return response.data;
  }
);

const reserveSlice = createSlice({
  name: "reserve",
  initialState: {
    reservation: null,
    status: "idle",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(submitReservation.pending, (state) => {
        state.status = "loading";
      })
      .addCase(submitReservation.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.reservation = action.payload;
      })
      .addCase(submitReservation.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export default reserveSlice.reducer; 