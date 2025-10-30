import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

// 🟦 ตั้งค่า base URL สำหรับ service reservation
const BASE_URL = "http://localhost:8084/reserves";

// ✅ ดึงรายการจองทั้งหมด (ใช้ใน ReserveList)
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

// ✅ ดึงข้อมูลการจองตาม ID (ใช้ใน ReserveDetail)
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

// ✅ อัปเดตสถานะการจอง เช่น "CONFIRMED", "CANCELLED"
export const patchReserveStatus = createAsyncThunk(
  "reserves/patchStatus",
  async ({ reserveId, body }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`${BASE_URL}/${reserveId}`, body);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ✅ สร้างการจองใหม่ (ใช้ตอนผู้ใช้จองรถ)
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

// ✅ ลบการจอง (เฉพาะ owner หรือ admin)
export const deleteReserve = createAsyncThunk(
  "reserves/delete",
  async (reserveId, { rejectWithValue }) => {
    try {
      await axios.delete(`${BASE_URL}/${reserveId}`);
      return reserveId; // return id สำหรับใช้ลบใน state
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
