import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { UserRoles, type UserRole } from "../../types";

export default function UserSetup() {
  const { user } = useUser();
  const departments = useQuery(api.departments.getAllDepartments);
  const createPerson = useMutation(api.people.createPerson);
  
  const [formData, setFormData] = useState({
    role: "student" as UserRole,
    full_name: user?.fullName || "",
    email: user?.emailAddresses?.[0]?.emailAddress || "",
    phone: "",
    // Student fields
    er_no: "",
    semester: "",
    gender: "",
    micro: "",
    minor: "",
    department_id: "",
    guardian_contact: "",
    // Teacher fields
    subject_assigned: "",
    // Admin fields
    admin_role: "",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    
    try {
      const data = {
        user_id: user.id,
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone || undefined,
        role: formData.role,
        approval_status: formData.role === "admin" ? "approved" as const : "pending" as const,
        
        // Student fields
        er_no: formData.role === "student" ? formData.er_no || undefined : undefined,
        semester: formData.role === "student" ? formData.semester || undefined : undefined,
        gender: formData.role === "student" ? formData.gender || undefined : undefined,
        micro: formData.role === "student" ? formData.micro || undefined : undefined,
        minor: formData.role === "student" ? formData.minor || undefined : undefined,
        department_id: (formData.role === "student" || formData.role === "teacher") && formData.department_id
          ? (formData.department_id as any) : undefined,
        guardian_contact: formData.role === "student" ? formData.guardian_contact || undefined : undefined,
        
        // Teacher fields
        subject_assigned: formData.role === "teacher" ? formData.subject_assigned || undefined : undefined,
        
        // Admin fields
        admin_role: formData.role === "admin" ? formData.admin_role || undefined : undefined,
      };

      await createPerson(data);
      // The app will automatically update when the user is created
    } catch (error) {
      console.error("Error creating user profile:", error);
      alert("Error creating profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!departments) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Welcome! Let's set up your profile
        </h1>
        <p className="text-gray-600 mb-6">
          Please provide some basic information to complete your account setup.
        </p>
        
        <form onSubmit={handleSubmit}>
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                I am a *
              </label>
              <select
                required
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {UserRoles.map((role) => (
                  <option key={role} value={role}>
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Role-specific fields */}
          {formData.role === "student" && (
            <div className="border-t pt-6 mb-6">
              <h3 className="text-lg font-medium mb-4">Student Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enrollment Number
                  </label>
                  <input
                    type="text"
                    value={formData.er_no}
                    onChange={(e) => setFormData({ ...formData, er_no: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Semester
                  </label>
                  <input
                    type="text"
                    value={formData.semester}
                    onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department
                  </label>
                  <select
                    value={formData.department_id}
                    onChange={(e) => setFormData({ ...formData, department_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept) => (
                      <option key={dept._id} value={dept._id}>
                        {dept.department_name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {formData.role === "teacher" && (
            <div className="border-t pt-6 mb-6">
              <h3 className="text-lg font-medium mb-4">Teacher Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department
                  </label>
                  <select
                    value={formData.department_id}
                    onChange={(e) => setFormData({ ...formData, department_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept) => (
                      <option key={dept._id} value={dept._id}>
                        {dept.department_name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Primary Subject
                  </label>
                  <input
                    type="text"
                    value={formData.subject_assigned}
                    onChange={(e) => setFormData({ ...formData, subject_assigned: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {formData.role === "admin" && (
            <div className="border-t pt-6 mb-6">
              <h3 className="text-lg font-medium mb-4">Admin Information</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Admin Role/Position
                </label>
                <input
                  type="text"
                  value={formData.admin_role}
                  onChange={(e) => setFormData({ ...formData, admin_role: e.target.value })}
                  placeholder="e.g., Academic Coordinator, System Administrator"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-md font-medium transition-colors ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {loading ? "Setting up..." : "Complete Setup"}
          </button>
        </form>
      </div>
    </div>
  );
}
