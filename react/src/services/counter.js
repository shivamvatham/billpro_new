import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: 0,
};

const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    increament: (state, {payload}) => {
      state.value = payload;
    //   state.value + payload
    },
  },
});

export const { increament } = counterSlice.actions;
export default counterSlice.reducer;
