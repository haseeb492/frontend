import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import sidebarSliceReducer from "./slices/sidebarSlice";
import modalSliceReducer from "./slices/modalSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    sidebar: sidebarSliceReducer,
    modal : modalSliceReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;