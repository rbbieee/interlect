import { NextResponse } from "next/server";
import db from "../../../lib/db";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json({ error: "Missing email parameter" }, { status: 400 });
  }

  try {
    const [rows] = await db.query(
      "SELECT user_id as userId, name, email FROM user WHERE email = ?",
      [email]
    );

    if (rows.length > 0) {
      return NextResponse.json(rows[0]);
    } else {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
  } catch (error) {
    console.error("Error fetching user info:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
