import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get all courses
export const getAllCourses = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("courses").collect();
  },
});

// Get courses by department
export const getCoursesByDepartment = query({
  args: { departmentId: v.id("departments") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("courses")
      .withIndex("by_department", (q) => q.eq("department_id", args.departmentId))
      .collect();
  },
});

// Get courses by teacher
export const getCoursesByTeacher = query({
  args: { teacherId: v.id("people") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("courses")
      .withIndex("by_teacher", (q) => q.eq("teacher_id", args.teacherId))
      .collect();
  },
});

// Get course by course ID
export const getCourseByCustomId = query({
  args: { courseId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("courses")
      .withIndex("by_course_id", (q) => q.eq("course_id", args.courseId))
      .first();
  },
});

// Get single course by database ID
export const getCourseById = query({
  args: { id: v.id("courses") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Create a new course
export const createCourse = mutation({
  args: {
    course_id: v.string(),
    course_name: v.string(),
    semester: v.string(),
    credits: v.number(),
    department_id: v.id("departments"),
    teacher_id: v.id("people"),
  },
  handler: async (ctx, args) => {
    // Check if course ID already exists
    const existingCourse = await ctx.db
      .query("courses")
      .withIndex("by_course_id", (q) => q.eq("course_id", args.course_id))
      .first();
    
    if (existingCourse) {
      throw new Error("Course ID already exists");
    }
    
    return await ctx.db.insert("courses", args);
  },
});

// Update a course
export const updateCourse = mutation({
  args: {
    id: v.id("courses"),
    course_id: v.optional(v.string()),
    course_name: v.optional(v.string()),
    semester: v.optional(v.string()),
    credits: v.optional(v.number()),
    department_id: v.optional(v.id("departments")),
    teacher_id: v.optional(v.id("people")),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    
    // If updating course_id, check for duplicates
    if (updates.course_id !== undefined) {
      const existingCourse = await ctx.db
        .query("courses")
        .withIndex("by_course_id", (q) => q.eq("course_id", updates.course_id!))
        .first();
      
      if (existingCourse && existingCourse._id !== id) {
        throw new Error("Course ID already exists");
      }
    }
    
    // Remove undefined values
    const cleanUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, value]) => value !== undefined)
    );
    
    return await ctx.db.patch(id, cleanUpdates);
  },
});

// Delete a course
export const deleteCourse = mutation({
  args: { id: v.id("courses") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});

// Get courses by semester
export const getCoursesBySemester = query({
  args: { semester: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("courses")
      .filter((q) => q.eq(q.field("semester"), args.semester))
      .collect();
  },
});
