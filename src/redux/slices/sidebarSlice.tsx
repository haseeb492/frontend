import { createSlice } from "@reduxjs/toolkit";

const sidebarSlice = createSlice({
  name: "sidebar",
  initialState: false,
  reducers: {
    SET_SIDEBAR: (_state, action) => {
      return action.payload;
    },
  },
});

export const { SET_SIDEBAR } = sidebarSlice.actions;
export default sidebarSlice.reducer;
