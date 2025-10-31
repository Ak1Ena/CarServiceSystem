import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

const BASE_URL = "http://localhost:8084/reserves";

// ✅ ดึงรายการจองทั้งหมด
export const getAllReserves = createAsyncThunk(
  "reserves/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(BASE_URL);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ✅ ดึงข้อมูลการจองตาม ID
export const getReserveById = createAsyncThunk(
  "reserves/getById",
  async (reserveId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/${reserveId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ✅ อัปเดตสถานะการจอง
export const patchReserveStatus = createAsyncThunk(
  "reserves/patchStatus",
  async ({ reserveId, body }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`${BASE_URL}/${reserveId}`, body);
      console.log(response)
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ✅ เพิ่มการจองใหม่
export const createReserve = createAsyncThunk(
  "reserves/create",
  async (body, { rejectWithValue }) => {
    try {
      const response = await axios.post(BASE_URL, body);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ✅ ลบการจอง
export const deleteReserve = createAsyncThunk(
  "reserves/delete",
  async (reserveId, { rejectWithValue }) => {
    try {
      await axios.delete(`${BASE_URL}/${reserveId}`);
      return reserveId;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
