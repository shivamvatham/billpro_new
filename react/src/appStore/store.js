import { configureStore } from "@reduxjs/toolkit";
import counterSlice from "../services/counter";
import navBar from "../services/navbarTitle";
import getUsers from "../services/getUsers";

export const store = configureStore({
  reducer: {
    counter: counterSlice,
    navBar: navBar,
    users: getUsers
  },
});
