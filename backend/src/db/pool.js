import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

export const pool = new Pool({
  host: process.env.POSTGRES_HOST || "localhost",
  port: Number(process.env.POSTGRES_PORT || 5432),
  database: process.env.POSTGRES_DB || "space_orbiters",
  user: process.env.POSTGRES_USER || "space_orbiters",
  password: process.env.POSTGRES_PASSWORD || "change_me",
  max: 10,
  idleTimeoutMillis: 30000
});

pool.on("error", (error) => {
  console.error("Unexpected PostgreSQL pool error:", error);
});
