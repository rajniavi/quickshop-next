// import mysql from "mysql2/promise";

// export const pool = mysql.createPool({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0,
// });
import mysql from "mysql2/promise";
import fs from "fs";

const isTiDB = String(process.env.DB_PORT) === "4000";

export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  ...(isTiDB && {
    ssl: {
      ca: fs.readFileSync("C:/certs/ca.pem"),
      rejectUnauthorized: true,
    },
  }),

  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0,
});