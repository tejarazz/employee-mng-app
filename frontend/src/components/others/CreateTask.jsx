/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const InputField = ({ label, name, type = "text", value, onChange, error }) => (
  <div>
    <h3>{label}</h3>
    <input
      type={type}
      name={name}
      className="rounded w-full p-2 bg-neutral-800 outline-none mt-2"
      value={value}
      onChange={onChange}
      placeholder={`Enter ${label.toLowerCase()}`}
    />
    {error && <p className="text-red-500 text-sm">{error}</p>}
  </div>
);

const TextAreaField = ({ label, name, value, onChange, error }) => (
  <div>
    <h3>{label}</h3>
    <textarea
      name={name}
      rows="9"
      className="w-full rounded outline-none p-2 bg-neutral-800 mt-2 resize-none"
      value={value}
      onChange={onChange}
      placeholder={`Enter ${label.toLowerCase()}`}
    ></textarea>
    {error && <p className="text-red-500 text-sm">{error}</p>}
  </div>
);

const CreateTask = () => {
  const [formData, setFormData] = useState({
    taskTitle: "",
    date: "",
    assignee: "",
    category: "",
    description: "",
  });
  const [employees, setEmployees] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_LOCALHOST_URL}/api/employees`
        );
        setEmployees(data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };
    fetchEmployees();
  }, []);

  const handleChange = ({ target: { name, value } }) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const requiredFields = [
      "taskTitle",
      "date",
      "assignee",
      "category",
      "description",
    ];
    const formErrors = requiredFields.reduce((acc, field) => {
      if (!formData[field].trim()) {
        acc[field] = `${field.replace(/([A-Z])/g, " $1")} is required`;
      }
      return acc;
    }, {});

    return formErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();

    if (Object.keys(formErrors).length) {
      setErrors(formErrors);
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_LOCALHOST_URL}/api/tasks`,
        {
          taskTitle: formData.taskTitle,
          date: formData.date,
          assignee: formData.assignee,
          category: formData.category,
          description: formData.description,
        }
      );

      console.log("Task created:", response.data);
      toast.success("Task assigned successfully!"); // Show toast notification
      setFormData({
        taskTitle: "",
        date: "",
        assignee: "",
        category: "",
        description: "",
      });
      setErrors({});
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  return (
    <div className="mt-10">
      <ToastContainer autoClose={1000} /> {/* Add ToastContainer here */}
      <form
        className="flex flex-col lg:flex-row w-full justify-between text-white bg-black/80 rounded-lg shadow backdrop-blur-3xl p-5 items-start"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col gap-4 w-full lg:w-1/2 mr-36">
          <InputField
            label="Task Title"
            name="taskTitle"
            value={formData.taskTitle}
            onChange={handleChange}
            error={errors.taskTitle}
          />
          <InputField
            label="Date"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            error={errors.date}
          />
          <div>
            <h3>Assign to</h3>
            <select
              name="assignee"
              className="rounded w-full p-2 bg-neutral-800 outline-none mt-2"
              value={formData.assignee}
              onChange={handleChange}
            >
              <option value="">Select Employee</option>
              {employees.map((employee) => (
                <option key={employee._id} value={employee.firstName}>
                  {employee.firstName} {employee.lastName}
                </option>
              ))}
            </select>
            {errors.assignee && (
              <p className="text-red-500 text-sm">{errors.assignee}</p>
            )}
          </div>
          <InputField
            label="Category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            error={errors.category}
          />
        </div>

        <div className="flex flex-col w-full lg:w-1/2 mt-4 lg:mt-0">
          <TextAreaField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            error={errors.description}
          />
          <button
            className="w-full p-2 rounded-full text-white bg-blue-500 mt-4 hover:bg-transparent border-transparent border hover:border-white duration-200"
            type="submit"
          >
            Create Task
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTask;
