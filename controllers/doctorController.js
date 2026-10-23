
const pool = require("../config/db");

// CREATE DOCTOR
const createDoctor = async (req, res) => {
  const { name, specialization, email, phone } = req.body;

  if (
    typeof name !== "string" || !name.trim() ||
    typeof specialization !== "string" || !specialization.trim()
  ) {
    return res.status(400).json({
      message: "Doctor name and specialization are required",
    });
  }

  if (
    email !== undefined &&
    email !== null &&
    (typeof email !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
  ) {
    return res.status(400).json({
      message: "Enter a valid email address",
    });
  }

  try {
    const result = await pool.query(
      `INSERT INTO doctors (name, specialization, email, phone)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [
        name.trim(),
        specialization.trim(),
        email ? email.trim().toLowerCase() : null,
        phone ?? null,
      ]
    );

    return res.status(201).json({
      message: "Doctor created successfully",
      doctor: result.rows[0],
    });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({
        message: "A doctor with this email already exists",
      });
    }

    console.error("Create doctor error:", error.message);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// GET ALL DOCTORS
const getDoctors = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM doctors ORDER BY id DESC"
    );

    return res.status(200).json({
      count: result.rows.length,
      doctors: result.rows,
    });
  } catch (error) {
    console.error("Get doctors error:", error.message);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// GET DOCTOR BY ID
const getDoctorById = async (req, res) => {
  const { id } = req.params;

  if (!/^[1-9]\d*$/.test(id)) {
    return res.status(400).json({
      message: "Invalid doctor ID",
    });
  }

  try {
    const result = await pool.query(
      "SELECT * FROM doctors WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Doctor not found",
      });
    }

    return res.status(200).json({
      doctor: result.rows[0],
    });
  } catch (error) {
    console.error("Get doctor error:", error.message);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// UPDATE DOCTOR
const updateDoctor = async (req, res) => {
  const { id } = req.params;
  const { name, specialization, email, phone } = req.body;

  if (!/^[1-9]\d*$/.test(id)) {
    return res.status(400).json({
      message: "Invalid doctor ID",
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
    specialization !== undefined &&
    (typeof specialization !== "string" || !specialization.trim())
  ) {
    return res.status(400).json({
      message: "Specialization cannot be empty",
    });
  }

  if (
    email !== undefined &&
    email !== null &&
    (typeof email !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
  ) {
    return res.status(400).json({
      message: "Enter a valid email address",
    });
  }

  if (
    !["name", "specialization", "email", "phone"].some(
      (field) => req.body[field] !== undefined
    )
  ) {
    return res.status(400).json({
      message: "Provide at least one field to update",
    });
  }

  try {
    const result = await pool.query(
      `UPDATE doctors
       SET name = COALESCE($1, name),
           specialization = COALESCE($2, specialization),
           email = CASE WHEN $3 THEN $4 ELSE email END,
           phone = CASE WHEN $5 THEN $6 ELSE phone END
       WHERE id = $7
       RETURNING *`,
      [
        name === undefined ? null : name.trim(),
        specialization === undefined ? null : specialization.trim(),
        email !== undefined,
        email === null ? null : (email === undefined ? null : email.trim().toLowerCase()),
        phone !== undefined,
        phone ?? null,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Doctor not found",
      });
    }

    return res.status(200).json({
      message: "Doctor updated successfully",
      doctor: result.rows[0],
    });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({
        message: "A doctor with this email already exists",
      });
    }

    console.error("Update doctor error:", error.message);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// DELETE DOCTOR
const deleteDoctor = async (req, res) => {
  const { id } = req.params;

  if (!/^[1-9]\d*$/.test(id)) {
    return res.status(400).json({
      message: "Invalid doctor ID",
    });
  }

  try {
    const result = await pool.query(
      "DELETE FROM doctors WHERE id = $1 RETURNING id",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Doctor not found",
      });
    }

    return res.status(200).json({
      message: "Doctor deleted successfully",
    });
  } catch (error) {
    console.error("Delete doctor error:", error.message);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

module.exports = {
  createDoctor,
  getDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
};
