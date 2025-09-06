import type { Id } from "./common.js";
import type { Person } from "./person.js";
import { UserRoles } from "./user-role.js";
import type { UserRole } from "./user-role.js";

export { UserRoles };
export type { Id, Person, UserRole };

export type AttendanceStatus = "P" | "A" | "L" | "E"; // Present/Absent/Late/Excused

// Database entity types (simplified for now)
export interface Department {
  _id: Id<"departments">;
  _creationTime: number;
  department_name: string;
  head_of_department?: Id<"people">;
  liaison_teacher?: Id<"people">;
}

export interface Course {
  _id: Id<"courses">;
  _creationTime: number;
  course_id: string;
  course_name: string;
  semester: string;
  credits: number;
  department_id: Id<"departments">;
  teacher_id: Id<"people">;
}

export interface Attendance {
  _id: Id<"attendance">;
  _creationTime: number;
  student_id: Id<"people">;
  course_id: Id<"courses">;
  teacher_id: Id<"people">;
  date: string;
  status: "P" | "A" | "L" | "E";
  remarks?: string;
}


// Extended types for better type safety
export interface Student extends Person {
  role: "student";
  er_no: string;
  semester: string;
  department_id: Id<"departments">;
}

export interface Teacher extends Person {
  role: "teacher";
  department_id: Id<"departments">;
  subject_assigned?: string;
  additional_courses?: string[];
}

export interface Admin extends Person {
  role: "admin";
  admin_role?: string;
}

// Form types for creating/updating entities
export interface CreateDepartmentForm {
  department_name: string;
  head_of_department?: Id<"people">;
  liaison_teacher?: Id<"people">;
}

export interface CreateCourseForm {
  course_id: string;
  course_name: string;
  semester: string;
  credits: number;
  department_id: Id<"departments">;
  teacher_id: Id<"people">;
}

export interface CreatePersonForm {
  full_name: string;
  email: string;
  phone?: string;
  role: UserRole;
  
  // Student-specific
  er_no?: string;
  semester?: string;
  gender?: string;
  micro?: string;
  minor?: string;
  department_id?: Id<"departments">;
  guardian_contact?: string;
  
  // Teacher-specific
  additional_courses?: string[];
  subject_assigned?: string;
  
  // Admin-specific
  admin_role?: string;
}

export interface CreateAttendanceForm {
  student_id: Id<"people">;
  course_id: Id<"courses">;
  teacher_id: Id<"people">;
  date: string;
  status: AttendanceStatus;
  remarks?: string;
}

// Dashboard types
export interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalCourses: number;
  totalDepartments: number;
  attendanceToday: number;
}

// Navigation types
export interface NavItem {
  name: string;
  href: string;
  icon: any;
  roles: UserRole[];
}

// Filter and search types
export interface AttendanceFilter {
  courseId?: Id<"courses">;
  studentId?: Id<"people">;
  teacherId?: Id<"people">;
  date?: string;
  status?: AttendanceStatus;
}

export interface PeopleFilter {
  role?: UserRole;
  departmentId?: Id<"departments">;
  semester?: string;
}
