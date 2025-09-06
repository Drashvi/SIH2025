import type { Id } from "./common.js";

export type Person = {
  _id: Id<"people">;
  _creationTime: number;
  user_id: string;
  full_name: string;
  email: string;
  phone?: string;
  role: "student" | "teacher" | "admin";
  
  // Student-specific fields
  er_no?: string;
  semester?: string;
  gender?: string;
  micro?: string;
  minor?: string;
  department_id?: Id<"departments">;
  guardian_contact?: string;
  
  // Teacher-specific fields
  additional_courses?: string[];
  subject_assigned?: string;
  
  // Admin-specific fields
  admin_role?: string;
}

