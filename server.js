

require("dotenv").config();

const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const patientRoutes = require("./routes/patientRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const mappingRoutes = require("./routes/mappingRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Authentication routes
app.use("/api/auth", authRoutes);

// Patient routes
app.use("/api/patients", patientRoutes);

// Doctor routes
app.use("/api/doctors", doctorRoutes);

// Patient-Doctor mapping routes
app.use("/api/mappings", mappingRoutes);

// Home route
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Healthcare Backend API is running successfully!",
  });
});

// Handle invalid routes
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
