import { UserRole, UserDesignation } from "@/lib/types";

interface ScopeConfig {
  [key: string]: string | null;
}

interface RouteAccessConfig {
  roles: UserRole[];
  designations: UserDesignation[];
  permissions: string[];
  scope: ScopeConfig;
}

interface ComponentAccessConfig {
  roles: UserRole[];
  designations: UserDesignation[];
  permissions: string[];
  scope : ScopeConfig
}

interface AccessControlConfig {
  routes: {
    [path: string]: RouteAccessConfig;
  };
  components: {
    [component: string]: ComponentAccessConfig;
  };
}

export const ACCESS_CONTROL: AccessControlConfig = {
  routes: {
    "/users": {
      roles: ["ADMIN", "EXECUTIVE", "MANAGER", "HR", "OPERATIONS"],
      designations: [
        "CEO",
        "DIRECTOR",
        "ADMIN EXECUTIVE",
        "SENIOR PM",
        "PM",
        "ASSOCIATE PM",
        "HR ASSOCIATE MANAGER",
        "HR EXECUTIVE",
        "HR MANAGER",
        "OP EXECUTIVE",
        "OP MANAGER"
      ],
      permissions: ["read:user"],
      scope: {
        ADMIN: null,
        EXECUTIVE: null,
        MANAGER: "underManager",
      },
    },
    "users/add-user": {
      roles: ["ADMIN", "EXECUTIVE", "HR"],
      designations: ["ADMIN EXECUTIVE",
        "ADMIN",
        "CEO",
        "DIRECTOR",
        "HR ASSOCIATE MANAGER", 
        "HR EXECUTIVE", 
        "HR MANAGER"
      ],  
      permissions: ["create:user"],
      scope: {
        ADMIN: null,
        EXECUTIVE: null,
      },
    },
    "/my-projects" : {
      roles : ["ENGINEER"],
      designations : ["SOFTWARE INTERN", "ASSOCIATE SOFTWARE ENGINEER", "SOFTWARE ENGINEER", "SENIOR SOFTWARE ENGINEER", "PRINCIPAL SOFTWARE ENGINEER", "TEAM LEAD"],
      permissions : ["read:project"],
      scope : {
        ENGINEER : null
      }
    },
    "/daily-reports" : {
      roles : ["EXECUTIVE", "MANAGER"],
      designations : [  "ASSOCIATE PM", "SENIOR PM" , "PM" , "CEO", "DIRECTOR"],
      permissions : ["read:project"],
      scope : {
        EXECUTIVE : null,
        MANAGER : "underManager",
      }
    },
    "/projects" : {
      roles : ["MANAGER", "EXECUTIVE", "OPERATIONS"],
      designations : ["CEO", "DIRECTOR", "PM", "ASSOCIATE PM", "SENIOR PM", "OP EXECUTIVE", "OP MANAGER"],
      permissions : ["all:project"],
      scope : {
        EXECUTIVE : null,
        MANAGER : "underManager",
        OPERATIONS : null,
      }
    },
    "/projects/add-project" : {
      roles : ["EXECUTIVE", "MANAGER", "OPERATIONS"],
      designations : ["CEO", "DIRECTOR", "SENIOR PM", "PM", "ASSOCIATE PM", "OP EXECUTIVE", "OP MANAGER"],
      permissions : ["create:project"],
      scope : {
        EXECUTIVE : null,
        MANAGER : "underManager",
        OPERATIONS : null,
      }
    },
    "/requests" : {
      roles : ["EXECUTIVE", "MANAGER", "OPERATIONS", "HR"],
      designations : ["CEO", "DIRECTOR", "SENIOR PM", "PM", "ASSOCIATE PM", "OP EXECUTIVE", "OP MANAGER", "HR ASSOCIATE MANAGER", "HR MANAGER", "HR EXECUTIVE", "RECRUITER"],
      permissions : ["read:request"],
      scope : {
        EXECUTIVE : null,
        MANAGER : null,
        OPERATIONS : null,
        HR : null
      }
    }
  },
  components: {
    AddUserButton: {
      roles: ["ADMIN", "EXECUTIVE", "HR"],
      permissions: ["create:user"],
      designations: ["CEO", "DIRECTOR", "ADMIN EXECUTIVE", "HR ASSOCIATE MANAGER", "HR EXECUTIVE", "HR MANAGER"],
      scope : {
        ADMIN : null,
        EXECUTIVE : null,
        HR : null,
      }
    },
    UpdateUserInfo : {
      roles : ["ADMIN", "EXECUTIVE", "HR"],
      permissions : ["update:user"],
      designations : ["ADMIN", "ADMIN EXECUTIVE", "CEO", "DIRECTOR", "HR ASSOCIATE MANAGER", "HR EXECUTIVE", "HR MANAGER"],
      scope : {
        ADMIN : null,
        EXECUTIVE : null,
        HR : null
      }
    },
    UpdateProject : {
      roles : ["MANAGER", "EXECUTIVE", "OPERATIONS"],
      designations : ["PM", "SENIOR PM", "ASSOCIATE PM", "CEO", "DIRECTOR", "OP MANAGER", "OP EXECUTIVE"],
      permissions : ["update:project"],
      scope : {
        MANAGER : "underManager",
        OPERATIONS : null,
        EXECUTIVE : null
      }
    },
    GetActivityLogs : {
      roles : ["MANAGER", "EXECUTIVE", "HR"],
      designations : ["HR ASSOCIATE MANAGER", "HR MANAGER", "HR EXECUTIVE", "PM", "SENIOR PM", "ASSOCIATE PM", "CEO", "DIRECTOR"],
      permissions : ["read:activity"],
      scope : {
        HR : null,
        EXECUTIVE : null,
        MANAGER : "underManager"
      }
    },
    InternalProject : {
      roles : ["EXECUTIVE", "OPERATIONS"],
      designations : ["OP EXECUTIVE", "OP MANAGER", "CEO", "DIRECTOR"],
      permissions : ["all:project"],
      scope : {
        EXECUTIVE : null,
        OPERATIONS : null,
      }
    },
    Holiday : {
      roles : ["EXECUTIVE", "HR"],
      designations : ["CEO", "DIRECTOR", "HR EXECUTIVE", "HR ASSOCIATE MANAGER", "HR MANAGER"],
      permissions : ["all:project"],
      scope : {
        EXECUTIVE : null,
        HR : null,
      }
    },
    ReadRequest : {
      roles : ["EXECUTIVE", "HR"],
      designations : ["CEO", "DIRECTOR", "HR EXECUTIVE", "HR ASSOCIATE MANAGER", "HR MANAGER", "RECRUITER"],
      permissions : ["read:request"],
      scope : {
        EXECUTIVE : null,
        HR : null,
      }
    },
    ResolveRequest : {
      roles : ["EXECUTIVE", "MANAGER", "OPERATIONS"],
      designations : ["CEO", "DIRECTOR", "PM", "SENIOR PM", "ASSOCIATE PM", "OP EXECUTIVE", "OP MANAGER"],
      permissions : ["update:request"],
      scope : {
        EXECUTIVE : null,
        OPERATIONS : null,
        MANAGER : null,
      }
    },
  },

};
