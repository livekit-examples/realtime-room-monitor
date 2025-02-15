import { ConnectionDetails } from "@/app/api/connection-details/route";
import { useConnectionState, useRoomInfo } from "@livekit/components-react";
import { useCallback } from "react";
import { create } from "zustand";

const useConnectionDetails = create<{
  connectionDetails: ConnectionDetails | undefined;
  updateConnectionDetails: (connectionDetails: ConnectionDetails) => void;
}>((set) => ({
  connectionDetails: undefined,
  updateConnectionDetails: (connectionDetails) => set({ connectionDetails }),
}));

export const useLivekitRoomState = () => {
  const { connectionDetails } = useConnectionDetails();

  const { name, metadata } = useRoomInfo();
  const connectionState = useConnectionState();

  return {
    connectionDetails,
    connectionState,
    name,
    metadata,
  };
};

export const useLivekitRoomAction = () => {
  const { updateConnectionDetails } = useConnectionDetails();

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
    updateConnectionDetails(connectionDetailsData);
  }, [updateConnectionDetails]);

  const handleDisconnect = useCallback(async () => {}, []);

  return {
    connect: handleConnect,
    disconnect: handleDisconnect,
  };
};

export const useLivekitState = () => {
  const room = useLivekitRoomState();

  return {
    room,
  };
};

export const useLivekitAction = () => {
  const room = useLivekitRoomAction();

  return {
    room,
  };
};
