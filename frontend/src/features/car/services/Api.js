import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE = "http://localhost:8082";

export const fetchCars = createAsyncThunk("car/fetchAll", async () => {
  const res = await axios.get(`${API_BASE}/cars`);
  return res.data;
});

export const addCar = createAsyncThunk("car/add", async (carFormData) => {
  const res = await axios.post(`${API_BASE}/cars`, carFormData);
  return res.data;
});


export const updateCar = createAsyncThunk("car/update", async ({ id, formData }) => {
  const res = await axios.patch(`${API_BASE}/cars/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
});

export const deleteCar = createAsyncThunk("car/delete", async (id) => {
  await axios.delete(`${API_BASE}/cars/${id}`);
  return id;
});
