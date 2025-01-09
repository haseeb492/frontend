"use client";
import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import Button from "../Common/Button";
import Image from "next/image";
import defaultUser from "../../assets/defaultImage.png";
import { Popover, PopoverContent, PopoverTrigger } from "../Common/Popover";
import { RadioGroup, RadioGroupItem } from "../Common/RadioGroup";
import { useDispatch, useSelector } from "react-redux";
import { SET_SIDEBAR } from "@/redux/slices/sidebarSlice";
import { RootState } from "@/redux/store";
import { usePathname, useRouter } from "next/navigation";
import { PROTECTED_ROUTES } from "@/constants/config";
import Cookies from "js-cookie";
import { LOGIN_ROUTE, SESSION_COOKIE_NAME } from "@/constants/environment";
import { CLEAR_USER } from "@/redux/slices/userSlice";
import useGetCheckInStatus from "@/hooks/use-get-check-in-status";
import useGetActivityLog from "@/hooks/use-get-activity-log";
import { capitalizeWords, getLatestStatus } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/AxiosInterceptor";
import { toast } from "../Common/Toast/use-toast";
import { ApiError } from "@/lib/types";

const Header = () => {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<string>("working");
  const [popoverOpen, setPopoverOpen] = useState(false);

  const navigate = useRouter();
  const dispatch = useDispatch();
  const isSidebarOpen = useSelector((state: RootState) => state.sidebar);
  const user = useSelector((state: RootState) => state.user);
  const router = useRouter();
  const pathname = usePathname();
  const firstSegment = pathname.split("/")[1];
  const isProtectedRoute = PROTECTED_ROUTES.some(
    (route) => route === `/${firstSegment}`
  );

  const { isCheckedIn } = useGetCheckInStatus(user._id);
  const { activityLog } = useGetActivityLog(
    user._id,
    user._id ? isCheckedIn : false
  );

  useEffect(() => {
    if (activityLog?.workStatusHistory) {
      const currentStatus = getLatestStatus(activityLog.workStatusHistory);
      if (currentStatus) {
        setStatus(currentStatus);
      }
    }
  }, [activityLog]);

  const mutation = useMutation({
    mutationFn: async (newStatus: string) => {
      const endpoint = `/activity/update-status?newStatus=${newStatus}`;
      return axiosInstance.patch(endpoint);
    },
    onSuccess: (res, newStatus) => {
      setStatus(newStatus);
      toast({ title: res?.data?.message });
      queryClient.invalidateQueries({ queryKey: ["getActivityLog"] });
      queryClient.invalidateQueries({ queryKey: ["getWorkStatusDuration"] });
      queryClient.invalidateQueries({ queryKey: ["getDailyReport"] });
      if (newStatus === "break") {
        router.push("/break");
      }
    },
    onError: (error: ApiError) => {
      toast({
        title: error?.response?.data?.error || "Something went wrong",
        variant: "destructive",
      });
    },
  });

  const handleStatusChange = (value: string) => {
    mutation.mutate(value);
  };

  if (!isProtectedRoute) return null;

  return (
    <div className="flex w-full items-center justify-between gap-sm border-y border-gray-300 shadow-md shadow-gray-400 px-sm py-md">
      <div className="flex items-center gap-sm w-full">
        <div
          className="w-lg h-lg rounded-2xs bg-primary p-2xs flex items-center justify-center"
          onClick={() => dispatch(SET_SIDEBAR(!isSidebarOpen))}
        >
          <Icon
            icon="charm:menu-hamburger"
            width={24}
            height={24}
            color="#f9fafb"
            className="cursor-pointer"
          />
        </div>
        {isCheckedIn && (
          <div
            onClick={() => {
              mutation.mutate(status === "break" ? "working" : "break");
            }}
          >
            <Button
              title={status === "break" ? "End Break" : "Start Break"}
              variant="outline"
              className="lg:block hidden"
            />
            <div className="w-lg h-lg lg:hidden rounded-2xs border border-primary p-2xs flex items-center justify-center">
              <Icon
                icon="ion:restaurant-outline"
                width={24}
                height={24}
                color="#175CFF"
              />
            </div>
          </div>
        )}

        {isCheckedIn && (
          <span className="flex items-center gap-2xs">
            <span className="text-md lg:block hidden font-bold text-zinc-700">
              Current Status:
            </span>
            <span className="text-md font-bold text-primary">
              {capitalizeWords(status)}
            </span>
          </span>
        )}
      </div>
      <div className="flex items-center gap-2xs w-full justify-end">
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
          <PopoverTrigger asChild>
            <div className="flex items-start gap-2xs cursor-pointer">
              <div className="rounded-lg flex items-center justify-center gap-2 border border-gray-400 w-12 h-12">
                <Image
                  src={defaultUser}
                  alt="default user"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div className="flex flex-col gap-1 items-start ">
                <div className="flex gap-2 items-center">
                  <span className="text-[20px] font-bold lg:block hidden text-zinc-700">
                    {user?.name || "N/A"}
                  </span>
                  <Icon
                    icon="iwwa:arrow-down"
                    width={16}
                    height={16}
                    className="cursor-pointer"
                  />
                </div>

                <span className="text-sm lg:block hidden text-slate-400">
                  {user?.designation?.name || ""}
                </span>
              </div>
            </div>
          </PopoverTrigger>
          <PopoverContent>
            <div className="flex flex-col w-full divide-y">
              <div className="p-2sm flex flex-col gap-sm">
                <div
                  className="flex items-center cursor-pointer"
                  onClick={() => {
                    navigate.replace("/settings");
                    setPopoverOpen(false);
                  }}
                >
                  <Icon icon="mdi:lock-outline" width={20} height={20} />
                  <span className="text-md">Account settings</span>
                </div>
                <div
                  className="flex items-center cursor-pointer"
                  onClick={() => {
                    navigate.replace(`/user/${user._id}`);
                    setPopoverOpen(false);
                  }}
                >
                  <Icon icon="mdi:person-outline" width={20} height={20} />
                  <span className="text-md">My Profile</span>
                </div>
              </div>
              {isCheckedIn && (
                <div className="p-2sm flex flex-col gap-sm">
                  <RadioGroup
                    value={status}
                    onValueChange={(val: string) => {
                      handleStatusChange(val);
                      setPopoverOpen(false);
                    }}
                  >
                    <RadioGroupItem
                      value="working"
                      id="working"
                      label="Working"
                    />
                    <RadioGroupItem value="idle" id="idle" label="Idle" />
                    <RadioGroupItem value="rnd" id="rnd" label="Doing R&D" />
                  </RadioGroup>
                </div>
              )}
              <div className="p-2sm">
                <div
                  className="flex items-center cursor-pointer"
                  onClick={() => {
                    Cookies.remove(SESSION_COOKIE_NAME);
                    localStorage.setItem("user", "");
                    dispatch(CLEAR_USER());
                    navigate.push(LOGIN_ROUTE);
                    setPopoverOpen(false);
                  }}
                >
                  <Icon icon="mdi:logout" width={20} height={20} />
                  <span className="text-md">Logout</span>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default Header;
