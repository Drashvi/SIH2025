export const UserRoles = ["student", "teacher", "admin"] as const;
export type UserRole = typeof UserRoles[number];
