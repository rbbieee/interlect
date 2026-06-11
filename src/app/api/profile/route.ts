import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, name, email, password, currentPassword, expertise } = body;

    if (!userId || !currentPassword) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    // 1. Verify current password
    const [rows]: any = await db.query(
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

    const isConsultant = dbUser.email.endsWith("@interlect.com");

    // 2. Perform updates
    const updates: string[] = [];
    const params: any[] = [];

    if (name && name !== dbUser.name) {
      updates.push("name = ?");
      params.push(name);

      // If user is a consultant (email ends with @interlect.com), also update Consultant name
      if (isConsultant) {
        await db.query(
          "UPDATE Consultant SET name = ? WHERE email = ?",
          [name, dbUser.email]
        );
      }
    }

    if (email && email !== dbUser.email) {
      // Check if the new email is already taken
      const [emailCheck]: any = await db.query(
        "SELECT * FROM user WHERE email = ? AND user_id != ?",
        [email, userId]
      );
      if (emailCheck.length > 0) {
        return NextResponse.json({ success: false, message: "Email is already in use" });
      }
      
      updates.push("email = ?");
      params.push(email);

      // If this user is a consultant, also update the Consultant email link
      if (isConsultant || email.endsWith("@interlect.com")) {
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

    // Update consultant expertise if provided
    if (isConsultant && expertise) {
      await db.query(
        "UPDATE Consultant SET expertise = ? WHERE email = ?",
        [expertise, email || dbUser.email]
      );
    }

    let finalExpertise = null;
    if (isConsultant) {
      const [consRows]: any = await db.query(
        "SELECT expertise FROM Consultant WHERE email = ?",
        [email || dbUser.email]
      );
      if (consRows.length > 0) {
        finalExpertise = consRows[0].expertise;
      }
    }

    return NextResponse.json({
      success: true,
      user: {
        name: name || dbUser.name,
        email: email || dbUser.email,
        expertise: finalExpertise
      }
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json({ success: false, message: "Database update error" }, { status: 500 });
  }
}
