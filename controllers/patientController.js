
const pool = require("../config/db");

// CREATE PATIENT
const createPatient = async (req, res) => {
  const { name, age, gender, phone, address } = req.body;

  if (typeof name !== "string" || !name.trim()) {
    return res.status(400).json({
      message: "Patient name is required",
    });
  }

  if (
    age !== undefined &&
    age !== null &&
    (!Number.isInteger(age) || age < 0 || age > 150)
  ) {
    return res.status(400).json({
      message: "Age must be an integer between 0 and 150",
    });
  }

  try {
    const result = await pool.query(
      `INSERT INTO patients
       (name, age, gender, phone, address, created_by)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        name.trim(),
        age ?? null,
        gender ?? null,
        phone ?? null,
        address ?? null,
        req.user.id,
      ]
    );

    return res.status(201).json({
      message: "Patient created successfully",
      patient: result.rows[0],
    });
  } catch (error) {
    console.error("Create patient error:", error.message);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// GET ALL PATIENTS CREATED BY LOGGED-IN USER
const getPatients = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM patients
       WHERE created_by = $1
       ORDER BY id DESC`,
      [req.user.id]
    );

    return res.status(200).json({
      count: result.rows.length,
      patients: result.rows,
    });
  } catch (error) {
    console.error("Get patients error:", error.message);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// GET ONE PATIENT
const getPatientById = async (req, res) => {
  const { id } = req.params;

  if (!/^[1-9]\d*$/.test(id)) {
    return res.status(400).json({
      message: "Invalid patient ID",
    });
  }

  try {
    const result = await pool.query(
      `SELECT * FROM patients
       WHERE id = $1 AND created_by = $2`,
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Patient not found",
      });
    }

    return res.status(200).json({
      patient: result.rows[0],
    });
  } catch (error) {
    console.error("Get patient error:", error.message);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// UPDATE PATIENT
const updatePatient = async (req, res) => {
  const { id } = req.params;
  const { name, age, gender, phone, address } = req.body;

  if (!/^[1-9]\d*$/.test(id)) {
    return res.status(400).json({
      message: "Invalid patient ID",
    });
  }

  if (
    name !== undefined &&
    (typeof name !== "string" || !name.trim())
  ) {
    return res.status(400).json({
      message: "Name cannot be empty",
    });
  }

  if (
    age !== undefined &&
    age !== null &&
    (!Number.isInteger(age) || age < 0 || age > 150)
  ) {
    return res.status(400).json({
      message: "Age must be an integer between 0 and 150",
    });
  }

  const allowedFields = ["name", "age", "gender", "phone", "address"];
  const hasUpdates = allowedFields.some(
    (field) => req.body[field] !== undefined
  );

  if (!hasUpdates) {
    return res.status(400).json({
      message: "Provide at least one field to update",
    });
  }

  try {
    const result = await pool.query(
      `UPDATE patients
       SET name = COALESCE($1, name),
           age = CASE WHEN $2 THEN $3 ELSE age END,
           gender = COALESCE($4, gender),
           phone = COALESCE($5, phone),
           address = COALESCE($6, address)
       WHERE id = $7 AND created_by = $8
       RETURNING *`,
      [
        name === undefined ? null : name.trim(),
        age !== undefined,
        age ?? null,
        gender ?? null,
        phone ?? null,
        address ?? null,
        id,
        req.user.id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Patient not found",
      });
    }

    return res.status(200).json({
      message: "Patient updated successfully",
      patient: result.rows[0],
    });
  } catch (error) {
    console.error("Update patient error:", error.message);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// DELETE PATIENT
const deletePatient = async (req, res) => {
  const { id } = req.params;

  if (!/^[1-9]\d*$/.test(id)) {
    return res.status(400).json({
      message: "Invalid patient ID",
    });
  }

  try {
    const result = await pool.query(
      `DELETE FROM patients
       WHERE id = $1 AND created_by = $2
       RETURNING id`,
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Patient not found",
      });
    }

    return res.status(200).json({
      message: "Patient deleted successfully",
    });
  } catch (error) {
    console.error("Delete patient error:", error.message);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

module.exports = {
  createPatient,
  getPatients,
  getPatientById,
  updatePatient,
  deletePatient,
};
