import { getLiveKitCredentialsFromRequest } from "@/lib/livekit-utils";
import { RoomServiceClient } from "livekit-server-sdk";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { API_KEY, API_SECRET, LIVEKIT_URL } = await getLiveKitCredentialsFromRequest(request);
    const { roomName, identity } = await request.json();

    if (!roomName || !identity) {
      return new NextResponse("Missing roomName or identity", { status: 400 });
    }

    const roomService = new RoomServiceClient(LIVEKIT_URL, API_KEY, API_SECRET);
    await roomService.removeParticipant(roomName, identity);

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleError(error);
  }
}

function handleError(error: unknown) {
  console.error(error);
  return new NextResponse(error instanceof Error ? error.message : "Internal server error", {
    status: 500,
  });
}
