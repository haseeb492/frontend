import { UserState } from "@/lib/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: UserState = {
  _id: "",
  email: "",
  name: "",
  role: {
    _id: "",
    name: "",
    permissions: [],
  },
  designation: {
    _id: "",
    name: "",
    permissions: [],
  },
  status: "",
  isFirstTimeLogin: false,
  createdAt: "",
  updatedAt: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    SET_USER: (_state, { payload }: PayloadAction<UserState>) => {
      return payload;
    },
    CLEAR_USER: () => initialState,
  },
});

export const { SET_USER, CLEAR_USER } = userSlice.actions;
export default userSlice.reducer;
