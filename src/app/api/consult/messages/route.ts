import { NextResponse } from "next/server";
import db from "@/lib/db";

// GET /api/consult/messages?userId=X&consultantId=Y
// OR GET /api/consult/messages?userId=X&consultantEmail=E
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  let consultantId = searchParams.get("consultantId");
  const consultantEmail = searchParams.get("consultantEmail");

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  try {
    // If consultantEmail is provided, find the consultantId first
    if (!consultantId && consultantEmail) {
      const [consultantRows]: any = await db.query(
        "SELECT consultant_id FROM Consultant WHERE email = ?",
        [consultantEmail]
      );
      if (consultantRows.length > 0) {
        consultantId = consultantRows[0].consultant_id;
      } else {
        return NextResponse.json({ error: "Consultant not found" }, { status: 404 });
      }
    }

    if (!consultantId) {
      return NextResponse.json({ error: "Missing consultantId or consultantEmail" }, { status: 400 });
    }

    // Query messages
    const [messages]: any = await db.query(
      "SELECT chat_id as id, user_id as userId, consultant_id as consultantId, message, timestamp, sender FROM ChatHistory WHERE user_id = ? AND consultant_id = ? ORDER BY timestamp ASC",
      [userId, consultantId]
    );

    return NextResponse.json(messages);
  } catch (error) {
    console.error("Error fetching chat messages:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

// POST /api/consult/messages
// Body: { userId, consultantId, consultantEmail, message, sender }
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, message, sender } = body;
    let consultantId = body.consultantId;
    const consultantEmail = body.consultantEmail;

    if (!userId || !message || !sender) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!consultantId && consultantEmail) {
      const [consultantRows]: any = await db.query(
        "SELECT consultant_id FROM Consultant WHERE email = ?",
        [consultantEmail]
      );
      if (consultantRows.length > 0) {
        consultantId = consultantRows[0].consultant_id;
      } else {
        return NextResponse.json({ error: "Consultant not found" }, { status: 404 });
      }
    }

    if (!consultantId) {
      return NextResponse.json({ error: "Missing consultantId or consultantEmail" }, { status: 400 });
    }

    // Insert message
    const [result]: any = await db.query(
      "INSERT INTO ChatHistory (user_id, consultant_id, message, timestamp, sender) VALUES (?, ?, ?, NOW(), ?)",
      [userId, consultantId, message, sender]
    );

    return NextResponse.json({
      success: true,
      chatId: result.insertId,
      timestamp: new Date()
    });
  } catch (error) {
    console.error("Error saving chat message:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
