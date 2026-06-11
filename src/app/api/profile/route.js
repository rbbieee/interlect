import { NextResponse } from "next/server";
import db from "../../../lib/db";

export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, name, email, password, currentPassword } = body;

    if (!userId || !currentPassword) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    // 1. Verify current password
    const [rows] = await db.query(
      "SELECT * FROM user WHERE user_id = ?",
      [userId]
    );

    if (rows.length === 0) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    const dbUser = rows[0];
    if (dbUser.password !== currentPassword) {
      return NextResponse.json({ success: false, message: "Incorrect current password" });
    }

    // 2. Perform updates
    const updates = [];
    const params = [];

    if (name && name !== dbUser.name) {
      updates.push("name = ?");
      params.push(name);

      // If user is a consultant (email ends with @interlect.com), also update Consultant name
      if (dbUser.email.endsWith("@interlect.com")) {
        await db.query(
          "UPDATE Consultant SET name = ? WHERE email = ?",
          [name, dbUser.email]
        );
      }
    }

    if (email && email !== dbUser.email) {
      // Check if the new email is already taken
      const [emailCheck] = await db.query(
        "SELECT * FROM user WHERE email = ? AND user_id != ?",
        [email, userId]
      );
      if (emailCheck.length > 0) {
        return NextResponse.json({ success: false, message: "Email is already in use" });
      }
      
      updates.push("email = ?");
      params.push(email);

      // If this user is a consultant, also update the Consultant email link
      if (dbUser.email.endsWith("@interlect.com") || email.endsWith("@interlect.com")) {
        await db.query(
          "UPDATE Consultant SET email = ? WHERE email = ?",
          [email, dbUser.email]
        );
      }
    }

    if (password) {
      updates.push("password = ?");
      params.push(password);
    }

    if (updates.length > 0) {
      params.push(userId);
      await db.query(
        `UPDATE user SET ${updates.join(", ")} WHERE user_id = ?`,
        params
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        name: name || dbUser.name,
        email: email || dbUser.email
      }
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json({ success: false, message: "Database update error" }, { status: 500 });
  }
}
