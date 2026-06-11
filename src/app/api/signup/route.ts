import db from "../../../lib/db";

export async function POST(req: Request) {
  const body = await req.json();
  const { email, password } = body;

  if (!email || !password) {
    return Response.json({ success: false, message: "Missing fields" }, { status: 400 });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return Response.json({ success: false, message: "Invalid email format" }, { status: 400 });
  }

  if (password.length < 8) {
    return Response.json({ success: false, message: "Password must be at least 8 characters long" }, { status: 400 });
  }

  try {
    // Check if user already exists
    const [existingUsers]: any = await db.query(
      "SELECT * FROM user WHERE email = ?",
      [email]
    );

    if (existingUsers.length > 0) {
      return Response.json({ success: false, message: "User already exists" }, { status: 400 });
    }

    // Insert new user
    const emailPrefix = email.split("@")[0];
    const name = emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1);

    await db.query(
      "INSERT INTO user (name, email, password) VALUES (?, ?, ?)",
      [name, email, password]
    );

    // If consultant email, also insert into Consultant table
    if (email.endsWith("@interlect.com")) {
      await db.query(
        "INSERT INTO Consultant (name, expertise, rating, email) VALUES (?, ?, ?, ?)",
        [name, "Educational Admissions", 5.0, email]
      );
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Signup Database Error:", error);
    return Response.json({ success: false, message: "Database error" }, { status: 500 });
  }
}
