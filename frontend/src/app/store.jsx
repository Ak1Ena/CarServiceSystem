import { configureStore } from "@reduxjs/toolkit"
// import carReducer from "../features/car/carSlice.js"
// import userReducer from "../features/user/userSlice.js"
import paymentReducer from "../features/payment/paymentSlice.js"
// import receiptReducer from "../features/receipt/receiptSlice.js"
// import paymentReducer from "../features/payment/paymentSlice.js"
import receiptReducer from "../features/receipt/receiptSlice.js"
// import reserveReducer from "../features/reserve/reserveSlice.js"

export default configureStore({
    reducer:{
        // car:carReducer,
        // user:userReducer,
        payment: paymentReducer,
        receipt: receiptReducer,
        // payment: paymentReducer,
        receipt: receiptReducer,
        // reserve: reserveReducer,
    }
})
