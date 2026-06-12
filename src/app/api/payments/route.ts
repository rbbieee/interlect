import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "Missing userId parameter" }, { status: 400 });
  }

  try {
    const [rows]: any = await db.query(
      `SELECT 
        p.payment_id as paymentId,
        p.amount,
        p.status as paymentStatus,
        p.payment_date as paymentDate,
        a.status as applicationStatus,
        pr.name as programName,
        u.name as universityName
      FROM Payment p
      LEFT JOIN Application a ON p.application_id = a.application_id
      LEFT JOIN Program pr ON a.program_id = pr.program_id
      LEFT JOIN University u ON pr.university_id = u.university_id
      WHERE p.user_id = ?
      ORDER BY p.payment_date DESC`,
      [userId]
    );

    return NextResponse.json({ payments: rows });
  } catch (error) {
    console.error("Error fetching user payments:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
