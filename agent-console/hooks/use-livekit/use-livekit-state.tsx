import { useConnectionState, useRoomInfo } from "@livekit/components-react";
import { useConnectionDetails } from "./use-conn-details";

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

export const useLivekitState = () => {
  const room = useLivekitRoomState();

  return {
    room,
  };
};
