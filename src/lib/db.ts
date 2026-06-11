import mysql from "mysql2/promise";

const db: mysql.Pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: process.env.DB_PASSWORD || "", // Laragon default password is empty
  database: "interlect_db",
});

export default db;
