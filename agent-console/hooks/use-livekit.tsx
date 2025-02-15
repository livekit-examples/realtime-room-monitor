import { useConnectionState, useRoomInfo } from "@livekit/components-react";

export const useLivekitRoomState = () => {
  const connectionState = useConnectionState();
  const { name, metadata } = useRoomInfo();

  return {
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
