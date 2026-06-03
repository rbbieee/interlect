import db from "../../../lib/db";

export async function POST(req: Request) {
  const body = await req.json();
  const { email, password } = body;

  try {
    const [rows]: any = await db.query(
      "SELECT * FROM user WHERE email = ? AND password = ?",
      [email, password]
    );

    if (rows.length > 0) {
      return Response.json({ success: true });
    } else {
      return Response.json({ success: false });
    }
  } catch (error) {
    return Response.json({ success: false });
  }
}