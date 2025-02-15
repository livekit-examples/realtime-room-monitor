import { useConnectionState, useLocalParticipant, useRoomInfo } from "@livekit/components-react";
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

export const useLivekitLocalParticipantState = () => {
  const {
    isMicrophoneEnabled,
    isScreenShareEnabled,
    isCameraEnabled,
    microphoneTrack,
    cameraTrack,
    lastMicrophoneError,
    lastCameraError,
    localParticipant: {
      identity,
      audioTrackPublications,
      videoTrackPublications,
      trackPublications,
      audioLevel,
      isSpeaking,
      permissions,
      sid,
      name,
      metadata,
      attributes,
      lastSpokeAt,
      joinedAt,
      connectionQuality, // Excellent, Good, Poor, Lost, Unknown
    },
  } = useLocalParticipant();

  return {
    isMicrophoneEnabled,
    isScreenShareEnabled,
    isCameraEnabled,
    microphoneTrack,
    cameraTrack,
    lastMicrophoneError,
    lastCameraError,
    identity,
    audioTrackPublications,
    videoTrackPublications,
    trackPublications,
    audioLevel,
    isSpeaking,
    permissions,
    sid,
    name,
    metadata,
    attributes,
    lastSpokeAt,
    joinedAt,
    connectionQuality,
  };
};

export const useLivekitState = () => {
  const room = useLivekitRoomState();
  const localParticipant = useLivekitLocalParticipantState();

  return {
    room,
    localParticipant,
  };
};
