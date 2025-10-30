import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getPaymentsByOwner = createAsyncThunk(
  "payments/getByOwner",
  async (ownerId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`http://localhost:8086/payments/owner/${ownerId}`);
      return response.data?.cars ?? response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const confirmPayment = createAsyncThunk(
  "payments/paid",
  async ({paymentId, body}, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`http://localhost:8086/payments/${paymentId}/paid`, body);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);