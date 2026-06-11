import { NextResponse } from "next/server";
import db from "@/lib/db";

// POST handler for call state signaling and mutation
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, callerEmail, receiverEmail, callType, sdpOffer, sdpAnswer, callId, role, candidate } = body;

    if (!action) {
      return NextResponse.json({ success: false, message: "Missing action parameter" }, { status: 400 });
    }

    if (action === "initiate") {
      if (!callerEmail || !receiverEmail || !callType || !sdpOffer) {
        return NextResponse.json({ success: false, message: "Missing required initiate parameters" }, { status: 400 });
      }

      // Mark any prior active calls between these two as ended to clean up
      await db.query(
        "UPDATE VideoCallSession SET status = 'ended' WHERE (caller_email = ? AND receiver_email = ?) AND status != 'ended'",
        [callerEmail, receiverEmail]
      );

      // Insert new call session
      const [result]: any = await db.query(
        "INSERT INTO VideoCallSession (caller_email, receiver_email, call_type, sdp_offer, status) VALUES (?, ?, ?, ?, 'ringing')",
        [callerEmail, receiverEmail, callType, JSON.stringify(sdpOffer)]
      );

      return NextResponse.json({
        success: true,
        callId: result.insertId,
        status: "ringing"
      });
    }

    if (action === "answer") {
      if (!callId || !sdpAnswer) {
        return NextResponse.json({ success: false, message: "Missing callId or sdpAnswer" }, { status: 400 });
      }

      await db.query(
        "UPDATE VideoCallSession SET sdp_answer = ?, status = 'active' WHERE id = ?",
        [JSON.stringify(sdpAnswer), callId]
      );

      return NextResponse.json({ success: true });
    }

    if (action === "candidate") {
      if (!callId || !role || !candidate) {
        return NextResponse.json({ success: false, message: "Missing candidate parameters" }, { status: 400 });
      }

      // Fetch the call
      const [rows]: any = await db.query("SELECT caller_ice, receiver_ice FROM VideoCallSession WHERE id = ?", [callId]);
      if (rows.length === 0) {
        return NextResponse.json({ success: false, message: "Call session not found" }, { status: 404 });
      }

      const column = role === "caller" ? "caller_ice" : "receiver_ice";
      const existingJson = rows[0][column];
      let candidates = [];
      if (existingJson) {
        try {
          candidates = JSON.parse(existingJson);
        } catch (e) {
          candidates = [];
        }
      }
      candidates.push(candidate);

      await db.query(
        `UPDATE VideoCallSession SET ${column} = ? WHERE id = ?`,
        [JSON.stringify(candidates), callId]
      );

      return NextResponse.json({ success: true });
    }

    if (action === "end") {
      if (!callId) {
        return NextResponse.json({ success: false, message: "Missing callId" }, { status: 400 });
      }

      await db.query(
        "UPDATE VideoCallSession SET status = 'ended' WHERE id = ?",
        [callId]
      );

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, message: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    console.error("Signaling POST Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// GET handler to retrieve call session details (polling)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    const peer = searchParams.get("peer");

    if (!email) {
      return NextResponse.json({ success: false, message: "Missing email parameter" }, { status: 400 });
    }

    let query = "";
    let params: string[] = [];

    if (peer) {
      // Fetch latest call between the two users that is NOT ended
      query = `
        SELECT * FROM VideoCallSession 
        WHERE (
          (caller_email = ? AND receiver_email = ?) 
          OR 
          (caller_email = ? AND receiver_email = ?)
        )
        ORDER BY id DESC LIMIT 1
      `;
      params = [email, peer, peer, email];
    } else {
      // Consultant incoming call polling: fetch active incoming ringing calls
      query = `
        SELECT * FROM VideoCallSession 
        WHERE receiver_email = ? AND status = 'ringing'
        ORDER BY id DESC LIMIT 1
      `;
      params = [email];
    }

    const [rows]: any = await db.query(query, params);

    if (rows.length === 0) {
      return NextResponse.json({ success: true, call: null });
    }

    const rawCall = rows[0];
    
    // Parse JSON values for client use
    const call = {
      id: rawCall.id,
      callerEmail: rawCall.caller_email,
      receiverEmail: rawCall.receiver_email,
      callType: rawCall.call_type,
      sdpOffer: rawCall.sdp_offer ? JSON.parse(rawCall.sdp_offer) : null,
      sdpAnswer: rawCall.sdp_answer ? JSON.parse(rawCall.sdp_answer) : null,
      callerIce: rawCall.caller_ice ? JSON.parse(rawCall.caller_ice) : [],
      receiverIce: rawCall.receiver_ice ? JSON.parse(rawCall.receiver_ice) : [],
      status: rawCall.status,
      createdAt: rawCall.created_at
    };

    return NextResponse.json({ success: true, call });
  } catch (error: any) {
    console.error("Signaling GET Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
