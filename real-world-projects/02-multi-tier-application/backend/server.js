const express = require("express");
const { Pool } = require("pg");

const app = express();
const PORT = process.env.PORT || 8080;

const pool = new Pool({
  host: process.env.DB_HOST || "postgres-service",
  port: Number(process.env.DB_PORT || 5432),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionTimeoutMillis: 3000,
});

// Check if the backend API is running
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "UP",
    service: "backend",
  });
});

// Check PostgreSQL connectivity
app.get("/db-health", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW() AS current_time");

    res.status(200).json({
      status: "CONNECTED",
      databaseTime: result.rows[0].current_time,
    });
  } catch (error) {
    console.error("Database health check failed:", error.message);

    res.status(503).json({
      status: "DATABASE_UNAVAILABLE",
    });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend API listening on port ${PORT}`);
});
