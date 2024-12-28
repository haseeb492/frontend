"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { SET_USER } from "@/redux/slices/userSlice";

const InitializeUser: React.FC = () => {
  const dispatch = useDispatch();

  const userData = localStorage.getItem("user");
  if (userData) {
    try {
      const parsedUser = JSON.parse(userData);
      dispatch(SET_USER(parsedUser));
    } catch (error) {
      console.error("Failed to parse user data from localStorage:", error);
    }
  }

  return null;
};

export default InitializeUser;
