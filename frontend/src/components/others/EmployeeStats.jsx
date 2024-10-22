import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import axios from "axios";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables); // Register Chart.js components

const EmployeeStats = () => {
  const [taskStats, setTaskStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTaskStats = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_LOCALHOST_URL}/api/tasks`
        );
        const tasks = response.data;

        const stats = {
          Accepted: 0,
          "In Progress": 0,
          Completed: 0,
          Rejected: 0,
        };

        tasks.forEach((task) => {
          stats[task.status]++;
        });

        setTaskStats(stats);
      } catch (error) {
        setError("Failed to fetch task statistics");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchTaskStats();
  }, []);

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  const pieData = {
    labels: Object.keys(taskStats),
    datasets: [
      {
        data: Object.values(taskStats),
        backgroundColor: [
          "rgba(54, 162, 235, 0.6)", // Blue
          "rgba(255, 206, 86, 0.6)", // Yellow
          "rgba(75, 192, 192, 0.6)", // Teal
          "rgba(255, 99, 132, 0.6)", // Red
        ],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "white", // Set label text color to white
        },
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => `${tooltipItem.label}: ${tooltipItem.raw}`,
        },
      },
    },
    elements: {
      arc: {
        borderWidth: 0, // Optional: remove border around pie slices
      },
    },
  };

  return (
    <div className="flex flex-col items-center shadow backdrop-blur-3xl bg-black/80 p-6 rounded-lg ">
      <h2 className="lg:text-3xl text-lg font-semibold mb-6 text-white">
        Employees Task Statistics
      </h2>

      <div className="w-full max-w-3xl bg-transparent rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <Pie data={pieData} options={chartOptions} height={300} />
        </div>
      </div>
    </div>
  );
};

export default EmployeeStats;
