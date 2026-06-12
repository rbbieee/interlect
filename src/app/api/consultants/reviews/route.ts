import { NextResponse } from "next/server";
import db from "@/lib/db";

// GET: Retrieve all reviews for a specific consultant
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const consultantId = searchParams.get("consultantId");

  if (!consultantId) {
    return NextResponse.json({ error: "Missing consultantId parameter" }, { status: 400 });
  }

  try {
    const [rows]: any = await db.query(
      `SELECT r.review_id as id, r.rating, r.comment, r.created_at as createdAt, u.name as reviewerName 
       FROM Review r 
       JOIN user u ON r.user_id = u.user_id 
       WHERE r.consultant_id = ? 
       ORDER BY r.created_at DESC`,
      [consultantId]
    );

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error fetching consultant reviews:", error);
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}

// POST: Submit a new review for a consultant
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, consultantId, rating, comment } = body;

    if (!userId || !consultantId || !rating || !comment) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ success: false, message: "Rating must be between 1 and 5" }, { status: 400 });
    }

    // 1. Insert the new review
    await db.query(
      "INSERT INTO Review (user_id, consultant_id, rating, comment, created_at) VALUES (?, ?, ?, ?, NOW())",
      [userId, consultantId, rating, comment]
    );

    // 2. Recalculate average rating for this consultant
    const [avgRows]: any = await db.query(
      "SELECT AVG(rating) as avgRating FROM Review WHERE consultant_id = ?",
      [consultantId]
    );

    let newAvgRating = 5.0;
    if (avgRows.length > 0 && avgRows[0].avgRating !== null) {
      newAvgRating = parseFloat(avgRows[0].avgRating);
    }

    // 3. Update the Consultant table with the new average rating
    await db.query(
      "UPDATE Consultant SET rating = ? WHERE consultant_id = ?",
      [newAvgRating, consultantId]
    );

    return NextResponse.json({ success: true, newRating: newAvgRating });
  } catch (error) {
    console.error("Error submitting consultant review:", error);
    return NextResponse.json({ success: false, message: "Failed to submit review" }, { status: 500 });
  }
}
