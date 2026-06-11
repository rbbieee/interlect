import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json({ error: "Missing email parameter" }, { status: 400 });
  }

  try {
    const [rows]: any = await db.query(
      "SELECT user_id as userId, name, email FROM user WHERE email = ?",
      [email]
    );

    if (rows.length > 0) {
      const userData = rows[0];
      if (email.endsWith("@interlect.com")) {
        const [consultantRows]: any = await db.query(
          "SELECT expertise FROM Consultant WHERE email = ?",
          [email]
        );
        if (consultantRows.length > 0) {
          userData.expertise = consultantRows[0].expertise;
        }
      }
      return NextResponse.json(userData);
    } else {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
  } catch (error) {
    console.error("Error fetching user info:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
