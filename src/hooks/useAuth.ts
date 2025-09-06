import { useUser } from "@clerk/clerk-react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { UserRole } from "../types/index";

export function useAuth() {
  const { user, isLoaded: clerkLoaded, isSignedIn } = useUser();
  
  // Get user data from our database
  const dbUser = useQuery(
    api.people.getPersonByUserId,
    user?.id ? { userId: user.id } : "skip"
  );

  const isLoaded = clerkLoaded && (isSignedIn ? dbUser !== undefined : true);
  
  return {
    user,
    dbUser,
    isSignedIn,
    isLoaded,
    role: dbUser?.role as UserRole | undefined,
    isAdmin: dbUser?.role === "admin",
    isTeacher: dbUser?.role === "teacher",
    isStudent: dbUser?.role === "student",
    isApproved: dbUser?.approval_status === "approved",
    isPending: dbUser?.approval_status === "pending",
    isRejected: dbUser?.approval_status === "rejected",
    approvalStatus: dbUser?.approval_status,
  };
}
