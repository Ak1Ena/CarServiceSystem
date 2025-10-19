import { configureStore } from "@reduxjs/toolkit"
// import userReducer from './slices/userSlice';
// import carReducer from './slices/carSlice';
// import rentalReducer from './slices/paymentSlice';

export const store = configureStore({
    reducer:{
    // user: userReducer,
    // car: carReducer,
    // rental: rentalReducer,
    }
})