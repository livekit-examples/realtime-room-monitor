import { getLiveKitCredentials } from "@/lib/livekit-utils";
import { AccessToken, AccessTokenOptions, VideoGrant } from "livekit-server-sdk";
import { NextResponse } from "next/server";

const { API_KEY, API_SECRET, LIVEKIT_URL } = getLiveKitCredentials();

export const revalidate = 0;

export type ConnectionDetails = {
  serverUrl: string;
  roomName: string;
  participantName: string;
  participantToken: string;
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const roomName = searchParams.get("roomName");
    const userId = searchParams.get("userId");

    if (!roomName || !userId) {
      throw new Error("Missing roomName or userId parameters");
    }

    // Generate participant token with provided values
    const participantToken = await createParticipantToken({ identity: userId }, roomName);

    const data: ConnectionDetails = {
      serverUrl: LIVEKIT_URL!,
      roomName,
      participantToken,
      participantName: userId,
    };

    return NextResponse.json(data, { headers: new Headers({ "Cache-Control": "no-store" }) });
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
      return new NextResponse(error.message, { status: 500 });
    }
  }
}

function createParticipantToken(userInfo: AccessTokenOptions, roomName: string) {
  const at = new AccessToken(API_KEY, API_SECRET, {
    ...userInfo,
    ttl: "15m",
  });

  const grant: VideoGrant = {
    room: roomName,
    roomJoin: true,
    canPublish: true,
    canPublishData: true,
    canSubscribe: true,
  };

  at.addGrant(grant);
  return at.toJwt();
}
