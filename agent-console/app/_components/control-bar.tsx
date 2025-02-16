import { Button } from "@/components/ui/button";
import { supportsScreenSharing, ToggleSource } from "@livekit/components-core";
import {
  ControlBarProps,
  MediaDeviceMenu,
  MicDisabledIcon,
  MicIcon,
  TrackToggle,
  useLocalParticipantPermissions,
  useMaybeRoomContext,
  useMediaDeviceSelect,
  usePersistentUserChoices,
  useTrackToggle,
} from "@livekit/components-react";
import { Track } from "livekit-client";
import React from "react";

export const ControlBar = ({
  variation,
  controls,
  saveUserChoices = true,
  onDeviceError,
  ...props
}: ControlBarProps) => {
  const visibleControls = { leave: true, ...controls };
  const localPermissions = useLocalParticipantPermissions();

  console.log("localPermissions", localPermissions);

  if (!localPermissions) {
    visibleControls.camera = false;
    visibleControls.chat = false;
    visibleControls.microphone = false;
    visibleControls.screenShare = false;
  } else {
    visibleControls.camera ??= localPermissions.canPublish;
    visibleControls.microphone ??= localPermissions.canPublish;
    visibleControls.screenShare ??= localPermissions.canPublish;
    visibleControls.chat ??= localPermissions.canPublishData && controls?.chat;
  }

  const showIcon = React.useMemo(
    () => variation === "minimal" || variation === "verbose",
    [variation]
  );
  const showText = React.useMemo(
    () => variation === "textOnly" || variation === "verbose",
    [variation]
  );

  const browserSupportsScreenSharing = supportsScreenSharing();

  const [isScreenShareEnabled, setIsScreenShareEnabled] = React.useState(false);

  const {
    saveAudioInputEnabled,
    saveVideoInputEnabled,
    saveAudioInputDeviceId,
    saveVideoInputDeviceId,
  } = usePersistentUserChoices({ preventSave: !saveUserChoices });

  const microphoneOnChange = React.useCallback(
    (enabled: boolean, isUserInitiated: boolean) =>
      isUserInitiated ? saveAudioInputEnabled(enabled) : null,
    [saveAudioInputEnabled]
  );

  const onScreenShareChange = React.useCallback(
    (enabled: boolean) => {
      setIsScreenShareEnabled(enabled);
    },
    [setIsScreenShareEnabled]
  );

  const cameraOnChange = React.useCallback(
    (enabled: boolean, isUserInitiated: boolean) =>
      isUserInitiated ? saveVideoInputEnabled(enabled) : null,
    [saveVideoInputEnabled]
  );

  const { buttonProps: microphoneButtonProps, enabled: microphoneEnabled } = useTrackToggle({
    source: Track.Source.Microphone,
    onChange: microphoneOnChange,
  });

  const { buttonProps: cameraButtonProps, enabled: cameraEnabled } = useTrackToggle({
    source: Track.Source.Camera,
    onChange: cameraOnChange,
  });

  const { buttonProps: screenShareButtonProps, enabled: screenShareEnabled } = useTrackToggle({
    source: Track.Source.ScreenShare,
    onChange: onScreenShareChange,
  });

  return (
    <div {...props}>
      {visibleControls.microphone && (
        <MediaDeviceControl
          source={Track.Source.Microphone}
          setDeviceEnabled={saveAudioInputEnabled}
          setDeviceId={saveAudioInputDeviceId}
          enabledIcon={<MicIcon />}
          disabledIcon={<MicDisabledIcon />}
        />
      )}
      {visibleControls.microphone && (
        <div className="border rounded-md p-2 bg-red-500">
          <TrackToggle
            source={Track.Source.Microphone}
            showIcon={showIcon}
            onChange={microphoneOnChange}
            onDeviceError={(error) => onDeviceError?.({ source: Track.Source.Microphone, error })}
          >
            {showText && "Microphone"}
          </TrackToggle>
          <div className="lk-button-group-menu">
            <MediaDeviceMenu
              kind="audioinput"
              onActiveDeviceChange={(_kind, deviceId) =>
                saveAudioInputDeviceId(deviceId ?? "default")
              }
            />
          </div>
        </div>
      )}
      {visibleControls.camera && (
        <div className="border rounded-md p-2 bg-blue-500">
          <TrackToggle
            source={Track.Source.Camera}
            showIcon={showIcon}
            onChange={cameraOnChange}
            onDeviceError={(error) => onDeviceError?.({ source: Track.Source.Camera, error })}
          >
            {showText && "Camera"}
          </TrackToggle>
          <div className="lk-button-group-menu">
            <MediaDeviceMenu
              kind="videoinput"
              onActiveDeviceChange={(_kind, deviceId) =>
                saveVideoInputDeviceId(deviceId ?? "default")
              }
            />
          </div>
        </div>
      )}
      {visibleControls.screenShare && browserSupportsScreenSharing && (
        <TrackToggle
          source={Track.Source.ScreenShare}
          captureOptions={{ audio: true, selfBrowserSurface: "include" }}
          showIcon={showIcon}
          onChange={onScreenShareChange}
          onDeviceError={(error) => onDeviceError?.({ source: Track.Source.ScreenShare, error })}
        >
          {showText && (isScreenShareEnabled ? "Stop screen share" : "Share screen")}
        </TrackToggle>
      )}
    </div>
  );
};

const MediaDeviceControl = <T extends ToggleSource>({
  source,
  kind,
  setDeviceEnabled,
  setDeviceId,
  enabledIcon,
  disabledIcon,
}: {
  source: T;
  kind: MediaDeviceKind;
  setDeviceEnabled: (enabled: boolean) => void;
  setDeviceId: (deviceId: string) => void;
  enabledIcon: React.ReactNode;
  disabledIcon: React.ReactNode;
}) => {
  const room = useMaybeRoomContext();
  const { buttonProps, enabled } = useTrackToggle({
    source,
    onChange: setDeviceEnabled,
  });
  const { devices, className, activeDeviceId, setActiveMediaDevice } = useMediaDeviceSelect({
    kind: kind,
    room: room,
    requestPermissions: true,
    onError: (error) => {
      // TODO: log error
      console.error(error);
    },
  });

  return <Button {...buttonProps}>{enabled ? enabledIcon : disabledIcon}</Button>;
};
