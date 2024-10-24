import { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the CSS for react-toastify

const AllTask = () => {
  const [tasks, setTasks] = useState([]); // State to store tasks
  const [loading, setLoading] = useState(true); // State for loading status
  const [error, setError] = useState(null); // State for error handling
  const [filterOption, setFilterOption] = useState(""); // State for unified filter

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_LOCALHOST_URL}/api/tasks`
        );
        setTasks(response.data); // Set tasks from API response
      } catch (error) {
        setError("Failed to fetch tasks"); // Handle error
        console.error(error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchTasks(); // Call the fetch function
  }, []); // Empty dependency array means this runs once when the component mounts

  // Separate the filter and sort options
  const filterAndSortTasks = () => {
    let filteredTasks = [...tasks];

    if (filterOption) {
      const [sortOrder] = filterOption.split(" - ");

      // Sort tasks based on sort order
      filteredTasks.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);

        return sortOrder === "Newest First" ? dateB - dateA : dateA - dateB; // Sort by date
      });
    }

    return filteredTasks;
  };

  // Delete task function
  const deleteTask = async (taskId) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_LOCALHOST_URL}/api/tasks/${taskId}`
      );
      setTasks(tasks.filter((task) => task._id !== taskId)); // Remove the task from the UI

      // Show success toast notification
      toast.success("Task deleted successfully!", {
        autoClose: 1000,
      });
    } catch (error) {
      console.error("Failed to delete task", error);
      setError("Failed to delete task");
      // Show error toast notification
      toast.error("Failed to delete task", {
        autoClose: 1000,
      });
    }
  };

  const sortedTasks = filterAndSortTasks();

  if (loading) {
    return <div className="text-center">Loading...</div>; // Loading state
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>; // Error state
  }

  return (
    <div className="mt-10 pb-20 shadow-3xl rounded-2xl">
      {/* Toast Container */}
      <ToastContainer />

      {/* Filter Dropdown */}
      <div className="flex justify-end p-4">
        <select
          value={filterOption}
          onChange={(e) => setFilterOption(e.target.value)}
          className="p-2 border bg-gray-800 text-white border-gray-600 rounded-md shadow-sm appearance-none focus:outline-none focus:ring focus:ring-blue-300 transition duration-150 ease-in-out"
        >
          <option value="">Select Sort Option</option>
          <option value="Newest First">Sort by Date (Newest First)</option>
          <option value="Oldest First">Sort by Date (Oldest First)</option>
        </select>
        {/* Custom dropdown arrow */}
        <div className="absolute right-5 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <svg
            className="w-4 h-4 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      {/* Header */}
      <header className="grid grid-cols-1 md:grid-cols-5 text-xs lg:text-base justify-items-center bg-black/80 text-white p-5 rounded-t-lg shadow-md">
        <h1 className="font-semibold mb-2 sm:mb-0">Employee Name</h1>
        <h1 className="font-semibold mb-2 sm:mb-0">Date Assigned</h1>
        <h1 className="font-semibold mb-2 sm:mb-0">Assigned Task</h1>
        <h1 className="font-semibold mb-2 sm:mb-0">Category</h1>
        <h1 className="font-semibold mb-2 sm:mb-0">Status</h1>
      </header>

      {/* Task List */}
      <div
        id="alltask"
        className="px-3 py-4 bg-black/70 rounded-b-lg h-64 overflow-y-auto"
      >
        {sortedTasks.map((task) => (
          <div
            key={task._id} // Use unique task ID as key
            className="grid grid-cols-1 md:grid-cols-5 p-4 mb-4 rounded-lg shadow-lg border border-gray-700 hover:bg-gray-700 transition duration-200 relative"
          >
            <h2 className="font-medium text-white text-center">
              {task.assignee} {/* Display employee name */}
            </h2>
            <h2 className="font-medium text-white text-center">
              {new Date(task.date).toLocaleDateString("en-GB")}{" "}
              {/* Format date as day/month/year */}
            </h2>
            <h3 className="font-medium text-white text-center">
              {task.taskTitle} {/* Display task title */}
            </h3>
            <h3 className="font-medium text-white text-center">
              {task.category} {/* Display category */}
            </h3>
            <div className="flex items-center justify-center">
              <span className="text-sm font-semibold text-center">
                {task.status === "Accepted" && (
                  <span className="inline-block bg-blue-500 text-white rounded-full px-2 py-1">
                    Accepted
                  </span>
                )}
                {task.status === "In Progress" && (
                  <span className="inline-block bg-yellow-500 text-white rounded-full px-2 py-1">
                    In Progress
                  </span>
                )}
                {task.status === "Completed" && (
                  <span className="inline-block bg-green-500 text-white rounded-full px-2 py-1">
                    Completed
                  </span>
                )}
                {task.status === "Rejected" && (
                  <span className="inline-block bg-red-500 text-white rounded-full px-2 py-1">
                    Rejected
                  </span>
                )}
              </span>
              {/* Delete Button */}
              <button
                className="absolute top-5 right-5 text-white cursor-pointer"
                onClick={() => deleteTask(task._id)}
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllTask;
