import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get all departments
export const getAllDepartments = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("departments").collect();
  },
});

// Get a single department by ID
export const getDepartmentById = query({
  args: { id: v.id("departments") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Create a new department
export const createDepartment = mutation({
  args: {
    department_name: v.string(),
    head_of_department: v.optional(v.id("people")),
    liaison_teacher: v.optional(v.id("people")),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("departments", args);
  },
});

// Update a department
export const updateDepartment = mutation({
  args: {
    id: v.id("departments"),
    department_name: v.optional(v.string()),
    head_of_department: v.optional(v.id("people")),
    liaison_teacher: v.optional(v.id("people")),
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

// Delete a department
export const deleteDepartment = mutation({
  args: { id: v.id("departments") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});
