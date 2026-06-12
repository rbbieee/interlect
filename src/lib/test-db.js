const mysql = require('mysql2/promise');

async function run() {
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: process.env.DB_PASSWORD || "",
    database: "interlect_db",
  });

  try {
    console.log("Connected to database successfully.");
    
    // Check if consultant_id exists in Review table
    const [columns] = await connection.query("SHOW COLUMNS FROM Review");
    const hasConsultantId = columns.some(col => col.Field === 'consultant_id');
    
    if (!hasConsultantId) {
      console.log("Review table does not have 'consultant_id'. Altering table...");
      await connection.query(`
        ALTER TABLE Review 
        ADD COLUMN consultant_id INT NULL,
        ADD CONSTRAINT fk_review_consultant FOREIGN KEY (consultant_id) REFERENCES Consultant(consultant_id) ON DELETE CASCADE
      `);
      console.log("Review table altered successfully: added consultant_id.");
    } else {
      console.log("Review table already has 'consultant_id'. No migration needed.");
    }
  } catch (err) {
    console.error("Database connection or migration error:", err);
  } finally {
    await connection.end();
  }
}

run();
