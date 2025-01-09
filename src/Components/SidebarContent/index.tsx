import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import logo from "../../assets/zealtouch-logo.png";
import { Icon } from "@iconify/react";
import { useSidebar } from "@/hooks/use-sidebar";
import { SIDEBAR_ITEMS } from "@/constants/config";
import { checkAccess } from "@/lib/utils";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const SidebarContent = () => {
  const pathname = usePathname();
  const user = useSelector((state: RootState) => state.user);
  const { toggleSidebar } = useSidebar();

  return (
    <div>
      <div className="flex gap-x-4 mt-8">
        <div className="">
          <Image
            src={logo}
            alt="zealtouch-logo"
            priority
            className="w-auto h-auto"
          />
        </div>
        <button onClick={toggleSidebar}>
          <Icon
            icon="gravity-ui:circle-chevron-left"
            width={24}
            height={24}
            color="#175CFF"
          />
        </button>
      </div>

      <div className="mt-8 flex-grow">
        {SIDEBAR_ITEMS?.map((item) => {
          const hasAccess = checkAccess(user, item.path, "route");
          if (!hasAccess) return null;

          const isActiveItem = pathname === item.path;
          return (
            <div key={item.name} className="flex flex-col w-full">
              <div
                className={`
                    py-6 px-4 hover:bg-primary hover:bg-opacity-15
                    cursor-pointer
                    w-full
                    ${isActiveItem ? "bg-primary text-white" : ""}
                  `}
              >
                <Link href={item.path}>
                  <div className="flex items-center gap-3">
                    <Icon icon={item.icon} width={24} height={24} />
                    <span>{item.title}</span>
                  </div>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SidebarContent;
