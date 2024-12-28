import { createSlice } from "@reduxjs/toolkit";

const modalSlice = createSlice({
  name: "modal",
  initialState: false,
  reducers: {
    SET_MODAL: (_state, action) => {
      return action.payload;
    },
  },
});

export const { SET_MODAL } = modalSlice.actions;
export default modalSlice.reducer;
