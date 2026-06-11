import { NextResponse } from "next/server";
import db from "../../../lib/db";

export async function GET() {
  try {
    const [rows] = await db.query(
      "SELECT consultant_id as id, name, expertise, rating FROM Consultant"
    );
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error fetching consultants:", error);
    return NextResponse.json({ error: "Failed to fetch consultants" }, { status: 500 });
  }
}
