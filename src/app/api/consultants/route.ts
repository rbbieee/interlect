import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  try {
    // 1. Find and auto-register any missing @interlect.com users as Consultants
    const [missingConsultants]: any = await db.query(`
      SELECT name, email FROM user 
      WHERE email LIKE '%@interlect.com' 
      AND email NOT IN (SELECT email FROM Consultant)
    `);

    if (Array.isArray(missingConsultants) && missingConsultants.length > 0) {
      for (const user of missingConsultants) {
        await db.query(
          "INSERT INTO Consultant (name, expertise, rating, email) VALUES (?, ?, ?, ?)",
          [user.name, "Educational Admissions", 5.0, user.email]
        );
      }
    }

    // 2. Return the full consultant list
    const [rows]: any = await db.query(
      "SELECT consultant_id as id, name, expertise, rating, email FROM Consultant"
    );
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error fetching consultants:", error);
    return NextResponse.json({ error: "Failed to fetch consultants" }, { status: 500 });
  }
}
