import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json({ error: "Missing email parameter" }, { status: 400 });
  }

  try {
    // 1. Get consultantId
    const [consultantRows]: any = await db.query(
      "SELECT consultant_id FROM Consultant WHERE email = ?",
      [email]
    );

    if (consultantRows.length === 0) {
      return NextResponse.json({ error: "Consultant not found" }, { status: 404 });
    }

    const consultantId = consultantRows[0].consultant_id;

    // 2. Query distinct students/users with latest message
    const [conversations]: any = await db.query(
      `SELECT u.user_id as userId, u.name as userName, u.email as userEmail, ch.message, ch.timestamp, ch.sender
       FROM user u
       JOIN ChatHistory ch ON u.user_id = ch.user_id
       WHERE ch.consultant_id = ?
         AND ch.timestamp = (
             SELECT MAX(timestamp)
             FROM ChatHistory
             WHERE user_id = u.user_id AND consultant_id = ?
         )
       ORDER BY ch.timestamp DESC`,
      [consultantId, consultantId]
    );

    return NextResponse.json(conversations);
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
