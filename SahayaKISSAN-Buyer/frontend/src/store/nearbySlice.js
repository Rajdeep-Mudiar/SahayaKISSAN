import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  enabled: false,
  location: {
    state: null,
    district: null,
    city: null
  }
};

const nearbySlice = createSlice({
  name: "nearby",
  initialState,
  reducers: {
    enableNearby(state, action) {
      state.enabled = true;
      state.location = action.payload;
    },
    disableNearby(state) {
      state.enabled = false;
      state.location = { state: null, district: null, city: null };
    }
  }
});

export const { enableNearby, disableNearby } = nearbySlice.actions;
export default nearbySlice.reducer;
