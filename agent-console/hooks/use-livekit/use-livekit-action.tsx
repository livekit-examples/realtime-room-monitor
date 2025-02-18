import { useRoomInfo } from "@/hooks/use-room-info";
import { useRoomContext } from "@livekit/components-react";
import { useCallback } from "react";
import { useConnectionDetails } from "./use-conn-details";

export const useLivekitRoomAction = () => {
  const room = useRoomContext();
  const { roomName, userId } = useRoomInfo();
  const { updateConnectionDetails } = useConnectionDetails();

  const handleConnect = useCallback(async () => {
    const url = new URL(
      process.env.NEXT_PUBLIC_CONN_DETAILS_ENDPOINT ?? "/api/connection-details",
      window.location.origin
    );

    url.searchParams.set("roomName", roomName);
    url.searchParams.set("userId", userId);

    const response = await fetch(url.toString());
    const connectionDetailsData = await response.json();
    updateConnectionDetails(connectionDetailsData);
  }, [roomName, updateConnectionDetails, userId]);

  const handleDisconnect = useCallback(async () => {
    if (room) await room.disconnect();
    updateConnectionDetails(undefined);
  }, [room, updateConnectionDetails]);

  return {
    connect: handleConnect,
    disconnect: handleDisconnect,
  };
};

export const useLivekitAction = () => {
  const room = useLivekitRoomAction();

  return {
    room,
  };
};
