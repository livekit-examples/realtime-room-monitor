import {
  useConnectionQualityIndicator,
  useConnectionState,
  useIsMuted,
  useIsSpeaking,
  useParticipantAttributes,
  useParticipantInfo,
  useParticipantPermissions,
  useParticipants,
  useParticipantTracks,
  useRoomContext,
  useRoomInfo,
} from "@livekit/components-react";
import {
  ConnectionQuality,
  isLocalParticipant,
  LocalParticipant,
  Participant,
  Track,
} from "livekit-client";
import { useMemo } from "react";
import { useConnectionDetails } from "./use-conn-details";

export const useLivekitRoomState = () => {
  const { connectionDetails } = useConnectionDetails();

  const { serverInfo } = useRoomContext();
  const { name, metadata } = useRoomInfo();
  const connectionState = useConnectionState();

  return {
    connectionDetails,
    connectionState,
    name,
    metadata,
    serverInfo,
  };
};

export const useLivekitParticipantState = (participant: Participant | undefined) => {
  const {
    isLocal,
    isMicrophoneEnabled,
    isScreenShareEnabled,
    isCameraEnabled,
    audioLevel,
    sid,
    lastSpokeAt,
    joinedAt,
  } = useMemo(() => {
    if (!participant) {
      return {
        isLocal: false,
        isMicrophoneEnabled: false,
        isScreenShareEnabled: false,
        isCameraEnabled: false,
        audioLevel: 0,
        sid: "",
        lastSpokeAt: undefined,
        joinedAt: undefined,
        connectionQuality: ConnectionQuality.Unknown,
      };
    }

    return { ...participant, isLocal: isLocalParticipant(participant) };
  }, [participant]);

  const { quality: connectionQuality } = useConnectionQualityIndicator({ participant });
  const isSpeaking = useIsSpeaking(participant);
  const permissions = useParticipantPermissions({ participant: participant });
  const { identity, name, metadata } = useParticipantInfo({ participant: participant });
  const { attributes } = useParticipantAttributes({ participant: participant });

  const tracks = useParticipantTracks(
    [
      Track.Source.Camera,
      Track.Source.Microphone,
      Track.Source.ScreenShare,
      Track.Source.ScreenShareAudio,
      Track.Source.Unknown,
    ],
    participant?.identity
  );

  const microphoneTracks = tracks.filter((track) => track.source === Track.Source.Microphone);
  const cameraTracks = tracks.filter((track) => track.source === Track.Source.Camera);
  const screenShareTracks = tracks.filter((track) => track.source === Track.Source.ScreenShare);
  const screenShareAudioTracks = tracks.filter(
    (track) => track.source === Track.Source.ScreenShareAudio
  );
  const unknownTracks = tracks.filter((track) => track.source === Track.Source.Unknown);

  const isMicrophoneMuted = useIsMuted(Track.Source.Microphone, { participant }); // eslint-disable-line
  const isCameraMuted = useIsMuted(Track.Source.Camera, { participant }); // eslint-disable-line
  const isScreenShareMuted = useIsMuted(Track.Source.ScreenShare, { participant }); // eslint-disable-line
  const isScreenShareAudioMuted = useIsMuted(Track.Source.ScreenShareAudio, { participant }); // eslint-disable-line
  const isUnknownMuted = useIsMuted(Track.Source.Unknown, { participant }); // eslint-disable-line

  const lastMicrophoneError = useMemo(() => {
    if (!participant) return undefined;
    return isLocal ? (participant as unknown as LocalParticipant)?.lastMicrophoneError : undefined;
  }, [isLocal, participant]);

  const lastCameraError = useMemo(() => {
    if (!participant) return undefined;
    return isLocal ? (participant as unknown as LocalParticipant)?.lastCameraError : undefined;
  }, [isLocal, participant]);

  return {
    isLocal,
    isMicrophoneEnabled: isMicrophoneEnabled || false,
    isScreenShareEnabled: isScreenShareEnabled || false,
    isCameraEnabled: isCameraEnabled || false,
    connectionQuality: connectionQuality || ConnectionQuality.Unknown,
    audioLevel,
    sid,
    lastSpokeAt,
    joinedAt,
    isSpeaking,
    permissions,
    identity,
    name,
    metadata,
    attributes,
    muted: {
      microphone: isMicrophoneMuted,
      camera: isCameraMuted,
      screenShare: isScreenShareMuted,
      screenShareAudio: isScreenShareAudioMuted,
      unknown: isUnknownMuted,
    },
    tracks: {
      microphoneTracks,
      cameraTracks,
      screenShareTracks,
      screenShareAudioTracks,
      unknownTracks,
    },
    errors: {
      lastMicrophoneError,
      lastCameraError,
    },
  };
};

export const useLivekitState = () => {
  const room = useLivekitRoomState();
  const participants = useParticipants();
  const localParticipant = participants.find((p) => isLocalParticipant(p));
  const localParticipantState = useLivekitParticipantState(localParticipant);

  return {
    room,
    localParticipant: localParticipantState,
  };
};
