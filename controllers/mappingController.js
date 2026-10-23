

const pool = require("../config/db");

// 1. ASSIGN DOCTOR TO PATIENT
const assignDoctor = async (req, res) => {
  const { patient_id, doctor_id } = req.body;

  if (
    !Number.isInteger(patient_id) ||
    patient_id <= 0 ||
    !Number.isInteger(doctor_id) ||
    doctor_id <= 0
  ) {
    return res.status(400).json({
      message: "Valid patient_id and doctor_id are required",
    });
  }

  try {
    // Check patient ownership
    const patient = await pool.query(
      `SELECT id FROM patients
       WHERE id = $1 AND created_by = $2`,
      [patient_id, req.user.id]
    );

    if (patient.rows.length === 0) {
      return res.status(404).json({
        message: "Patient not found",
      });
    }

    // Check doctor existence
    const doctor = await pool.query(
      "SELECT id FROM doctors WHERE id = $1",
      [doctor_id]
    );

    

    console.log("Received doctor_id:", doctor_id);
console.log("Doctor query result:", doctor.rows);



    if (doctor.rows.length === 0) {
      return res.status(404).json({
        message: "Doctor not found",
      });
    }

    // Insert mapping
    const result = await pool.query(
      `INSERT INTO patient_doctors (patient_id, doctor_id)
       VALUES ($1, $2)
       RETURNING id, patient_id, doctor_id, assigned_at`,
      [patient_id, doctor_id]
    );

    return res.status(201).json({
      message: "Doctor assigned to patient successfully",
      mapping: result.rows[0],
    });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({
        message: "This doctor is already assigned to this patient",
      });
    }

    console.error("Assign doctor error:", error.message);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// 2. GET ALL MAPPINGS FOR THE LOGGED-IN USER
const getMappings = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
         pd.id AS mapping_id,
         pd.patient_id,
         p.name AS patient_name,
         pd.doctor_id,
         d.name AS doctor_name,
         d.specialization,
         pd.assigned_at
       FROM patient_doctors pd
       JOIN patients p ON p.id = pd.patient_id
       JOIN doctors d ON d.id = pd.doctor_id
       WHERE p.created_by = $1
       ORDER BY pd.id DESC`,
      [req.user.id]
    );

    return res.status(200).json({
      count: result.rows.length,
      mappings: result.rows,
    });
  } catch (error) {
    console.error("Get mappings error:", error.message);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// 3. GET ALL DOCTORS ASSIGNED TO ONE PATIENT
const getPatientMappings = async (req, res) => {
  const { patient_id } = req.params;

  if (!/^[1-9]\d*$/.test(patient_id)) {
    return res.status(400).json({
      message: "Invalid patient ID",
    });
  }

  try {
    // Confirm patient belongs to logged-in user
    const patient = await pool.query(
      `SELECT id FROM patients
       WHERE id = $1 AND created_by = $2`,
      [patient_id, req.user.id]
    );

    if (patient.rows.length === 0) {
      return res.status(404).json({
        message: "Patient not found",
      });
    }

    const result = await pool.query(
      `SELECT
         pd.id AS mapping_id,
         pd.patient_id,
         pd.doctor_id,
         d.name AS doctor_name,
         d.specialization,
         d.email,
         d.phone,
         pd.assigned_at
       FROM patient_doctors pd
       JOIN doctors d ON d.id = pd.doctor_id
       WHERE pd.patient_id = $1
       ORDER BY pd.id DESC`,
      [patient_id]
    );

    return res.status(200).json({
      patient_id: Number(patient_id),
      count: result.rows.length,
      doctors: result.rows,
    });
  } catch (error) {
    console.error("Get patient mappings error:", error.message);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// 4. REMOVE A DOCTOR ASSIGNMENT BY MAPPING ID
const deleteMapping = async (req, res) => {
  const { id } = req.params;

  if (!/^[1-9]\d*$/.test(id)) {
    return res.status(400).json({
      message: "Invalid mapping ID",
    });
  }

  try {
    const result = await pool.query(
      `DELETE FROM patient_doctors pd
       USING patients p
       WHERE pd.patient_id = p.id
         AND pd.id = $1
         AND p.created_by = $2
       RETURNING pd.id, pd.patient_id, pd.doctor_id`,
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Mapping not found",
      });
    }

    return res.status(200).json({
      message: "Doctor assignment removed successfully",
      mapping: result.rows[0],
    });
  } catch (error) {
    console.error("Delete mapping error:", error.message);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

module.exports = {
  assignDoctor,
  getMappings,
  getPatientMappings,
  deleteMapping,
};


