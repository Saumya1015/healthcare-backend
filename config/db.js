

const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// Temporary debugging: check which database the backend uses
pool.query(
  "SELECT current_database() AS db, current_schema() AS schema"
)
  .then((result) => {
    console.log("Backend database:", result.rows[0]);
  })
  .catch((error) => {
    console.error("Database check failed:", error.message);
  });

// Check which doctors the backend can see
pool.query("SELECT id, name FROM doctors ORDER BY id")
  .then((result) => {
    console.log("Doctors visible to backend:", result.rows);
  })
  .catch((error) => {
    console.error("Doctors query failed:", error.message);
  });

module.exports = pool;
