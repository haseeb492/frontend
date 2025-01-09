"use client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SET_SIDEBAR } from "@/redux/slices/sidebarSlice";
import { RootState } from "@/redux/store";

export const useSidebar = () => {
  const dispatch = useDispatch();
  const isSidebarOpen = useSelector((state: RootState) => state.sidebar);

  const toggleSidebar = () => {
    dispatch(SET_SIDEBAR(!isSidebarOpen));
  };

  useEffect(() => {
    const handleResize = () => {
      const isLargeScreen = window.innerWidth >= 1024;
      dispatch(SET_SIDEBAR(isLargeScreen));
    };
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [dispatch]);

  return { isSidebarOpen, toggleSidebar };
};
