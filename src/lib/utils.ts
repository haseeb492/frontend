import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ACCESS_CONTROL } from "@/constants/accessControlConfig";
import { UserState } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (date: Date | null | undefined): string => {
  if (!date) return ""; 
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); 
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const convertHoursToString = (totalHours: number) => {
  if (isNaN(totalHours)) {
      throw new Error("Input must be a valid number.");
  }

  const absoluteHours = Math.abs(totalHours);

  const hours = Math.floor(absoluteHours);

  const decimalPart = absoluteHours - hours;
  let minutes = Math.round(decimalPart * 60);

  let adjustedHours = hours;
  if (minutes === 60) {
      adjustedHours += 1;
      minutes = 0;
  }

  let result = `${adjustedHours} hour${adjustedHours !== 1 ? 's' : ''} and ${minutes} minute${minutes !== 1 ? 's' : ''}`;


  return result;
}

export const getLastMonthDateRange =  () => {
  const today = new Date();
  let year = today.getFullYear();
  let month = today.getMonth(); 

  if (month === 0) {
    month = 11; 
    year -= 1;
  } else {
    month -= 1;
  }

  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0); 

  return [startDate, endDate];
}


export const capitalizeWords = (str: string) => {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
};

export const getCheckedInTimeInMinutes = (checkInTime: string | undefined) => {
  if (checkInTime) {
    const checkInDate = new Date(checkInTime).getTime();
    const currentTime = Date.now();
    const timeDifferenceInMillis = currentTime - checkInDate;
    return Math.floor(timeDifferenceInMillis / 60000); 
  }
  return 0;
};

export const getTotalOfficeTime = ( checkInTime : string | undefined, checkOutTime : string | undefined ) => {
  if(checkInTime && checkOutTime){
    const checkInDate = new Date(checkInTime).getTime();
    const checkoutDate = new Date(checkOutTime).getTime();

    const timeDifferenceInMillis = checkoutDate - checkInDate;
    return Math.floor(timeDifferenceInMillis / 60000);
  }
  return 0;
}


export const formatDuration = (duration: number) => {
  const hours = Math.floor(duration / 60);
  const minutes = Math.round(duration % 60);
  return `${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m`;
};

export const getHoursAndMinutes = (duration : number) => {
  const hours = Math.floor(duration / 60);
  const minutes = Math.floor(duration % 60);

  return {hours , minutes}
}


export const  formatTime = (utcTimeString : string) => {
  const date = new Date(utcTimeString);

  let hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  const period = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12 || 12;

  const hoursString = String(hours).padStart(2, '0');
  const minutesString = String(minutes).padStart(2, '0');
  const secondsString = String(seconds).padStart(2, '0');

  return `${hoursString}:${minutesString}:${secondsString} ${period}`;
}

export const  getLatestStatus = (workStatusHistory : any) => {
  if (!workStatusHistory || workStatusHistory.length === 0) return null;

  const latestEntry = workStatusHistory.reduce((latest : any, current : any) => {
    return new Date(current.timestamp) > new Date(latest.timestamp) ? current : latest;
  });

  return latestEntry.status;
}




export function convertTo12HourFormat(time24: string): string {
  const [hourString, minuteString] = time24.split(':');
  let hour = parseInt(hourString, 10);
  const minute = parseInt(minuteString, 10);

  const ampm = hour >= 12 ? 'PM' : 'AM';

  hour = hour % 12;
  hour = hour === 0 ? 12 : hour; 

  const minuteFormatted = minute < 10 ? `0${minute}` : minute;

  return `${hour}:${minuteFormatted} ${ampm}`;
}


export function calculateBusinessDays(start: Date, end: Date | null): number {
  let count = 0;
  let curDate = new Date(start);

  if(end){
    let endDate = new Date(end);
  curDate.setHours(0, 0, 0, 0);
  endDate.setHours(0, 0, 0, 0);
  while (curDate <= endDate) {
    const dayOfWeek = curDate.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      count++;
    }
    curDate.setDate(curDate.getDate() + 1);
  }
  return count;

  }
return count
  
}

export const checkAccess = (
  user: UserState,
  resource: string,
  type: "route" | "component"
): boolean => {
  const typeKey = type === "route" ? "routes" : "components";

  const accessConfig = ACCESS_CONTROL[typeKey]?.[resource];

  if (!accessConfig) {
    return true;
  }
  if (accessConfig.roles && !accessConfig.roles.includes(user.role.name)) {
    return false;
  }
  if (
    accessConfig.designations &&
    !accessConfig.designations.includes(user.designation.name)
  ) {
    return false;
  }


  const userPermissions = [
    ...user.role.permissions,
    ...user.designation.permissions,
  ];

  const userPermissionsStrings = userPermissions.map(
    (perm) => `${perm.type}:${perm.resource}`
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const hasPermission = accessConfig.permissions.some((perm) => {
    if (userPermissionsStrings.includes(perm)) {
      return true;
    }
  
    if (userPermissionsStrings.includes("all:*")) {
      return true;
    }
  
    const [permType, permResource] = perm.split(":");
    if (permType !== "all" && userPermissionsStrings.includes(`all:${permResource}`)) {
      return true;
    }
  
    return false;
  });
  

  if (!hasPermission) {
    return false;
  }

  return true;
};
