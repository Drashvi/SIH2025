import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get all attendance records
export const getAllAttendance = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("attendance").collect();
  },
});

// Get attendance by student
export const getAttendanceByStudent = query({
  args: { studentId: v.id("people") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("attendance")
      .withIndex("by_student", (q) => q.eq("student_id", args.studentId))
      .collect();
  },
});

// Get attendance by course
export const getAttendanceByCourse = query({
  args: { courseId: v.id("courses") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("attendance")
      .withIndex("by_course", (q) => q.eq("course_id", args.courseId))
      .collect();
  },
});

// Get attendance by date
export const getAttendanceByDate = query({
  args: { date: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("attendance")
      .withIndex("by_date", (q) => q.eq("date", args.date))
      .collect();
  },
});

// Get attendance by teacher (who marked it)
export const getAttendanceByTeacher = query({
  args: { teacherId: v.id("people") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("attendance")
      .withIndex("by_teacher", (q) => q.eq("teacher_id", args.teacherId))
      .collect();
  },
});

// Get attendance for specific student and course
export const getAttendanceByStudentAndCourse = query({
  args: { 
    studentId: v.id("people"), 
    courseId: v.id("courses") 
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("attendance")
      .withIndex("by_student", (q) => q.eq("student_id", args.studentId))
      .filter((q) => q.eq(q.field("course_id"), args.courseId))
      .collect();
  },
});

// Get attendance for specific date range
export const getAttendanceByDateRange = query({
  args: { 
    startDate: v.string(), 
    endDate: v.string(),
    studentId: v.optional(v.id("people")),
    courseId: v.optional(v.id("courses"))
  },
  handler: async (ctx, args) => {
    let results;
    
    if (args.studentId) {
      results = await ctx.db
        .query("attendance")
        .withIndex("by_student", (q) => q.eq("student_id", args.studentId!))
        .collect();
    } else {
      results = await ctx.db.query("attendance").collect();
    }
    
    return results.filter(record => {
      const recordDate = record.date;
      const matchesDateRange = recordDate >= args.startDate && recordDate <= args.endDate;
      const matchesCourse = !args.courseId || record.course_id === args.courseId;
      return matchesDateRange && matchesCourse;
    });
  },
});

// Create attendance record
export const createAttendance = mutation({
  args: {
    student_id: v.id("people"),
    course_id: v.id("courses"),
    teacher_id: v.id("people"),
    date: v.string(),
    status: v.union(v.literal("P"), v.literal("A"), v.literal("L"), v.literal("E")),
    remarks: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if attendance already exists for this student, course, and date
    const existingAttendance = await ctx.db
      .query("attendance")
      .withIndex("unique_attendance", (q) => 
        q.eq("student_id", args.student_id)
         .eq("course_id", args.course_id)
         .eq("date", args.date)
      )
      .first();
    
    if (existingAttendance) {
      throw new Error("Attendance already recorded for this student, course, and date");
    }
    
    return await ctx.db.insert("attendance", args);
  },
});

// Update attendance record
export const updateAttendance = mutation({
  args: {
    id: v.id("attendance"),
    status: v.optional(v.union(v.literal("P"), v.literal("A"), v.literal("L"), v.literal("E"))),
    remarks: v.optional(v.string()),
    teacher_id: v.optional(v.id("people")), // Allow updating who marked it
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    
    // Remove undefined values
    const cleanUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, value]) => value !== undefined)
    );
    
    return await ctx.db.patch(id, cleanUpdates);
  },
});

// Delete attendance record
export const deleteAttendance = mutation({
  args: { id: v.id("attendance") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});

// Bulk create attendance for multiple students
export const createBulkAttendance = mutation({
  args: {
    records: v.array(v.object({
      student_id: v.id("people"),
      course_id: v.id("courses"),
      teacher_id: v.id("people"),
      date: v.string(),
      status: v.union(v.literal("P"), v.literal("A"), v.literal("L"), v.literal("E")),
      remarks: v.optional(v.string()),
    }))
  },
  handler: async (ctx, args) => {
    const results = [];
    
    for (const record of args.records) {
      // Check for existing attendance
      const existingAttendance = await ctx.db
        .query("attendance")
        .withIndex("unique_attendance", (q) => 
          q.eq("student_id", record.student_id)
           .eq("course_id", record.course_id)
           .eq("date", record.date)
        )
        .first();
      
      if (!existingAttendance) {
        const id = await ctx.db.insert("attendance", record);
        results.push({ id, status: "created" });
      } else {
        results.push({ 
          id: existingAttendance._id, 
          status: "skipped", 
          reason: "already_exists" 
        });
      }
    }
    
    return results;
  },
});

// Get attendance statistics for a student
export const getStudentAttendanceStats = query({
  args: { 
    studentId: v.id("people"),
    courseId: v.optional(v.id("courses")),
    semester: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    let attendanceRecords = await ctx.db
      .query("attendance")
      .withIndex("by_student", (q) => q.eq("student_id", args.studentId))
      .collect();
    
    // Filter by course if provided
    if (args.courseId) {
      attendanceRecords = attendanceRecords.filter(record => 
        record.course_id === args.courseId
      );
    }
    
    const total = attendanceRecords.length;
    const present = attendanceRecords.filter(r => r.status === "P").length;
    const absent = attendanceRecords.filter(r => r.status === "A").length;
    const late = attendanceRecords.filter(r => r.status === "L").length;
    const excused = attendanceRecords.filter(r => r.status === "E").length;
    
    const attendancePercentage = total > 0 ? Math.round((present / total) * 100) : 0;
    
    return {
      total,
      present,
      absent,
      late,
      excused,
      attendancePercentage
    };
  },
});
