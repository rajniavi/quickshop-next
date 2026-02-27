import mysql from "mysql2/promise";

export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: 4000, // 🔥 force 4000 explicitly
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  ssl: {}, // 🔥 THIS enables TLS properly for TiDB

  waitForConnections: true,
  connectionLimit: 5,
});