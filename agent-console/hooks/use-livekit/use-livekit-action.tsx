import { useRoomContext } from "@livekit/components-react";
import { useCallback } from "react";
import { useConnectionDetails } from "./use-conn-details";

export const useLivekitRoomAction = () => {
  const { updateConnectionDetails } = useConnectionDetails();
  const room = useRoomContext();

  const handleConnect = useCallback(async () => {
    // Generate room connection details, including:
    //   - A random Room name
    //   - A random Participant name
    //   - An Access Token to permit the participant to join the room
    //   - The URL of the LiveKit server to connect to
    //
    // In real-world application, you would likely allow the user to specify their
    // own participant name, and possibly to choose from existing rooms to join.

    const url = new URL(
      process.env.NEXT_PUBLIC_CONN_DETAILS_ENDPOINT ?? "/api/connection-details",
      window.location.origin
    );

    const response = await fetch(url.toString());
    const connectionDetailsData = await response.json();
    console.log("connectionDetailsData", connectionDetailsData);
    updateConnectionDetails(connectionDetailsData);
  }, [updateConnectionDetails]);

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
