import { spec } from "node:test/reporters";

export type UserRole =
  | "ADMIN"
  | "EXECUTIVE"
  | "MANAGER"
  | "ENGINEER"
  | "HR"
  | "OPERATIONS"
  | "ACCOUNTS"
  | "FINANCE"
  | ""; 

export type UserDesignation =
  | "CEO"
  | "DIRECTOR"
  | "ADMIN"
  | "ADMIN EXECUTIVE"
  | "SENIOR PM"
  | "PM"
  | "ASSOCIATE PM"
  | "SOFTWARE INTERN"
  | "ASSOCIATE SOFTWARE ENGINEER"
  | "SOFTWARE ENGINEER"
  | "SENIOR SOFTWARE ENGINEER"
  | "PRINCIPAL SOFTWARE ENGINEER"
  | "TEAM LEAD"
  | "HR EXECUTIVE"
  | "HR MANAGER"
  | "RECRUITER"
  | "HR ASSOCIATE MANAGER"
  | "OP MANAGER"
  | "OP EXECUTIVE"
  | "ACCOUNT MANAGER"
  | "ACCOUNT EXECUTIVE"
  | "FINANCE MANAGER"
  | "FINANCE EXECUTIVE"
  | "";

  interface Permission {
    _id: string;
    type: string;
    resource: string;
  }

  interface UserRoleState {
    _id: string;
    name: UserRole;
    permissions: Permission[];
  }
  
  interface UserDesignationState {
    _id: string;
    name: UserDesignation;
    permissions: Permission[];
  }

  export interface UserState {
    _id: string;
    email: string;
    name: string;
    role: UserRoleState;
    designation: UserDesignationState;
    status: string;
    isFirstTimeLogin: boolean;
    createdAt: string;
    updatedAt: string;
  }

  export type ApiError = {
    response: {
      data: {
        error: string;
      };
    };
  };

  export interface RequestType {
    _id: string;
    type: string;
    leaveType?: string;
    halfDayType?: string;
    startDate: Date;
    endDate: Date;
    status: string;
    reason: string;
    approvedBy?: {
      name: string;
      _id: string;
    };
    generatedBy?: {
      name: string;
      _id: string;
    };
    remarks?: string;
  }
