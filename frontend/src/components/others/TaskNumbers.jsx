import { useEffect, useState } from "react";
import axios from "axios";

const TaskNumbers = () => {
  const [taskCounts, setTaskCounts] = useState({
    accepted: 0,
    inProgress: 0,
    completed: 0,
    rejected: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTaskCounts = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_LOCALHOST_URL}/api/tasks`
        );
        const tasks = response.data;

        const counts = {
          accepted: tasks.filter((task) => task.status === "Accepted").length,
          inProgress: tasks.filter((task) => task.status === "In Progress")
            .length,
          completed: tasks.filter((task) => task.status === "Completed").length,
          rejected: tasks.filter((task) => task.status === "Rejected").length,
        };

        setTaskCounts(counts);
      } catch (error) {
        setError("Failed to fetch task counts");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchTaskCounts();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="flex w-full lg:flex-nowrap flex-wrap text-white mt-10 justify-between gap-3 lg:gap-5">
      {/* Task Box - Accepted */}
      <div className="rounded-xl w-[48%] py-6 px-9 bg-blue-400 text-center sm:text-left">
        <h2 className="text-3xl font-semibold">{taskCounts.accepted}</h2>
        <h3 className="text-xl pt-2 font-medium">Accepted Task</h3>
      </div>

      {/* Task Box - In Progress */}
      <div className="rounded-xl w-[48%] py-6 px-9 bg-yellow-400 text-center sm:text-left">
        <h2 className="text-3xl font-semibold">{taskCounts.inProgress}</h2>
        <h3 className="text-xl pt-2 font-medium">In Progress</h3>
      </div>

      {/* Task Box - Completed */}
      <div className="rounded-xl w-[48%] py-6 px-9 bg-green-400 text-center sm:text-left">
        <h2 className="text-3xl font-semibold">{taskCounts.completed}</h2>
        <h3 className="text-xl pt-2 font-medium">Completed</h3>
      </div>

      {/* Task Box - Rejected */}
      <div className="rounded-xl w-[48%] py-6 px-9 bg-red-400 text-center sm:text-left">
        <h2 className="text-3xl font-semibold">{taskCounts.rejected}</h2>
        <h3 className="text-xl pt-2 font-medium">Rejected Task</h3>
      </div>
    </div>
  );
};

export default TaskNumbers;
