/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import axios from "axios";
import { FaUser, FaCalendarAlt } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TaskCard = ({
  bgColor,
  priorityColor,
  priority,
  date,
  title,
  description,
  assignee,
  _id,
  currentStatus,
  onUpdateStatus,
}) => {
  const [status, setStatus] = useState(currentStatus);

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
  };

  const handleUpdateClick = () => {
    onUpdateStatus(_id, status);
  };

  return (
    <div
      className={`lg:min-w-[400px] w-full h-[350px] ${bgColor} p-4 rounded-lg shadow-md flex flex-col justify-between`}
    >
      <div className="flex justify-between items-center mb-4">
        <h3
          className={`${priorityColor} text-xs font-semibold px-2 py-1 rounded-full`}
        >
          {priority}
        </h3>
        <h4 className="text-xs text-neutral-400 flex items-center">
          <FaCalendarAlt className="mr-1" />
          {new Date(date).toLocaleDateString()}
        </h4>
      </div>
      <h2 className="text-lg font-bold text-neutral-100">{title}</h2>
      <p className="mt-2 text-sm text-neutral-300 line-clamp-3">
        {description}
      </p>
      <div className="mt-auto">
        <p className="text-sm text-neutral-300 flex items-center">
          <FaUser className="mr-1" />
          <strong>Assigned to:</strong>
          <span className="ml-1">{assignee}</span>
        </p>
      </div>
      <div className="mt-4">
        <label className="text-sm text-neutral-300">Status:</label>
        <select
          value={status}
          onChange={handleStatusChange}
          className="w-full p-2 rounded border border-neutral-600 bg-neutral-800 text-white outline-none mt-2"
        >
          <option value="Accepted">Accepted</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
          <option value="Rejected">Rejected</option>
        </select>
        <button
          onClick={handleUpdateClick}
          className="mt-3 w-full p-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          Update
        </button>
      </div>
    </div>
  );
};

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_LOCALHOST_URL}/api/tasks`
        );
        setTasks(data);
      } catch {
        setError("Failed to fetch tasks.");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_LOCALHOST_URL}/api/tasks/${taskId}`,
        {
          status: newStatus,
        }
      );
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === taskId ? { ...task, status: newStatus } : task
        )
      );
      toast.success("Task status updated successfully!");
    } catch (err) {
      toast.error("Failed to update task status.", err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div
      id="tasklist"
      className="flex lg:flex-row flex-col  lg:overflow-x-auto gap-5  w-full mt-10"
    >
      {tasks.length > 0 ? (
        tasks.map(
          ({
            _id,
            date,
            taskTitle,
            description,
            assignee,
            category,
            status,
          }) => (
            <TaskCard
              key={_id}
              bgColor="bg-black/80"
              priorityColor="bg-red-500"
              priority={category}
              date={date}
              title={taskTitle}
              description={description}
              assignee={assignee}
              _id={_id}
              currentStatus={status}
              onUpdateStatus={updateTaskStatus}
            />
          )
        )
      ) : (
        <div className="text-white">No tasks available.</div>
      )}
      <ToastContainer autoClose={1000} />
    </div>
  );
};

export default TaskList;
