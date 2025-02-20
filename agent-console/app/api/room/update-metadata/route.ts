import { getLiveKitCredentialsFromRequest } from "@/lib/livekit-utils";
import { RoomServiceClient } from "livekit-server-sdk";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { API_KEY, API_SECRET, LIVEKIT_URL } = await getLiveKitCredentialsFromRequest(request);
    const { roomName, metadata }: { roomName: string; metadata: string } = await request.json();
    if (!roomName || typeof metadata !== "string") {
      return new NextResponse("Invalid request body", { status: 400 });
    }

    const roomService = new RoomServiceClient(LIVEKIT_URL, API_KEY, API_SECRET);
    const updatedRoom = await roomService.updateRoomMetadata(roomName, metadata);

    return NextResponse.json(updatedRoom);
  } catch (error) {
    console.error("Error updating room metadata:", error);
    return new NextResponse(error instanceof Error ? error.message : "Internal server error", {
      status: 500,
    });
  }
}
