import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios"; // Import Axios
import { ToastContainer, toast } from "react-toastify"; // Import ToastContainer and toast
import "react-toastify/dist/ReactToastify.css"; // Import Toast styles
import { useAuth } from "../Context/AuthContext";

const LogIn = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const { login } = useAuth(); // Use the login method from AuthContext
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false); // Loading state

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true); // Set loading to true

    try {
      // Use Axios to send a POST request to the login endpoint
      const response = await axios.post(
        `${import.meta.env.VITE_LOCALHOST_URL}/api/login`,
        formData
      );

      // If the response is successful
      if (response.status === 200) {
        const data = response.data;
        // Save the token and role in local storage
        login(data.token, data.employee.role); // Use login method from AuthContext
        toast.success("Login successful! Redirecting to dashboard...");

        // Redirect based on role
        if (data.employee.role === "admin") {
          navigate("/admin"); // Redirect to Admin Dashboard
        } else {
          navigate("/employee"); // Redirect to Employee Dashboard
        }
      }
    } catch (error) {
      // Show error toast
      toast.error(
        "Login failed: " + (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false); // Reset loading state
    }

    // Reset form data only after a successful submission
    setFormData({ email: "", password: "" });
  };

  return (
    <div id="login" className="flex h-screen items-center justify-center ">
      <div className="bg-white/50 shadow-lg rounded-lg p-5 w-full mx-5 lg:mx-0 lg:w-1/3">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Welcome to WorkSphereX!
        </h2>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center gap-6"
        >
          <div className="w-full">
            <label className="block text-gray-700 mb-2" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              type="email"
              className="px-4 py-2 rounded-lg w-full text-lg border border-gray-300 outline-none transition duration-200"
              placeholder="Enter your email"
            />
          </div>
          <div className="w-full">
            <label className="block text-gray-700 mb-2" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              type="password"
              className="px-4 py-2 rounded-lg w-full text-lg border border-gray-300 outline-none transition duration-200"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-500 transition duration-200 transform w-full"
            disabled={loading} // Disable button while loading
          >
            {loading ? "Logging in..." : "Login"} {/* Change button text */}
          </button>
        </form>
        <p className="text-center mt-4 text-neutral-600">
          Dont have an account?
          <Link to="/signup" className="text-blue-600 ml-2 hover:underline">
            Signup
          </Link>
        </p>
      </div>
      <ToastContainer />
    </div>
  );
};

export default LogIn;
