import { configureStore } from "@reduxjs/toolkit";
import nearbyReducer from "./nearbySlice";

export const store = configureStore({
  reducer: {
    nearby: nearbyReducer
  }
});
