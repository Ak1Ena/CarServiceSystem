What is diffrenet between reducer and extraReducer

reducer is for sync function 

extrareducer is for async function


# EXAMPLE
---
```
import { createSlice } from "@reduxjs/toolkit";

const mySlice = createSlice({
  name: "featureName",        // ชื่อ slice
  initialState: {             // state เริ่มต้น
    value: 0,
    status: "idle"
  },
  reducers: {                 // synchronous actions
    increment: (state) => {   // action: increment
      state.value += 1;
    },
    decrement: (state) => {   // action: decrement
      state.value -= 1;
    },
    reset: (state) => {       // action: reset
      state.value = 0;
    },
  },
  extraReducers: (builder) => {  // async actions
    builder
      .addCase(someAsyncAction.pending, (state) => {
        state.status = "loading";
      })
      .addCase(someAsyncAction.fulfilled, (state, action) => {
        state.value = action.payload;
        state.status = "success";
      })
      .addCase(someAsyncAction.rejected, (state) => {
        state.status = "error";
      });
  },
});

// action creators จะถูกสร้างให้อัตโนมัติ
export const { increment, decrement, reset } = mySlice.actions;

// reducer ของ slice
export default mySlice.reducer;

```