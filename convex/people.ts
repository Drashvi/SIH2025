import { v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";

// Get all people
export const getAllPeople = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("people").collect();
  },
});

// Get people by role
export const getPeopleByRole = query({
  args: { role: v.union(v.literal("student"), v.literal("teacher"), v.literal("admin")) },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("people")
      .withIndex("by_role", (q) => q.eq("role", args.role))
      .collect();
  },
});

// Get person by user ID (Clerk ID)
export const getPersonByUserId = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("people")
      .withIndex("by_user_id", (q) => q.eq("user_id", args.userId))
      .first();
  },
});

// Get people by department
export const getPeopleByDepartment = query({
  args: { departmentId: v.id("departments") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("people")
      .withIndex("by_department", (q) => q.eq("department_id", args.departmentId))
      .collect();
  },
});

// Create a new person
export const createPerson = mutation({
  args: {
    user_id: v.string(),
    full_name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    role: v.union(v.literal("student"), v.literal("teacher"), v.literal("admin")),
    approval_status: v.optional(v.union(v.literal("pending"), v.literal("approved"), v.literal("rejected"))),
    
    // Student-specific fields
    er_no: v.optional(v.string()),
    semester: v.optional(v.string()),
    gender: v.optional(v.string()),
    micro: v.optional(v.string()),
    minor: v.optional(v.string()),
    department_id: v.optional(v.id("departments")),
    guardian_contact: v.optional(v.string()),
    
    // Teacher-specific fields
    additional_courses: v.optional(v.array(v.string())),
    subject_assigned: v.optional(v.string()),
    
    // Admin-specific fields
    admin_role: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Set default approval status based on role
    const personData = {
      ...args,
      approval_status: "approved"
    };
    return await ctx.db.insert("people", personData);
  },
});

// Update a person
export const updatePerson = mutation({
  args: {
    id: v.id("people"),
    full_name: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    
    // Student-specific fields
    er_no: v.optional(v.string()),
    semester: v.optional(v.string()),
    gender: v.optional(v.string()),
    micro: v.optional(v.string()),
    minor: v.optional(v.string()),
    department_id: v.optional(v.id("departments")),
    guardian_contact: v.optional(v.string()),
    
    // Teacher-specific fields
    additional_courses: v.optional(v.array(v.string())),
    subject_assigned: v.optional(v.string()),
    
    // Admin-specific fields
    admin_role: v.optional(v.string()),
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

// Delete a person
export const deletePerson = mutation({
  args: { id: v.id("people") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});

// Get students by enrollment number
export const getStudentByErNo = query({
  args: { erNo: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("people")
      .withIndex("by_er_no", (q) => q.eq("er_no", args.erNo))
      .first();
  },
});

// Get people by approval status
export const getPeopleByApprovalStatus = query({
  args: { status: v.union(v.literal("pending"), v.literal("approved"), v.literal("rejected")) },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("people")
      .withIndex("by_approval_status", (q) => q.eq("approval_status", args.status))
      .collect();
  },
});

// Approve a user
export const approveUser = mutation({
  args: { id: v.id("people") },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.id, { approval_status: "approved" });
  },
});

// Reject a user
export const rejectUser = mutation({
  args: { id: v.id("people") },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.id, { approval_status: "rejected" });
  },
});

// Get pending approvals count
export const getPendingApprovalsCount = query({
  args: {},
  handler: async (ctx) => {
    const pendingUsers = await ctx.db
      .query("people")
      .withIndex("by_approval_status", (q) => q.eq("approval_status", "pending"))
      .collect();
    return pendingUsers.length;
  },
});
