import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Department table
  departments: defineTable({
    department_name: v.string(),
    head_of_department: v.optional(v.id("people")), // FK to Teacher
    liaison_teacher: v.optional(v.id("people")), // FK to Teacher (optional)
  }),

  // Course/Subject table
  courses: defineTable({
    course_id: v.string(), // Custom course ID
    course_name: v.string(),
    semester: v.string(),
    credits: v.number(),
    department_id: v.id("departments"), // FK to Department
    teacher_id: v.id("people"), // FK to Teacher
  }).index("by_department", ["department_id"])
    .index("by_teacher", ["teacher_id"])
    .index("by_course_id", ["course_id"]),

  // People table (handles Students, Teachers, and Admins)
  people: defineTable({
    user_id: v.string(), // Clerk user ID
    full_name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    role: v.union(v.literal("student"), v.literal("teacher"), v.literal("admin")),
    approval_status: v.optional(v.union(v.literal("pending"), v.literal("approved"), v.literal("rejected"))), // Admin approval status
    
    // Student-specific fields
    er_no: v.optional(v.string()), // Student enrollment number
    semester: v.optional(v.string()), // Current semester for students
    gender: v.optional(v.string()),
    micro: v.optional(v.string()), // Micro specialization
    minor: v.optional(v.string()), // Minor subject
    department_id: v.optional(v.id("departments")), // FK to Department
    guardian_contact: v.optional(v.string()),
    
    // Teacher-specific fields
    additional_courses: v.optional(v.array(v.string())), // Additional courses taught
    subject_assigned: v.optional(v.string()), // Primary subject
    
    // Admin-specific fields
    admin_role: v.optional(v.string()), // Specific admin role
  }).index("by_user_id", ["user_id"])
    .index("by_role", ["role"])
    .index("by_department", ["department_id"])
    .index("by_er_no", ["er_no"])
    .index("by_approval_status", ["approval_status"]),

  // Attendance table
  attendance: defineTable({
    student_id: v.id("people"), // FK to Student
    course_id: v.id("courses"), // FK to Course
    teacher_id: v.id("people"), // FK to Teacher (marker)
    date: v.string(), // Date in ISO format
    status: v.union(v.literal("P"), v.literal("A"), v.literal("L"), v.literal("E")), // Present/Absent/Late/Excused
    remarks: v.optional(v.string()),
  }).index("by_student", ["student_id"])
    .index("by_course", ["course_id"])
    .index("by_teacher", ["teacher_id"])
    .index("by_date", ["date"])
    .index("unique_attendance", ["student_id", "course_id", "date"]),
});
