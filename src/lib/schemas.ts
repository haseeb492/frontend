import { z } from "zod";

export const personalInfoSchema = z.object({
    nameOnCNIC: z.string().optional(),
    personalEmail: z.string().email("Incorrect email").optional(),
    CNICNumber: z
      .string()
      .optional()
      .refine((val) => !val || /^\d{13}$/.test(val), {
        message: "CNIC must be a 13-digit number",
      }),
    maritalStatus: z.string().optional(),
    dateOfBirth: z
    .preprocess((arg) => (typeof arg === 'string' ? new Date(arg) : arg), z.date().nullable().optional()), 
    gender: z.string().optional(),
    bloodGroup: z.string().optional(),
    mobileNumber: z.string().refine((val) => !val || /^\d{10}$/.test(val), {
      message: "Mobile number must be a 10-digit number",
    }).optional(),
    secondaryMobileNumber: z
      .string()
      .refine((val) => !val || /^\d{10}$/.test(val), {
        message: "Secondary mobile number must be a 10-digit number",
      }).optional(),
    vehicleType: z.string().optional(),
    vehicleNumber: z.string().optional(),
    NTNNumber: z.string().refine((val) => !val || /^\d{7}$/.test(val), {
      message: "NTN must be a 7-digit number",
    }).optional(),
    officialBankAccountNumber: z
      .string()
      .refine((val) => !val || /^\d{16}$/.test(val), {
        message: "Bank account number must be a 16-digit number",
      }).optional(),
    city: z.string().optional(),
    permanentAddress: z.string().optional(),
    currentAddress: z.string().optional(),
    slackId: z.string().optional(),
    familyMemberName: z.string().optional(),
    familyRelationship: z.string().optional(),
    familyContactNumber: z
      .string()
      .refine((val) => !val || /^\d{10}$/.test(val), {
        message: "Family contact number must be a 10-digit number",
      }).optional(),
    marriageDate: z    
    .preprocess((arg) => (typeof arg === 'string' ? new Date(arg) : arg), z.date().nullable().optional()), 

  });

  export const professionalInfoSchema = z.object({
    jobType: z.string().optional(),
    joiningDate: z
    .preprocess((arg) => (typeof arg === 'string' ? new Date(arg) : arg), z.date().nullable().optional()), 
    employmentStatus: z.string().optional(),
    permanentDate: z
    .preprocess((arg) => (typeof arg === 'string' ? new Date(arg) : arg), z.date().nullable().optional()), 
    experienceBeforeJoining: z.string().optional(),
    totalExperience: z.string().optional(),
    reportingOffice: z.string().optional(),
    reportingOfficeLocation: z.string().optional(),
    officeStartTime: z
      .string({ required_error: "Enter office start time" })
      .refine((val) => !val || /^([01]\d|2[0-3]):([0-5]\d)$/.test(val), {
        message: "Invalid time format (HH:mm)",
      }).optional(),
    officeHours: z.number().optional(),
    workingHours: z.number().optional(),
    designationId: z.string().optional(),
    managerId : z.string().optional(),
    role: z.object({
        id: z.string(),
        name: z.string(),
      }),
  }).superRefine((data, ctx) => {
    if (data.role.name === "ENGINEER" && !data.managerId) {
      ctx.addIssue({
        code: "custom",
        path: ["managerId"],
        message: "Project Manager is required for the ENGINEER role",
      });
    }
  });



  export const addProjectSchema = z
  .object({
    name: z.string().min(1, "Enter project name"),
    description: z.string().optional(),
    billingType: z.string().min(1, "Billing type is required"),
    startDate: z.date({message : "Date is required"}),
    requiredDays: z.string().optional(),
    clientName: z.string().optional(),
    technologies: z.array(z.string()).default([]),
    projectPlatform: z.array(z.string()).default([]),
    resources: z.array(z.string()).default([]),
    projectManager: z.string().optional(),
    status: z.string().min(1, "Status is required"),
  })
  .superRefine((data, ctx) => {
    if (data.billingType === "fixed") {
      if (!data.requiredDays) {
        ctx.addIssue({
          code: "custom",
          path: ["requiredDays"],
          message: "Required days is mandatory for fixed billing type",
        });
      }
    }
  });

  export const projectDetailsSchema = z
  .object({
    name: z.string().optional(),
    description: z.string().optional(),
    billingType: z.string().optional(),
    startDate: z.
    preprocess((arg) => (typeof arg === 'string' ? new Date(arg) : arg), z.date().nullable().optional()),   
    requiredDays: z.string().optional(),
    endDate : z.
    preprocess((arg) => (typeof arg === 'string' ? new Date(arg) : arg), z.date().nullable().optional()),   
    clientName: z.string().optional(),
    technologies: z.array(z.string()).default([]),
    projectPlatform: z.array(z.string()).default([]),
    resources: z.array(z.string()).default([]),
    projectManager: z.string().optional(),
    status: z.string().min(1, "Status is required"),
  })
  .superRefine((data, ctx) => {
    if (data.billingType === "fixed") {
      if (!data.requiredDays) {
        ctx.addIssue({
          code: "custom",
          path: ["requiredDays"],
          message: "Required days is mandatory for fixed billing type",
        });
      }
    }
  });

  export const internalProjectSchema = z.object({
    name : z.string().min(1, "Please enter name"),
    description : z.string().min(1, "Please enter description"),
    roles : z.array(z.string()).default([]) 
  })

  export const internalProjectDetialsSchema = z.object({
    name : z.string().optional(),
    description : z.string().optional(),
    roles : z.array(z.string()).default([]) 
  })

  export const holidaySchema = z.object({
    title : z.string().min(1, "Please enter title"),
    date: z.date({message : "Please enter date"}),
  });

  export const holidayDetailsSchema = z.object({
    title : z.string().min(1, "Please enter date"),
    date : z.preprocess((arg) =>
      (typeof arg === 'string' ? new Date(arg) : arg), z.date().nullable().optional()),   
  })


  export const userSchema = z
  .object({
    name: z.string().min(1, "Enter name"),
    email: z.string().min(1, "Enter email").email("Incorrect email address"),
    status: z.string().min(1, "Enter status"),
    role: z.object({
      id: z.string().min(1, "Select a role"),
      name: z.string().min(1, "Role name is required"),
    }),
    designationId: z.string().min(1, "Enter designation"),
    jobType: z.string().min(1, "Enter job type"),
    officeStartTime: z
      .string({ required_error: "Enter office start time" })
      .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:mm)"),
    officeHours: z.number().min(1, "Enter office hours"),
    workingHours: z.number().min(1, "Enter working hours"),
    managerId: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.role.name === "ENGINEER" && !data.managerId) {
      ctx.addIssue({
        code: "custom",
        path: ["managerId"],
        message: "Project Manager is required for the ENGINEER role",
      });
    }
  });

  export const taskFormSchema = z.object({
    title : z.string().min(1, "Title is required"),
    description : z.string().min(1, "Description is required"),
    projectId : z.string().min(1, "Project is required"),
    time : z.string().min(1, "Please enter time")
    
  })