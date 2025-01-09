"use client";

import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { PROTECTED_ROUTES } from "@/constants/config";
import { useSidebar } from "@/hooks/use-sidebar";
import SidebarContent from "../SidebarContent";

export function Sidebar() {
  const { isSidebarOpen, toggleSidebar } = useSidebar();
  const pathname = usePathname();
  const user = useSelector((state: RootState) => state.user);

  // If route is not protected, don’t show the sidebar
  const firstSegment = pathname.split("/")[1];
  const isProtectedRoute = PROTECTED_ROUTES.some(
    (route) => route === `/${firstSegment}`
  );
  if (!isProtectedRoute) return null;

  return (
    <>
      <div
        className={`hidden lg:flex flex-col transition-all duration-300 ease-in-out bg-white border border-gray-300
          shadow-md shadow-gray-400 
          ${isSidebarOpen ? "w-[320px] p-5" : "w-0"}
          overflow-y-auto
        `}
      >
        <SidebarContent />
      </div>

      {/* for small screen */}

      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      <div
        className={`
          fixed top-0 left-0 z-50 flex flex-col p-5 bg-white border-r border-gray-300 shadow-md shadow-gray-400
          transform transition-transform duration-300 ease-in-out lg:hidden h-screen overflow-y-auto

          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}

        `}
        style={{ width: 320 }}
      >
        <SidebarContent />
      </div>
    </>
  );
}
