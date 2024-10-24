import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify"; // Import toast and ToastContainer
import "react-toastify/dist/ReactToastify.css"; // Import styles

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false); // Loading state

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_LOCALHOST_URL}/api/signup`,
        formData
      );
      console.log(response.data);
      // Clear form after successful submission
      setFormData({ firstName: "", lastName: "", email: "", password: "" });
      // Show success toast
      toast.success("Employee registered successfully!");
      // Redirect to login page
      navigate("/login"); // Redirect to login page instead of home
    } catch (error) {
      console.error("Error registering employee:", error.response?.data);
      // Show error toast
      toast.error(
        error.response?.data?.message || "An error occurred during signup"
      );
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    <div id="signup" className="flex h-screen items-center justify-center ">
      <div className="bg-white/50 shadow-lg rounded-lg p-5 w-full mx-5 lg:mx-0 lg:w-1/3">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Welcome to WorkSphereX!
        </h2>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center gap-6"
        >
          <div className="w-full">
            <label className="block text-gray-700 mb-2" htmlFor="firstName">
              First Name
            </label>
            <input
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              type="text"
              className="px-4 py-2 rounded-lg w-full text-lg border border-gray-300 outline-none transition duration-200"
              placeholder="Enter your first name"
            />
          </div>
          <div className="w-full">
            <label className="block text-gray-700 mb-2" htmlFor="lastName">
              Last Name
            </label>
            <input
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              type="text"
              className="px-4 py-2 rounded-lg w-full text-lg border border-gray-300 outline-none transition duration-200"
              placeholder="Enter your last name"
            />
          </div>
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
            disabled={loading} // Disable button while loading
            className={`bg-blue-600 text-white px-6 py-2 flex items-center justify-center rounded-md hover:bg-blue-500 transition duration-200 transform w-full ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>
        <p className="text-center mt-4 text-neutral-600">
          Already have an account?
          <Link to="/login" className="text-blue-600 ml-2 hover:underline">
            Login
          </Link>
        </p>
      </div>
      <ToastContainer
        position="top-right" // Position of the toast notifications
        autoClose={3000} // Duration in milliseconds for auto-close
        hideProgressBar={false} // Show or hide the progress bar
        newestOnTop={false} // Position newest toast notifications on top
        closeOnClick // Close notification on click
        rtl={false} // Enable right-to-left layout if necessary
        pauseOnFocusLoss // Pause auto-close on window focus loss
        draggable // Allow toasts to be draggable
        pauseOnHover // Pause auto-close on hover
      />
    </div>
  );
};

export default SignUp;
