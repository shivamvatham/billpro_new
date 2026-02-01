import { createSlice } from "@reduxjs/toolkit";

const initial = {
  titleName: "shivam",
};

const navStore = createSlice({
  name: "navstore",
  initialState: initial,
  reducers: {
    setName1: (state, {payload}) => {
      state.titleName = payload;
    },
  },
});

export const { setName1 } = navStore.actions;
export default navStore.reducer;
