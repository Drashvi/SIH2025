import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState } from "react";
import { Plus, Edit, Trash2, Filter } from "lucide-react";
import type { Person } from "../../types/person-types";
import type { UserRole } from "../../types/user-role";

export default function PeopleList() {
  const allPeople = useQuery(api.people.getAllPeople);
  const departments = useQuery(api.departments.getAllDepartments);
  const createPerson = useMutation(api.people.createPerson);
  const updatePerson = useMutation(api.people.updatePerson);
  const deletePerson = useMutation(api.people.deletePerson);

  const [showForm, setShowForm] = useState(false);
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);
  const [filter, setFilter] = useState<{ role?: UserRole; departmentId?: string }>({});
  const [formData, setFormData] = useState({
    user_id: "",
    full_name: "",
    email: "",
    phone: "",
    role: "student" as UserRole,
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
    additional_courses: [] as string[],
    // Admin fields
    admin_role: "",
  });

  // Filter people based on selected filters
  const filteredPeople = allPeople?.filter((person) => {
    if (filter.role && person.role !== filter.role) return false;
    if (filter.departmentId && person.department_id !== filter.departmentId) return false;
    return true;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = {
      user_id: formData.user_id || `user_${Date.now()}`, // Generate user ID if not provided
      full_name: formData.full_name,
      email: formData.email,
      phone: formData.phone || undefined,
      role: formData.role,
      
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
      additional_courses: formData.role === "teacher" && formData.additional_courses.length > 0 
        ? formData.additional_courses : undefined,
      
      // Admin fields
      admin_role: formData.role === "admin" ? formData.admin_role || undefined : undefined,
    };

    try {
      if (editingPerson) {
        const { user_id, ...updateData } = data;
        await updatePerson({
          id: editingPerson._id as any,
          ...updateData,
        });
      } else {
        await createPerson(data);
      }
      
      resetForm();
    } catch (error) {
      console.error("Error saving person:", error);
      alert("Error saving person. Please try again.");
    }
  };

  const handleEdit = (person: Person) => {
    setEditingPerson(person);
    setFormData({
      user_id: person.user_id,
      full_name: person.full_name,
      email: person.email,
      phone: person.phone || "",
      role: person.role,
      er_no: person.er_no || "",
      semester: person.semester || "",
      gender: person.gender || "",
      micro: person.micro || "",
      minor: person.minor || "",
      department_id: person.department_id || "",
      guardian_contact: person.guardian_contact || "",
      subject_assigned: person.subject_assigned || "",
      additional_courses: person.additional_courses || [],
      admin_role: person.admin_role || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this person?")) {
      try {
        await deletePerson({ id: id as any });
      } catch (error) {
        console.error("Error deleting person:", error);
        alert("Error deleting person. Please try again.");
      }
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingPerson(null);
    setFormData({
      user_id: "",
      full_name: "",
      email: "",
      phone: "",
      role: "student",
      er_no: "",
      semester: "",
      gender: "",
      micro: "",
      minor: "",
      department_id: "",
      guardian_contact: "",
      subject_assigned: "",
      additional_courses: [],
      admin_role: "",
    });
  };

  if (!allPeople || !departments) {
    return <div>Loading people...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">People Management</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus size={20} className="mr-2" />
          Add Person
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex items-center gap-4">
          <Filter size={20} className="text-gray-500" />
          <select
            value={filter.role || ""}
            onChange={(e) => setFilter({ ...filter, role: e.target.value as UserRole || undefined })}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Roles</option>
            <option value="student">Students</option>
            <option value="teacher">Teachers</option>
            <option value="admin">Admins</option>
          </select>
          
          <select
            value={filter.departmentId || ""}
            onChange={(e) => setFilter({ ...filter, departmentId: e.target.value || undefined })}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Departments</option>
            {departments.map((dept) => (
              <option key={dept._id} value={dept._id}>
                {dept.department_name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingPerson ? "Edit Person" : "Add New Person"}
          </h2>
          <form onSubmit={handleSubmit}>
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
                  Role *
                </label>
                <select
                  required
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            {/* Role-specific fields */}
            {formData.role === "student" && (
              <div className="border-t pt-4">
                <h3 className="text-lg font-medium mb-3">Student Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                      Semester
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
                </div>
              </div>
            )}

            {formData.role === "teacher" && (
              <div className="border-t pt-4">
                <h3 className="text-lg font-medium mb-3">Teacher Information</h3>
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
                      Subject Assigned
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
              <div className="border-t pt-4">
                <h3 className="text-lg font-medium mb-3">Admin Information</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Admin Role
                  </label>
                  <input
                    type="text"
                    value={formData.admin_role}
                    onChange={(e) => setFormData({ ...formData, admin_role: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 mt-6">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                {editingPerson ? "Update" : "Create"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* People List */}
      <div className="bg-white rounded-lg shadow">
        {filteredPeople?.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No people found matching the current filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPeople?.map((person) => (
                  <tr key={person._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {person.full_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {person.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        person.role === "admin" 
                          ? "bg-red-100 text-red-800"
                          : person.role === "teacher"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}>
                        {person.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {person.department_id ? (
                        departments.find(d => d._id === person.department_id)?.department_name || "Unknown"
                      ) : (
                        "Not assigned"
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {person.role === "student" && person.er_no && `ER: ${person.er_no}`}
                      {person.role === "teacher" && person.subject_assigned && `Subject: ${person.subject_assigned}`}
                      {person.role === "admin" && person.admin_role && `Role: ${person.admin_role}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(person)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(person._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
