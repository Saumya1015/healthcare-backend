
const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  assignDoctor,
  getMappings,
  getPatientMappings,
  deleteMapping,
} = require("../controllers/mappingController");

// All mapping endpoints require JWT authentication
router.use(authMiddleware);

// Assign a doctor to a patient
router.post("/", assignDoctor);

// Get all mappings for the logged-in user's patients
router.get("/", getMappings);

// Get doctors assigned to a particular patient
router.get("/:patient_id", getPatientMappings);

// Remove an assignment using its mapping ID
router.delete("/:id", deleteMapping);

module.exports = router;
