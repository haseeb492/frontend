"use client";

import Image from "next/image";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "../Common/Sheet";
import logo from "../../assets/zealtouch-logo.png";
import { DialogClose, DialogTitle } from "@radix-ui/react-dialog";
import { PROTECTED_ROUTES, SIDEBAR_ITEMS } from "@/constants/config";
import { Icon } from "@iconify/react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useSidebar } from "@/hooks/use-sidebar";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { checkAccess } from "@/lib/utils";

export function Sidebar() {
  const { isSidebarOpen, setIsSidebarOpen } = useSidebar();
  const pathname = usePathname();
  const user = useSelector((state: RootState) => state.user);

  const firstSegment = pathname.split("/")[1];
  const isProtectedRoute = PROTECTED_ROUTES.some(
    (route) => route === `/${firstSegment}`
  );

  if (!isProtectedRoute) return null;

  return (
    <div className={`${isSidebarOpen && "lg:w-[320px]"}`}>
      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetTrigger asChild />
        <SheetContent side="left" className="overflow-auto">
          <SheetHeader>
            <DialogTitle>
              <Image
                src={logo}
                alt="zealtouch-logo"
                priority
                className="w-auto h-auto"
              />
            </DialogTitle>
            <DialogClose>
              <Icon
                icon="gravity-ui:circle-chevron-left"
                width={24}
                height={24}
                color="#175CFF"
              />
            </DialogClose>
          </SheetHeader>
          <div className="mt-lg">
            {SIDEBAR_ITEMS?.map((item) => {
              // Determine if the user has access to this route
              const hasAccess = checkAccess(user, item.path, "route");

              if (!hasAccess) {
                return null; // Do not render the item if user lacks access
              }

              const activeItem = pathname === item.path;
              return (
                <div
                  key={item?.name}
                  className="flex flex-col items-start w-full gap-sm"
                >
                  <div
                    className={`p-md hover:bg-primary hover:bg-opacity-15 w-full ${
                      activeItem ? "bg-primary text-white" : ""
                    }`}
                  >
                    <Link href={item.path}>
                      <div className="flex items-center gap-sm">
                        <Icon icon={item?.icon} width={24} height={24} />
                        <span>{item?.title}</span>
                      </div>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
