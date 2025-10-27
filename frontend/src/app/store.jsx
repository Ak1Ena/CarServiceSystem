import { configureStore } from "@reduxjs/toolkit";
import reserveReducer from "../features/reserve/reserveSlice.js";

const store = configureStore({
  reducer: {
    reserve: reserveReducer,
  },
});

export default store;
