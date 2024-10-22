const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const app = express();

// Middleware
const corsOptions = {
  origin: ["http://localhost:5173", "https://workspherex.netlify.app"],
  methods: "POST, PATCH, GET, PUT, DELETE",
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json()); // To parse JSON request bodies
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI);

// MongoDB connection success and error handling
mongoose.connection.on("connected", () => {
  console.log("MongoDB connected successfully");
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

// Employee Schema
const employeeSchema = new mongoose.Schema({
  employeeId: { type: String, unique: true }, // Unique employee ID
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Create the Employee model
const Employee = mongoose.model("Employee", employeeSchema);

// In-memory blacklist to store invalidated tokens
const tokenBlacklist = [];

// Function to generate a unique employee ID
const generateEmployeeId = async () => {
  let employeeId;
  const prefix = "EMP";
  const randomNumber = Math.floor(Math.random() * 100000); // Random number
  employeeId = `${prefix}${randomNumber}`;

  const existingEmployee = await Employee.findOne({ employeeId });
  return existingEmployee ? generateEmployeeId() : employeeId; // Regenerate if not unique
};

// Define a list of admin emails
const adminEmails = ["pb.saikrishnateja@gmail.com"];

// Signup Route
app.post("/api/signup", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    const existingEmployee = await Employee.findOne({ email });
    if (existingEmployee) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const newEmployeeId = await generateEmployeeId(); // Generate unique ID
    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

    const newEmployee = new Employee({
      employeeId: newEmployeeId,
      firstName,
      lastName,
      email,
      password: hashedPassword, // Store hashed password
    });
    await newEmployee.save();
    res.status(201).json({ message: "Employee registered successfully" });
  } catch (error) {
    console.error("Error registering employee:", error);
    res.status(500).json({ message: "Error registering employee", error });
  }
});

// Login Route
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const employee = await Employee.findOne({ email });
    if (!employee) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const passwordMatch = await bcrypt.compare(password, employee.password); // Compare hashed password
    if (!passwordMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Assign role based on the email
    const role = adminEmails.includes(email) ? "admin" : "employee";

    // Sign the JWT token with the user ID and role
    const token = jwt.sign({ id: employee._id, role }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({
      token,
      employee: {
        id: employee._id,
        employeeId: employee.employeeId,
        firstName: employee.firstName,
        lastName: employee.lastName,
        email: employee.email,
        role, // Include the role in the response
      },
    });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Logout Route
app.post("/api/logout", (req, res) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Extract token from the Authorization header
  if (token) {
    // Add token to blacklist
    tokenBlacklist.push(token);
    return res.status(200).json({ message: "Logged out successfully" });
  }

  res.status(400).json({ message: "No token provided" });
});

// Middleware to verify tokens and check against blacklist
const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token || tokenBlacklist.includes(token)) {
    return res.sendStatus(401); // Unauthorized if token is missing or blacklisted
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, employee) => {
    if (err) return res.sendStatus(403); // Forbidden if token is invalid
    req.employee = employee;
    next(); // Proceed to the next middleware or route handler
  });
};

// Fetch only employees (excluding admins and a specific email)
app.get("/api/employees", async (req, res) => {
  try {
    // Exclude the employee with the specified email and only fetch regular employees
    const employees = await Employee.find({
      email: { $ne: "pb.saikrishnateja@gmail.com" },
    });

    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch employees", error });
  }
});

// Create Task schema
const taskSchema = new mongoose.Schema(
  {
    taskTitle: { type: String, required: true },
    date: { type: Date, required: true },
    assignee: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ["Accepted", "In Progress", "Completed", "Rejected"], // Changed from "Accept" to "Accepted"
      default: "Accepted", // Default status is also updated
    },
  },
  { timestamps: true }
); // Include timestamps

// Task model
const Task = mongoose.model("Task", taskSchema);

// Create a new task
app.post("/api/tasks", async (req, res) => {
  try {
    const { taskTitle, date, assignee, category, description } = req.body;

    const newTask = new Task({
      taskTitle,
      date,
      assignee,
      category,
      description,
    });

    const savedTask = await newTask.save(); // Save and get the created task
    res
      .status(201)
      .json({ message: "Task created successfully", task: savedTask });
  } catch (error) {
    console.error("Failed to create task:", error);
    res.status(500).json({ message: "Failed to create task", error });
  }
});

// Show all tasks
app.get("/api/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks); // Returns all tasks
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

// Update task status
app.patch("/api/tasks/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    if (!updatedTask)
      return res.status(404).json({ message: "Task not found." });
    res.status(200).json(updatedTask);
  } catch (error) {
    console.error("Failed to update task status:", error);
    res.status(500).json({ message: "Failed to update task status." });
  }
});

app.delete("/api/tasks/:id", async (req, res) => {
  const { id } = req.params;

  // Check if the ID is valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid Task ID" });
  }

  try {
    const task = await Task.findByIdAndDelete(id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
