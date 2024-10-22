import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../../Context/AuthContext";

const Header = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [userNames, setUserNames] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [defaultUserName, setDefaultUserName] = useState("Krishna Teja 👋");

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_LOCALHOST_URL}/api/employees`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        // Set user names based on the role
        const userRole = localStorage.getItem("role");
        if (userRole === "employee") {
          // Admin sees all employee names
          setUserNames(
            data.map(({ firstName, lastName }) => `${firstName} ${lastName}`)
          );
        } else if (userRole === "admin") {
          // Employee sees only their name
          const currentUser = data.find(
            (user) => user._id === localStorage.getItem("userId")
          );
          if (currentUser) {
            setUserNames([`${currentUser.firstName} ${currentUser.lastName}`]);
          }
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        toast.error("Failed to load user data");
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_LOCALHOST_URL}/api/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      logout();
      toast.success("Logged out successfully!");
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error(
        "Logout failed: " + (error.response?.data?.message || error.message)
      );
    }
  };

  return (
    <div className="flex justify-between items-center shadow-3xl backdrop-blur-3xl rounded-full bg-black/80 text-white px-6 lg:px-8 py-2 lg:py-5">
      <h1 className="text-sm lg:text-xl">
        Hello <br />
        <span className="lg:text-2xl text-md font-semibold">
          {userNames.length > 0
            ? `${userNames.join(", ")} 👋`
            : defaultUserName}
        </span>
      </h1>
      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-transparent border border-transparent hover:border-white text-white lg:px-4 px-2 lg:py-2 py-1 text-xs lg:text-base rounded-full"
      >
        Log Out
      </button>
    </div>
  );
};

export default Header;
