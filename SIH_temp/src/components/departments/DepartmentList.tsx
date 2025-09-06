import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  IoAddOutline,
  IoSearchOutline,
  IoPersonOutline,
  IoBusinessOutline,
  IoCreateOutline,
  IoTrashOutline,
  IoFilterOutline
} from "react-icons/io5";
import { Button, Card, CardHeader, CardTitle, CardContent, Input, Modal, ModalBody, ModalFooter, Table } from "../ui";
import type { Department, Id } from "../../types/index";

export default function DepartmentList() {
  const departments = useQuery(api.departments.getAllDepartments);
  const people = useQuery(api.people.getPeopleByRole, { role: "teacher" });
  const createDepartment = useMutation(api.departments.createDepartment);
  const updateDepartment = useMutation(api.departments.updateDepartment);
  const deleteDepartment = useMutation(api.departments.deleteDepartment);

  const [showForm, setShowForm] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    department_name: "",
    head_of_department: "",
    liaison_teacher: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const errors: Record<string, string> = {}
    
    if (!formData.department_name.trim()) {
      errors.department_name = "Department name is required"
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const data = {
      department_name: formData.department_name,
      head_of_department: formData.head_of_department
        ? (formData.head_of_department as Id<"people">)
        : undefined,
      liaison_teacher: formData.liaison_teacher
        ? (formData.liaison_teacher as Id<"people">)
        : undefined,
    };

    setLoading(true);
    try {
      if (editingDepartment) {
        await updateDepartment({
          id: editingDepartment._id,
          ...data,
        });
      } else {
        await createDepartment(data);
      }
      
      resetForm();
    } catch (error) {
      console.error("Error saving department:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (department: Department) => {
    setEditingDepartment(department);
    setFormData({
      department_name: department.department_name,
      head_of_department: department.head_of_department || "",
      liaison_teacher: department.liaison_teacher || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id: Id<"departments">) => {
    if (confirm("Are you sure you want to delete this department?")) {
      try {
        await deleteDepartment({ id });
      } catch (error) {
        console.error("Error deleting department:", error);
        alert("Error deleting department. Please try again.");
      }
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingDepartment(null);
    setFormData({ department_name: "", head_of_department: "", liaison_teacher: "" });
    setFormErrors({});
  };

  // Filter departments based on search term
  const filteredDepartments = departments?.filter(dept =>
    dept.department_name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Table columns configuration
  const columns = [
    {
      key: 'department_name',
      title: 'Department Name',
      sortable: true,
      render: (value: string) => (
        <div className="flex items-center gap-2">
          <IoBusinessOutline className="w-4 h-4 text-secondary-500" />
          <span className="font-medium">{value}</span>
        </div>
      )
    },
    {
      key: 'head_of_department',
      title: 'Head of Department',
      render: (_: any, record: Department) => {
        const head = people?.find(p => p._id === record.head_of_department);
        return head ? (
          <div className="flex items-center gap-2">
            <IoPersonOutline className="w-4 h-4 text-secondary-500" />
            <span>{head.full_name}</span>
          </div>
        ) : (
          <span className="text-secondary-500 italic">Not assigned</span>
        )
      }
    },
    {
      key: 'liaison_teacher',
      title: 'Liaison Teacher',
      render: (_: any, record: Department) => {
        const liaison = people?.find(p => p._id === record.liaison_teacher);
        return liaison ? (
          <div className="flex items-center gap-2">
            <IoPersonOutline className="w-4 h-4 text-secondary-500" />
            <span>{liaison.full_name}</span>
          </div>
        ) : (
          <span className="text-secondary-500 italic">Not assigned</span>
        )
      }
    },
    {
      key: 'actions',
      title: 'Actions',
      width: '100px',
      render: (_: any, record: Department) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEdit(record)}
            className="!p-2"
          >
            <IoCreateOutline className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(record._id)}
            className="!p-2 text-danger-600 hover:text-danger-700 hover:bg-danger-50"
          >
            <IoTrashOutline className="w-4 h-4" />
          </Button>
        </div>
      )
    }
  ];

  if (!departments || !people) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="text-secondary-600 mt-4">Loading departments...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-secondary-900">Departments</h1>
          <p className="text-secondary-600 mt-1">Manage your institution's departments</p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          icon={<IoAddOutline className="w-4 h-4" />}
        >
          Add Department
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search departments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<IoSearchOutline className="w-4 h-4" />}
              />
            </div>
            <Button variant="outline" icon={<IoFilterOutline className="w-4 h-4" />}>
              Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Department Form Modal */}
      <Modal
        isOpen={showForm}
        onClose={resetForm}
        title={editingDepartment ? "Edit Department" : "Add New Department"}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <ModalBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Input
                  label="Department Name"
                  required
                  value={formData.department_name}
                  onChange={(e) => {
                    setFormData({ ...formData, department_name: e.target.value })
                    if (formErrors.department_name) {
                      setFormErrors({ ...formErrors, department_name: "" })
                    }
                  }}
                  error={formErrors.department_name}
                  placeholder="Enter department name"
                />
              </div>
              
              <div>
                <label className="label">Head of Department</label>
                <select
                  value={formData.head_of_department}
                  onChange={(e) =>
                    setFormData({ ...formData, head_of_department: e.target.value })
                  }
                  className="input"
                >
                  <option value="">Select Teacher</option>
                  {people?.map((teacher) => (
                    <option key={teacher._id} value={teacher._id}>
                      {teacher.full_name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="label">Liaison Teacher</label>
                <select
                  value={formData.liaison_teacher}
                  onChange={(e) =>
                    setFormData({ ...formData, liaison_teacher: e.target.value })
                  }
                  className="input"
                >
                  <option value="">Select Teacher</option>
                  {people?.map((teacher) => (
                    <option key={teacher._id} value={teacher._id}>
                      {teacher.full_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </ModalBody>
          
          <ModalFooter>
            <Button
              type="button"
              variant="outline"
              onClick={resetForm}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={loading}
            >
              {editingDepartment ? "Update Department" : "Create Department"}
            </Button>
          </ModalFooter>
        </form>
      </Modal>

      {/* Departments Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IoBusinessOutline className="w-5 h-5" />
            Departments ({filteredDepartments.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table
            data={filteredDepartments}
            columns={columns}
            emptyText="No departments found. Create your first department to get started."
          />
        </CardContent>
      </Card>
    </motion.div>
  );
}
