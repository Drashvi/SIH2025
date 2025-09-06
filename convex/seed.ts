import { mutation } from "./_generated/server";

// Seed sample departments
export const seedDepartments = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if departments already exist
    const existingDepartments = await ctx.db.query("departments").collect();
    if (existingDepartments.length > 0) {
      return { message: "Departments already exist", count: existingDepartments.length };
    }

    const sampleDepartments = [
      { department_name: "Computer Science" },
      { department_name: "Mathematics" },
      { department_name: "Physics" },
      { department_name: "Chemistry" },
      { department_name: "Biology" },
      { department_name: "English Literature" },
      { department_name: "History" },
      { department_name: "Economics" },
    ];

    const results = [];
    for (const dept of sampleDepartments) {
      const id = await ctx.db.insert("departments", dept);
      results.push(id);
    }

    return { message: "Sample departments created", count: results.length };
  },
});

// Seed sample courses
export const seedCourses = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if courses already exist
    const existingCourses = await ctx.db.query("courses").collect();
    if (existingCourses.length > 0) {
      return { message: "Courses already exist", count: existingCourses.length };
    }

    // Get departments and teachers for referencing
    const departments = await ctx.db.query("departments").collect();
    const teachers = await ctx.db.query("people").filter(q => q.eq(q.field("role"), "teacher")).collect();

    if (departments.length === 0) {
      throw new Error("No departments found. Please seed departments first.");
    }
    
    // Create a dummy teacher if no teachers exist
    let defaultTeacherId;
    if (teachers.length === 0) {
      defaultTeacherId = await ctx.db.insert("people", {
        user_id: "dummy-teacher-id",
        full_name: "Sample Teacher",
        email: "teacher@example.com",
        role: "teacher" as const,
        approval_status: "approved" as const,
        department_id: departments[0]._id,
        subject_assigned: "General Studies"
      });
    } else {
      defaultTeacherId = teachers[0]._id;
    }

    // Create some sample courses
    const sampleCourses = [
      {
        course_id: "CS101",
        course_name: "Introduction to Computer Science",
        semester: "Fall 2024",
        credits: 3,
        department_id: departments[0]._id,
        teacher_id: teachers.length > 0 ? teachers[0]._id : defaultTeacherId,
      },
      {
        course_id: "MATH201",
        course_name: "Calculus II",
        semester: "Fall 2024",
        credits: 4,
        department_id: departments[1]._id,
        teacher_id: teachers.length > 1 ? teachers[1]._id : defaultTeacherId,
      },
      {
        course_id: "PHYS301",
        course_name: "Quantum Physics",
        semester: "Spring 2024",
        credits: 3,
        department_id: departments[2]._id,
        teacher_id: teachers.length > 2 ? teachers[2]._id : defaultTeacherId,
      },
      {
        course_id: "CHEM150",
        course_name: "Organic Chemistry",
        semester: "Fall 2024",
        credits: 4,
        department_id: departments[3]._id,
        teacher_id: teachers.length > 3 ? teachers[3]._id : defaultTeacherId,
      },
      {
        course_id: "BIO200",
        course_name: "Cell Biology",
        semester: "Spring 2024",
        credits: 3,
        department_id: departments[4]._id,
        teacher_id: teachers.length > 4 ? teachers[4]._id : defaultTeacherId,
      },
    ];

    const results = [];
    for (const course of sampleCourses) {
      try {
        const id = await ctx.db.insert("courses", course);
        results.push(id);
      } catch (error) {
        console.error("Error creating course:", error);
      }
    }

    return { message: "Sample courses created", count: results.length };
  },
});

