import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: 0,
};

const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    increament: (state) => {
      state.value += 1
    },
  },
});

export const { increament } = counterSlice.actions;
export const selectIncreament = state => state.counter.value;
export default counterSlice.reducer;
